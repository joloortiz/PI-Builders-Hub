<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Items_model extends CI_Model {

	# Get Items
	function get_items($query='', $start='', $limit='', $show_deleted=false, $c_id='', $s_id='', $order_qty_on_hand='') {
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
			$filter_query[] = "i.i_name LIKE '%" . $query . "%'";
			// $filter_query[] = "i.i_attribute LIKE '%" . $query . "%'";
			// $filter_query[] = "c.c_name LIKE '%" . $query . "%'";
			// $filter_query[] = "u.u_name LIKE '%" . $query . "%'";
			// $filter_query[] = "s.s_name LIKE '%" . $query . "%'";
			$this->db->where('(' . implode(' OR ', $filter_query) . ')');
		}
		if($show_deleted == false) {
			$this->db->where('i.is_deleted', FALSE);
		}
		if($c_id != '' && $c_id != 'all') {
			$this->db->where('i.c_id', $c_id);
		}
		if($s_id != '' && $s_id != 'all') {
			$this->db->where('i.s_id', $s_id);
		}
		if($order_qty_on_hand != '') {
			if($order_qty_on_hand == 'asc') {
				$this->db->order_by('v_items.qty_on_hand', 'asc');
			} else if($order_qty_on_hand == 'desc') {
				$this->db->order_by('v_items.qty_on_hand', 'desc');
			}
		}
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

	# Check Name if existing
	function check_name_existing($name, $attribute, $i_id) {
		$this->db->where('i_name', $name);
		$this->db->where('i_attribute', $attribute);
		if($i_id != '') {
			$this->db->where('i_id !=', $i_id);
		}
		$query = $this->db->get('items');
		return count($query->result_array()) > 0 ? true : false;
	}

	# Insert
	function Insert($data) {
		$this->db->insert('items', $data);
		return;
	}

	# Update
	function Update($data, $i_id) {
		$this->db->where('i_id', $i_id);
		$this->db->update('items', $data);
		return;
	}
}