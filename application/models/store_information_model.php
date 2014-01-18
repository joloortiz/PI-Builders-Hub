<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Store_information_model extends CI_Model {

	# Get Store Information
	function get_store_information() {
		$query = $this->db->get('store_information');
		return $query->result_array();
	}

	# Update
	function update($data) {
		$this->db->where('si_id', 1);
		$this->db->update('store_information', $data);
		return;
	}
}