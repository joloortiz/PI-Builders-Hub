<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Units_model extends CI_Model {

	# Get Units
	function get_units($query='', $start='', $limit='', $show_deleted=false) {
		// Options
		if($query != '') {
			$filter_query = array();
			$filter_query[] = "u_name LIKE '" . $query . "%'";
			$this->db->where('(' . implode(' OR ', $filter_query) . ')');
		}
		if($show_deleted == false) {
			$this->db->where('is_deleted', FALSE);
		}
		$this->db->order_by('u_name', 'asc');

		// Get Data
		if($start == '' && $limit == '') {
			$query = $this->db->get('units');
		} else {
			$query = $this->db->get('units', $limit, $start);
		}
		return $query->result_array();
	}

	# Check Name if existing
	function check_name_existing($name, $u_id) {
		$this->db->where('u_name', $name);
		if($u_id != '') {
			$this->db->where('u_id !=', $u_id);
		}
		$query = $this->db->get('units');
		return count($query->result_array()) > 0 ? true : false;
	}

	# Check Slug Name if existing
	function check_slug_name_existing($slug_name, $u_id) {
		$this->db->where('u_slug_name', $slug_name);
		if($u_id != '') {
			$this->db->where('u_id !=', $u_id);
		}
		$query = $this->db->get('units');
		return count($query->result_array()) > 0 ? true : false;
	}

	# Insert
	function Insert($data) {
		$this->db->insert('units', $data);
		return;
	}

	# Update
	function Update($data, $u_id) {
		$this->db->where('u_id', $u_id);
		$this->db->update('units', $data);
		return;
	}
}