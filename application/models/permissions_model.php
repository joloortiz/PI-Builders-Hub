<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Permissions_model extends CI_Model {

	# Get Module User Groups
	function get_module_user_groups($query='', $start='', $limit='', $show_deleted=false) {
		$session = $this->session->userdata('pos');

		// Options
		if($session['mug_name'] != 'Super Administrator') {
			$this->db->where('mug_name !=', 'Super Administrator');
		}
		if($query != '') {
			$filter_query = array();
			$filter_query[] = "mug_name LIKE '" . $query . "%'";
			$this->db->where('(' . implode(' OR ', $filter_query) . ')');
		}
		if($show_deleted == false) {
			$this->db->where('is_deleted', FALSE);
		}
		$this->db->order_by('mug_name', 'asc');

		// Get Data
		if($start == '' && $limit == '') {
			$query = $this->db->get('module_user_groups');
		} else {
			$query = $this->db->get('module_user_groups', $limit, $start);
		}
		return $query->result_array();
	}

	# Get Module Menu Items
	function get_module_menu_items($mug_id) {
		$session = $this->session->userdata('pos');

		// Select
		$select = 'mmi.*, mmg.mmg_id, mmg.mmg_name, mmg.mmg_order, ';
		if($mug_id == '') {
			$select .= 'FALSE AS checked';
		} else {
			$select .= "
				CASE
					WHEN (SELECT COUNT(*) FROM module_access_rights WHERE mmi_id = mmi.mmi_id AND mug_id = $mug_id) > 0 THEN TRUE
					ELSE FALSE
				END AS checked
			";
		}
		$this->db->select($select, FALSE);
		$this->db->from('module_menu_items mmi');
		$this->db->join('module_menu_groups mmg', 'mmi.mmg_id = mmg.mmg_id', 'left');

		// Options
		if($session['mug_name'] != 'Super Administrator') {
			$this->db->where('mmg.mmg_name !=', 'Super Admin');
		}
		$this->db->where('mmi.is_deleted', FALSE);
		$this->db->where('mmg.is_deleted', FALSE);
		$this->db->order_by('mmg.mmg_order', 'asc');
		$this->db->order_by('mmi.mmi_order', 'asc');

		// Get Data
		$query = $this->db->get();
		return $query->result_array();
	}

	# Check Name if existing
	function check_name_existing($name, $mug_id) {
		$this->db->where('mug_name', $name);
		if($mug_id != '') {
			$this->db->where('mug_id !=', $mug_id);
		}
		$query = $this->db->get('module_user_groups');
		return count($query->result_array()) > 0 ? true : false;
	}

	# Insert
	function Insert($data) {
		$this->db->insert('module_user_groups', $data);
		return $this->db->insert_id();
	}

	# Insert Module Access Rights
	function Insert_module_access_rights($data) {
		$this->db->insert('module_access_rights', $data);
		return;
	}

	# Update
	function Update($data, $mug_id) {
		$this->db->where('mug_id', $mug_id);
		$this->db->update('module_user_groups', $data);
		return;
	}

	# Delete Module Access Rights
	function Delete_module_access_rights($mug_id) {
		$this->db->where('mug_id', $mug_id);
		$this->db->delete('module_access_rights');
		return;
	}
}