<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Suppliers_model extends CI_Model {

	# Get Suppliers
	function get_suppliers($query='', $start='', $limit='', $show_deleted=false) {
		// Options
		if($query != '') {
			$filter_query = array();
			$filter_query[] = "s_name LIKE '" . $query . "%'";
			$this->db->where('(' . implode(' OR ', $filter_query) . ')');
		}
		if($show_deleted == false) {
			$this->db->where('is_deleted', FALSE);
		}
		$this->db->order_by('s_name', 'asc');

		// Get Data
		if($start == '' && $limit == '') {
			$query = $this->db->get('suppliers');
		} else {
			$query = $this->db->get('suppliers', $limit, $start);
		}
		return $query->result_array();
	}

	# Get Supplier By Id
	function get_supplier_by_id($s_id) {
		$this->db->where('s_id', $s_id);
		$query = $this->db->get('suppliers');
		return $query->result_array();
	}

	# Check Name if existing
	function check_name_existing($name, $s_id) {
		$this->db->where('s_name', $name);
		if($s_id != '') {
			$this->db->where('s_id !=', $s_id);
		}
		$query = $this->db->get('suppliers');
		return count($query->result_array()) > 0 ? true : false;
	}

	# Insert
	function Insert($data) {
		$this->db->insert('suppliers', $data);
		return;
	}

	# Update
	function Update($data, $s_id) {
		$this->db->where('s_id', $s_id);
		$this->db->update('suppliers', $data);
		return;
	}
}