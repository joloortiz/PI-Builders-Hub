<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Categories_model extends CI_Model {

	# Get Categories
	function get_categories($query='', $start='', $limit='', $show_deleted=false) {
		// Options
		if($query != '') {
			$filter_query = array();
			$filter_query[] = "c_name LIKE '" . $query . "%'";
			$this->db->where('(' . implode(' OR ', $filter_query) . ')');
		}
		if($show_deleted == false) {
			$this->db->where('is_deleted', FALSE);
		}
		$this->db->order_by('c_name', 'asc');

		// Get Data
		if($start == '' && $limit == '') {
			$query = $this->db->get('categories');
		} else {
			$query = $this->db->get('categories', $limit, $start);
		}
		return $query->result_array();
	}

	# Get Category By Id
	function get_category_by_id($c_id) {
		$this->db->where('c_id', $c_id);
		$query = $this->db->get('categories');
		return $query->result_array();
	}

	# Check Name if existing
	function check_name_existing($name, $c_id) {
		$this->db->where('c_name', $name);
		if($c_id != '') {
			$this->db->where('c_id !=', $c_id);
		}
		$query = $this->db->get('categories');
		return count($query->result_array()) > 0 ? true : false;
	}

	# Insert
	function Insert($data) {
		$this->db->insert('categories', $data);
		return;
	}

	# Update
	function Update($data, $c_id) {
		$this->db->where('c_id', $c_id);
		$this->db->update('categories', $data);
		return;
	}
}