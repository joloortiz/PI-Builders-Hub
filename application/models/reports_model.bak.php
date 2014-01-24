<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Reports_model extends CI_Model {

	# Get Sales Report By Date Range
	function get_sales_report_by_date_range($datefrom, $dateto) {
		$sql = "
			SELECT
			IFNULL (
				(
					SELECT
					    (
					        IFNULL(
					            SUM(od.od_selling_price * od.od_qty),
					            0
					        )
					        +
					        (
					            IFNULL(
					                SUM(od.od_discount * od.od_qty),
					                0
					            )
					            *
					            (-1)
					        )
					        +
					        IFNULL(
					            (
					                SELECT 
					                    SUM(cod.cod_selling_price * cod.cod_qty) - SUM(cod.cod_selling_price * cod.cod_discount)
					                FROM
					                    change_orders co
					                LEFT JOIN
					                    change_order_details cod ON co.co_id = cod.co_id
					                WHERE
					                    co.o_id IN (
					                        SELECT o_id 
					                        FROM orders 
					                        WHERE 
					                            o.o_status = 'P'
					                            AND o.o_date BETWEEN '$datefrom' AND '$dateto'
					                    )
					                    AND cod.cod_type = 'N'
					            ),
					            0
					        )
					        +
					        (
					            IFNULL(
					                (
					                    SELECT 
					                        SUM(cod.cod_selling_price * cod.cod_qty) - SUM(cod.cod_selling_price * cod.cod_discount)
					                    FROM
					                        change_orders co
					                    LEFT JOIN
					                        change_order_details cod ON co.co_id = cod.co_id
					                    WHERE
					                        co.o_id IN (
					                            SELECT o_id 
					                            FROM orders 
					                            WHERE 
					                                o.o_status = 'P'
					                                AND o.o_date BETWEEN '$datefrom' AND '$dateto'
					                        )
					                        AND cod.cod_type = 'O'
					                ),
					                0
					            )
					            *
					            (-1)
					        )
					    ) AS sales
					FROM
					    orders o
					LEFT JOIN
					    order_details od ON o.o_id = od.o_id
					WHERE
					    o.o_status = 'P'
					    AND o.o_amount_tendered >= (SELECT SUM(od_selling_price * od_qty) - SUM(od_discount * od_qty) FROM order_details WHERE o_id = o.o_id) 
					    AND o.o_date BETWEEN '$datefrom' AND '$dateto'
				)
				+
				IFNULL(
					(
						SELECT SUM(crp_amount_payed) AS amount_payed
						FROM 
						    credit_payments crp
						LEFT JOIN
						    credits cr ON crp.cr_id = cr.cr_id
						LEFT JOIN
						    orders o ON cr.o_id = o.o_id
						WHERE
						    o.o_status = 'P'
						    AND crp.crp_date BETWEEN '$datefrom' AND '$dateto'
					),
					0
				),
				0
			)
			AS sales
		";
		$query = $this->db->query($sql);
		return $query->result_array();
	}

	# Get Items for Reordering
	function get_items_reordering($query='', $start='', $limit='', $c_id='', $s_id='') {
		// Select
		$this->db->select('i.*, c.c_id, c.c_name, u.u_id, u.u_name, u.u_slug_name, s.s_id, s.s_name, v_items.qty_on_hand');
		$this->db->from('items i');
		$this->db->join('categories c', 'i.c_id = c.c_id', 'left');
		$this->db->join('units u', 'i.u_id = u.u_id', 'left');
		$this->db->join('suppliers s', 'i.s_id = s.s_id', 'left');
		$this->db->join('v_get_items_qty_on_hand v_items', 'i.i_id = v_items.i_id', 'left');

		// Options
		if($query != '') {
			$filter_query = array();
			$filter_query[] = "i.i_name LIKE '" . $query . "%'";
			$this->db->where('(' . implode(' OR ', $filter_query) . ')');
		}
		if($c_id != '' && $c_id != 'all') {
			$this->db->where('i.c_id', $c_id);
		}
		if($s_id != '' && $s_id != 'all') {
			$this->db->where('i.s_id', $s_id);
		}
		$this->db->where('v_items.qty_on_hand <= i.i_reorder_level', NULL, FALSE);
		$this->db->order_by('v_items.qty_on_hand', 'asc');
		$this->db->order_by('i.i_name', 'asc');

		// Get Data
		if($start == '' && $limit == '') {
			$query = $this->db->get();
		} else {
			$this->db->limit($limit, $start);
			$query = $this->db->get();
		}
		return $query->result_array();
	}

	# Get Items Movement
	function get_items_movement($query='', $start='', $limit='', $datefrom='', $dateto='', $qtyfrom='', $qtyto='') {
		// Options
		$filter_sql_query = '';
		if($query != '') {
			$filter_query = array();
			$filter_query[] = "i.i_name LIKE '" . $query . "%'";
			$filter_sql_query = '(' . implode(' OR ', $filter_query) . ')';
		}

		$sql = "
			SELECT *
			FROM (
			    SELECT
			        i.*,
					c.c_name,
					u.u_name,
					u.u_slug_name,
					s.s_name,
			        (
			            IFNULL(
			                (
			                    SELECT SUM(od_qty) 
			                    FROM order_details 
			                    WHERE 
			                        o_id IN(
			                        	SELECT o_id
			                        	FROM orders
										WHERE 
											o_status = 'P'
											" . ($datefrom != '' ? "AND o_date >= '$datefrom'" : '') . "
											" . ($dateto != '' ? "AND o_date <= '$dateto'" : '') . "
			                        )
			                        AND i_id = i.i_id
			                ),
			                0
			            )
			            +
			            IFNULL(
			                (
			                    SELECT SUM(cod_qty)
			                    FROM change_order_details
			                    WHERE
			                        co_id IN(
			                        	SELECT co_id
			                        	FROM change_orders
			                        	WHERE
			                        		o_id IN(
			                        			SELECT o_id
			                        			FROM orders
			                        			WHERE 
			                        				o_status = 'P'
			                        				" . ($datefrom != '' ? "AND o_date >= '$datefrom'" : '') . "
													" . ($dateto != '' ? "AND o_date <= '$dateto'" : '') . "
			                        		)
			                        )
			                        AND cod_type = 'N'
			                        AND i_id = i.i_id
			                ),
			                0
			            )
			            +
			            IFNULL(
			                (
			                    SELECT SUM(cod_qty)
			                    FROM change_order_details
			                    WHERE
			                        co_id IN(
			                        	SELECT co_id
			                        	FROM change_orders
			                        	WHERE
			                        		o_id IN(
			                        			SELECT o_id
			                        			FROM orders
			                        			WHERE 
			                        				o_status = 'P'
			                        				" . ($datefrom != '' ? "AND o_date >= '$datefrom'" : '') . "
													" . ($dateto != '' ? "AND o_date <= '$dateto'" : '') . "
			                        		)
			                        )
			                        AND cod_type = 'O'
			                        AND i_id = i.i_id
			                ) * -1,
			                0
			            )
			        ) AS item_movement
			    FROM
			        items i
				LEFT JOIN
					categories c ON i.c_id = c.c_id
				LEFT JOIN
					units u ON i.u_id = u.u_id
				LEFT JOIN
					suppliers s ON i.s_id = s.s_id
			)a
			WHERE
			    item_movement >= $qtyfrom
			    " . ($qtyto != '' ? "AND item_movement <= $qtyto" : '') . "
			    " . ($filter_sql_query != '' ? "AND $filter_sql_query" : '') . "
			ORDER BY
				i_name
			" . ($start != '' && $limit != '' ? "LIMIT $start, $limit" : '') . "
		";
		$query = $this->db->query($sql);
		return $query->result_array();
	}
}