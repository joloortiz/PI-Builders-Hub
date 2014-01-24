<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Orders_model extends CI_Model {

	# Get Orders
	function get_orders($query='', $start='', $limit='', $status='', $show_changed=false) {
		// Select
		$this->db->select('
			o.*,
			CONCAT(e.e_fname, \' \', e.e_lname) AS attended_name,
			(SELECT SUM((od_selling_price * od_qty) - (od_discount * od_qty)) FROM order_details WHERE o_id = o.o_id) AS total,
			CASE
				WHEN (SELECT COUNT(*) FROM change_orders WHERE o_id = o.o_id) > 0 THEN 1
				ELSE 0
			END AS changed_order
		', FALSE);
		$this->db->from('orders o');
		$this->db->join('employees e', 'o.o_attended_by = e.e_id', 'left');

		// Options
		if($query != '') {
			$filter_query = array();
			$filter_query[] = "o.o_order_number = '" . $query . "'";
			$this->db->where('(' . implode(' OR ', $filter_query) . ')');
		}
		if($status != '') {
			$this->db->where_in('o.o_status', $status);
		}
		if($show_changed == false) {
			$this->db->where('(SELECT COUNT(*) FROM change_orders WHERE o_id = o.o_id) = 0', NULL, FALSE);
		}
		$this->db->order_by('o.o_date', 'desc');

		// Get Data
		if($start == '' && $limit == '') {
			$query = $this->db->get();
		} else {
			$this->db->limit($limit, $start);
			$query = $this->db->get();
		}
		return $query->result_array();
	}

	# Get Order By Id
	function get_order_by_id($o_id) {
		// Select
		$this->db->select('
			o.*,
			CONCAT(e.e_fname, \' \', e.e_lname) AS attended_name,
			(SELECT SUM((od_selling_price * od_qty) - (od_discount * od_qty)) FROM order_details WHERE o_id = o.o_id) AS total
		', FALSE);
		$this->db->from('orders o');
		$this->db->join('employees e', 'o.o_attended_by = e.e_id', 'left');

		// Options
		$this->db->where('o.o_id', $o_id);

		// Get Data
		$query = $this->db->get();
		return $query->result_array();
	}

	# Get Order Items By Order Id
	function get_order_items_by_order_id($o_id) {
		// Select
		$this->db->select('od.*, i.i_name, i.i_attribute, u.u_id, u.u_name, u.u_slug_name');
		$this->db->from('order_details od');
		$this->db->join('items i', 'od.i_id = i.i_id', 'left');
		$this->db->join('units u', 'i.u_id = u.u_id', 'left');

		// Options
		$this->db->where('od.o_id', $o_id);

		// Get Data
		$query = $this->db->get();
		return $query->result_array();
	}

	# Get Change Order By Order Id
	function get_change_order_by_order_id($o_id) {
		// Select
		$this->db->select('
			co.*,
			CONCAT(e.e_fname, \' \', e.e_lname) AS attended_name
		', FALSE);
		$this->db->from('change_orders co');
		$this->db->join('employees e', 'co.co_attended_by = e.e_id', 'left');

		// Options
		$this->db->where('co.o_id', $o_id);

		// Get Data
		$query = $this->db->get();
		return $query->result_array();
	}

	# Get Change Order By Id
	function get_change_order_by_id($co_id) {
		// Select
		$this->db->select('
			co.*,
			CONCAT(e.e_fname, \' \', e.e_lname) AS attended_name
		', FALSE);
		$this->db->from('change_orders co');
		$this->db->join('employees e', 'co.co_attended_by = e.e_id', 'left');

		// Options
		$this->db->where('co.co_id', $co_id);

		// Get Data
		$query = $this->db->get();
		return $query->result_array();
	}

	# Get Change Order Items By Change Order Id
	function get_change_order_items_by_change_order_id($co_id) {
		// Select
		$this->db->select('cod.*, i.i_name, i.i_attribute, u.u_id, u.u_name, u.u_slug_name');
		$this->db->from('change_order_details cod');
		$this->db->join('items i', 'cod.i_id = i.i_id', 'left');
		$this->db->join('units u', 'i.u_id = u.u_id', 'left');

		// Options
		$this->db->where('cod.co_id', $co_id);

		// Get Data
		$query = $this->db->get();
		return $query->result_array();
	}

	# Get Credits
	function get_credits($query='', $start='', $limit='', $status='') {
		// Select
		$this->db->select('
			cr.*,
			o.*,
			CONCAT(e.e_fname, \' \', e.e_lname) AS attended_name,
			(SELECT SUM((od_selling_price * od_qty) - (od_discount * od_qty)) FROM order_details WHERE o_id = o.o_id) AS total,
			IFNULL(cr.cr_amount - IFNULL((SELECT SUM(crp_amount_payed) FROM credit_payments WHERE cr_id = cr.cr_id), 0), 0) AS remaining_credit,
			CASE
				WHEN IFNULL(cr.cr_amount - IFNULL((SELECT SUM(crp_amount_payed) FROM credit_payments WHERE cr_id = cr.cr_id), 0), 0) = 0 THEN \'F\'
				ELSE \'W\'
			END AS status		
		', FALSE);
		$this->db->from('credits cr');
		$this->db->join('orders o', 'cr.o_id = o.o_id', 'left');
		$this->db->join('employees e', 'o.o_attended_by = e.e_id', 'left');

		// Options
		if($query != '') {
			$filter_query = array();
			$filter_query[] = "o.o_order_number = '" . $query . "'";
			$filter_query[] = "e.e_fname LIKE '%" . $query . "%'";
			$filter_query[] = "e.e_lname LIKE '%" . $query . "%'";
			$this->db->where('(' . implode(' OR ', $filter_query) . ')');
		}
		if($status != '') {
			if($status == 'F') {
				$this->db->where('IFNULL(cr.cr_amount - IFNULL((SELECT SUM(crp_amount_payed) FROM credit_payments WHERE cr_id = cr.cr_id), 0), 0) = 0', NULL, FALSE);
			} elseif($status == 'W') {
				$this->db->where('IFNULL(cr.cr_amount - IFNULL((SELECT SUM(crp_amount_payed) FROM credit_payments WHERE cr_id = cr.cr_id), 0), 0) > 0', NULL, FALSE);
			}
		}
		$this->db->where('o.o_status', 'P');
		$this->db->order_by('o.o_date', 'desc');

		// Get Data
		if($start == '' && $limit == '') {
			$query = $this->db->get();
		} else {
			$this->db->limit($limit, $start);
			$query = $this->db->get();
		}
		return $query->result_array();
	}

	# Get Credit Payments
	function get_credit_payments($query='', $start='', $limit='', $cr_id='', $crp_id='') {
		// Select
		$this->db->select('crp.*, cr.*, o.*, CONCAT(e.e_fname, \' \', e.e_lname) AS attended_name, (cr_amount - (SELECT SUM(crp_amount_payed) FROM credit_payments WHERE cr_id = crp.cr_id)) AS remaining_credit', FALSE);
		$this->db->from('credit_payments crp');
		$this->db->join('credits cr', 'crp.cr_id = cr.cr_id', 'left');
		$this->db->join('orders o', 'cr.o_id = o.o_id', 'left');
		$this->db->join('employees e', 'crp.crp_attended_by = e.e_id', 'left');

		// Options
		if($query != '') {
			$filter_query = array();
			$filter_query[] = "e.e_fname LIKE '%" . $query . "%'";
			$filter_query[] = "e.e_lname LIKE '%" . $query . "%'";
			$this->db->where('(' . implode(' OR ', $filter_query) . ')');
		}
		if($cr_id != '') {
			$this->db->where('crp.cr_id', $cr_id);
		}
		if($crp_id != '') {
			$this->db->where('crp.crp_id', $crp_id);
		}
		$this->db->order_by('crp.crp_date', 'desc');

		// Get Data
		if($start == '' && $limit == '') {
			$query = $this->db->get();
		} else {
			$this->db->limit($limit, $start);
			$query = $this->db->get();
		}
		return $query->result_array();
	}

	# Get Credit Payment By Id
	function get_credit_payment_by_id($crp_id) {
		// Select
		$this->db->select('crp.*, cr.*, o.*, CONCAT(e.e_fname, \' \', e.e_lname) AS attended_name, (cr_amount - (SELECT SUM(crp_amount_payed) FROM credit_payments WHERE cr_id = crp.cr_id AND crp_date <= crp.crp_date)) AS remaining_credit', FALSE);
		$this->db->from('credit_payments crp');
		$this->db->join('credits cr', 'crp.cr_id = cr.cr_id', 'left');
		$this->db->join('orders o', 'cr.o_id = o.o_id', 'left');
		$this->db->join('employees e', 'crp.crp_attended_by = e.e_id', 'left');
		$this->db->where('crp.crp_id', $crp_id);

		// Get Data
		$query = $this->db->get();
		return $query->result_array();
	}

	# Insert
	function Insert($data) {
		$this->db->set('o_order_number', '(SELECT r_get_order_number())', FALSE);
		$this->db->set('o_date', 'NOW()', FALSE);
		$this->db->insert('orders', $data);
		return $this->db->insert_id();
	}

	# Insert Order Details
	function Insert_order_details($data) {
		$this->db->insert('order_details', $data);
		return;
	}

	# Insert Change Order
	function Insert_change_order($data) {
		$this->db->set('co_date', 'NOW()', FALSE);
		$this->db->insert('change_orders', $data);
		return $this->db->insert_id();
	}

	# Insert Change Order Details
	function Insert_change_order_details($data) {
		$this->db->insert('change_order_details', $data);
		return;
	}

	# Insert Credit
	function Insert_credit($data) {
		$this->db->insert('credits', $data);
		return;
	}

	# Insert Credit Payment
	function Insert_credit_payment($data) {
		$this->db->set('crp_date', 'NOW()', FALSE);
		$this->db->insert('credit_payments', $data);
		return $this->db->insert_id();
	}

	# Update
	function Update($data, $o_id) {
		$this->db->where('o_id', $o_id);
		$this->db->update('orders', $data);
		return;
	}
}