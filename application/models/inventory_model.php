<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Inventory_model extends CI_Model {

	# Get Adjustments
	function get_adjustments($query='', $start='', $limit='', $status='') {
		// Select
		$this->db->select('
			a.*,
			CONCAT(e.e_fname, \' \', e.e_lname) AS adjusted_name
		', FALSE);
		$this->db->from('adjustments a');
		$this->db->join('employees e', 'a.a_adjusted_by = e.e_id', 'left');

		// Options
		if($query != '') {
			$filter_query = array();
			$filter_query[] = "a.a_adjustment_number = '" . $query . "'";
			$this->db->where('(' . implode(' OR ', $filter_query) . ')');
		}
		if($status != '') {
			$this->db->where_in('a.a_status', $status);
		}
		$this->db->order_by('a.a_date', 'desc');

		// Get Data
		if($start == '' && $limit == '') {
			$query = $this->db->get();
		} else {
			$this->db->limit($limit, $start);
			$query = $this->db->get();
		}
		return $query->result_array();
	}

	# Get Adjustment By Id
	function get_adjustment_by_id($a_id) {
		// Select
		$this->db->select('
			a.*,
			CONCAT(e.e_fname, \' \', e.e_lname) AS adjusted_name
		', FALSE);
		$this->db->from('adjustments a');
		$this->db->join('employees e', 'a.a_adjusted_by = e.e_id', 'left');

		// Options
		$this->db->where('a.a_id', $a_id);

		// Get Data
		$query = $this->db->get();
		return $query->result_array();
	}

	# Get Adjustment Items By Adjustment Id
	function get_adjustment_items_by_adjustment_id($a_id) {
		// Select
		$this->db->select('ad.*, i.i_name, i.i_attribute, u.u_id, u.u_name, u.u_slug_name');
		$this->db->from('adjustment_details ad');
		$this->db->join('items i', 'ad.i_id = i.i_id', 'left');
		$this->db->join('units u', 'i.u_id = u.u_id', 'left');

		// Options
		$this->db->where('ad.a_id', $a_id);

		// Get Data
		$query = $this->db->get();
		return $query->result_array();
	}

	# Insert Adjustment
	function Insert_adjustment($data) {
		$this->db->set('a_adjustment_number', '(SELECT r_get_adjustment_number())', FALSE);
		$this->db->set('a_date', 'NOW()', FALSE);
		$this->db->insert('adjustments', $data);
		return $this->db->insert_id();
	}

	# Insert Adjustment Details
	function Insert_adjustment_details($data) {
		$this->db->insert('adjustment_details', $data);
		return;
	}

	# Update Adjustment
	function Update_adjustment($data, $a_id) {
		$this->db->where('a_id', $a_id);
		$this->db->update('adjustments', $data);
		return;
	}
}