<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Employees_model extends CI_Model {

	# Get Employees
	function get_employees($query='', $start='', $limit='', $show_deleted=false) {
		$session = $this->session->userdata('pos');

		// Select
		$this->db->select('e.*, mug.mug_id, mug.mug_name');
		$this->db->from('employees e');
		$this->db->join('module_user_groups mug', 'e.mug_id = mug.mug_id', 'left');

		// Options
		if($session['mug_name'] != 'Super Administrator') {
			$this->db->where('mug.mug_name !=' , 'Super Administrator');
		}
		if($query != '') {
			$filter_query = array();
			$filter_query[] = "e.e_fname LIKE '" . $query . "%'";
			$filter_query[] = "e.e_lname LIKE '" . $query . "%'";
			$filter_query[] = "e.e_mname LIKE '" . $query . "%'";
			$this->db->where('(' . implode(' OR ', $filter_query) . ')');
		}
		if($show_deleted == false) {
			$this->db->where('e.is_deleted', FALSE);
		}
		$this->db->order_by('e.e_fname', 'asc');
		$this->db->order_by('e.e_lname', 'asc');

		// Get Data
		if($start == '' && $limit == '') {
			$query = $this->db->get();
		} else {
			$this->db->limit($limit, $start);
			$query = $this->db->get();
		}
		return $query->result_array();
	}

	# Get User By Credentials
	function get_user_by_credentials($username='', $password='', $show_deleted=true) {
		// Select
		$this->db->select('e.*, mug.mug_id, mug.mug_name');
		$this->db->from('employees e');
		$this->db->join('module_user_groups mug', 'e.mug_id = mug.mug_id', 'left');

		if($username != '') {
			$this->db->where('e.e_username', $username);
		}
		if($password != '') {
			$this->db->where('e.e_password', md5($password));
		}
		if($show_deleted == false) {
			$this->db->where('e.is_deleted', FALSE);
		}
		$query = $this->db->get();
		return $query->result_array();
	}

	# Check Name if existing
	function check_name_existing($fname, $lname, $mname, $e_id) {
		$this->db->where('e_fname', $fname);
		$this->db->where('e_lname', $lname);
		$this->db->where('e_mname', $mname);
		if($e_id != '') {
			$this->db->where('e_id !=', $e_id);
		}
		$query = $this->db->get('employees');
		return count($query->result_array()) > 0 ? true : false;
	}

	# Check Username if existing
	function check_username_existing($username, $e_id) {
		$this->db->where('e_username', $username);
		if($e_id != '') {
			$this->db->where('e_id !=', $e_id);
		}
		$query = $this->db->get('employees');
		return count($query->result_array()) > 0 ? true : false;
	}

	# Insert
	function Insert($data) {
		$this->db->insert('employees', $data);
		return;
	}

	# Update
	function Update($data, $e_id) {
		$this->db->where('e_id', $e_id);
		$this->db->update('employees', $data);
		return;
	}
}