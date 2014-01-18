<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Module_menu_model extends CI_Model {

	# Get Module Menu Groups
	function get_module_menu_groups($query='', $start='', $limit='', $show_deleted=false) {
		// Options
		if($query != '') {
			$filter_query = array();
			$filter_query[] = "mmg_name LIKE '%" . $query . "%'";
			$filter_query[] = "mmg_link LIKE '%" . $query . "%'";
			$this->db->where('(' . implode(' OR ', $filter_query) . ')');
		}
		if($show_deleted == false) {
			$this->db->where('is_deleted', FALSE);
		}
		$this->db->order_by('mmg_order', 'asc');

		// Get Data
		if($start == '' && $limit == '') {
			$query = $this->db->get('module_menu_groups');
		} else {
			$query = $this->db->get('module_menu_groups', $limit, $start);
		}
		return $query->result_array();
	}

	# Get Module Menu Group By Id/Link
	function get_module_menu_group_id_link($mmg_id='', $mmg_link='') {
		if($mmg_id != '') {
			$this->db->where('mmg_id', $mmg_id);
		}
		if($mmg_link != '') {
			$this->db->where('mmg_link', $mmg_link);
		}
		$query = $this->db->get('module_menu_groups');
		return $query->result_array();
	}

	# Get Modules By User Group Id
	function get_modules_user_group_id($mug_id, $mmg_link='', $mmi_link='') {
		$this->db->select('
			mmi.mmi_id,
			mmi.mmi_name,
			mmi.mmi_link,
			mmi.mmi_description,
			mmg.mmg_id,
			mmg.mmg_name,
			mmg.mmg_link,
			mug.mug_id,
			mug.mug_name
		');
		$this->db->from('module_access_rights mar');
		$this->db->join('module_user_groups mug', 'mar.mug_id = mug.mug_id', 'left');
		$this->db->join('module_menu_items mmi', 'mar.mmi_id = mmi.mmi_id', 'left');
		$this->db->join('module_menu_groups mmg', 'mmi.mmg_id = mmg.mmg_id', 'left');
		$this->db->where('mar.mug_id', $mug_id);
		$this->db->where('mmi.is_deleted', FALSE);
		$this->db->where('mmg.is_deleted', FALSE);
		if($mmg_link != '') {
			$this->db->where('mmg.mmg_link', $mmg_link);
		}
		if($mmi_link != '') {
			$this->db->where('mmi.mmi_link', $mmi_link);
		}
		$this->db->order_by('mmg.mmg_order', 'asc');
		$this->db->order_by('mmi.mmi_order', 'asc');

		$query = $this->db->get();
		return $query->result_array();
	}

	# Get Module Menu Items
	function get_module_menu_items($query='', $start='', $limit='', $show_deleted=false, $mmg_id='') {
		// Select
		$this->db->select('mmi.*, mmg.mmg_name, mmg.mmg_link');
		$this->db->from('module_menu_items mmi');
		$this->db->join('module_menu_groups mmg', 'mmi.mmg_id = mmg.mmg_id', 'left');

		// Options
		if($query != '') {
			$filter_query = array();
			$filter_query[] = "mmi.mmi_name LIKE '%" . $query . "%'";
			$filter_query[] = "mmi.mmi_link LIKE '%" . $query . "%'";
			$filter_query[] = "mmg.mmg_name LIKE '%" . $query . "%'";
			$filter_query[] = "mmg.mmg_name LIKE '%" . $query . "%'";
			$this->db->where('(' . implode(' OR ', $filter_query) . ')');
		}
		if($show_deleted == false) {
			$this->db->where('mmi.is_deleted', FALSE);
		}
		if($mmg_id != '' && $mmg_id != 'all') {
			$this->db->where('mmi.mmg_id', $mmg_id);
		}
		$this->db->order_by('mmg.mmg_order', 'asc');
		$this->db->order_by('mmi.mmi_order', 'asc');

		// Get Data
		if($start == '' && $limit == '') {
			$query = $this->db->get();
		} else {
			$this->db->limit($limit, $start);
			$query = $this->db->get();
		}
		return $query->result_array();
	}

	# Check Module Menu Group Name if existing
	function check_module_menu_group_name_existing($name, $mmg_id) {
		$this->db->where('mmg_name', $name);
		if($mmg_id != '') {
			$this->db->where('mmg_id !=', $mmg_id);
		}
		$query = $this->db->get('module_menu_groups');
		return count($query->result_array()) > 0 ? true : false;
	}

	# Check Module Menu Group Link if existing
	function check_module_menu_group_link_existing($link, $mmg_id) {
		$this->db->where('mmg_link', $link);
		if($mmg_id != '') {
			$this->db->where('mmg_id !=', $mmg_id);
		}
		$query = $this->db->get('module_menu_groups');
		return count($query->result_array()) > 0 ? true : false;
	}

	# Check Module Menu Item Name if existing
	function check_module_menu_item_name_existing($name, $mmg_id, $mmi_id) {
		$this->db->where('mmi_name', $name);
		$this->db->where('mmg_id', $mmg_id);
		if($mmi_id != '') {
			$this->db->where('mmi_id !=', $mmi_id);
		}
		$query = $this->db->get('module_menu_items');
		return count($query->result_array()) > 0 ? true : false;
	}

	# Check Module Menu Item Link if existing
	function check_module_menu_item_link_existing($link, $mmg_id, $mmi_id) {
		$this->db->where('mmi_link', $link);
		$this->db->where('mmg_id', $mmg_id);
		if($mmi_id != '') {
			$this->db->where('mmi_id !=', $mmi_id);
		}
		$query = $this->db->get('module_menu_items');
		return count($query->result_array()) > 0 ? true : false;
	}

	# Insert Module Menu Group
	function Insert_module_menu_group($data) {
		$this->db->set('mmg_order', 'r_get_module_menu_group_order()', FALSE);
		$this->db->insert('module_menu_groups', $data);
		return;
	}

	# Update Module Menu Group
	function Update_module_menu_group($data, $mmg_id) {
		$this->db->where('mmg_id', $mmg_id);
		$this->db->update('module_menu_groups', $data);
		return;
	}

	# Update Moduel Menu Group Move
	function Update_module_menu_group_move($mmg_id, $opt) {
		// Get Current Order
		$sql_current_order = 'SELECT mmg_order FROM module_menu_groups WHERE mmg_id = ' . $mmg_id;
		$query_current_order = $this->db->query($sql_current_order);
		$result_current_order = $query_current_order->result_array();
		$current_order = $result_current_order[0]['mmg_order'];

		// Get Max Order Number
		$sql_max_order = 'SELECT MAX(mmg_order) AS max_order FROM module_menu_groups';
		$query_max_order = $this->db->query($sql_max_order);
		$result_max_order = $query_max_order->result_array();
		$max_order = $result_max_order[0]['max_order'];

		if($opt == 'move_up') {
			if($current_order > 1) {
				// Get Previous Group Id
				$sql_prev_mmg_id = 'SELECT mmg_id FROM module_menu_groups WHERE mmg_order = ' . ($current_order - 1);
				$query_prev_mmg_id = $this->db->query($sql_prev_mmg_id);
				$result_prev_mmg_id = $query_prev_mmg_id->result_array();
				$prev_mmg_id = $result_prev_mmg_id[0]['mmg_id'];

				// Update the Previous Group
				$sql_update_prev_group = 'UPDATE module_menu_groups SET mmg_order = ' . $current_order . ' WHERE mmg_id = ' . $prev_mmg_id;
				$this->db->query($sql_update_prev_group);

				// Update Current Group
				$sql_update_current_group = 'UPDATE module_menu_groups SET mmg_order = ' . ($current_order - 1) . ' WHERE mmg_id = ' . $mmg_id;
				$this->db->query($sql_update_current_group);
			}
		} elseif($opt == 'move_down') {
			if($current_order < $max_order) {
				// Get Next Group Id
				$sql_next_mmg_id = 'SELECT mmg_id FROM module_menu_groups WHERE mmg_order = ' . ($current_order + 1);
				$query_next_mmg_id = $this->db->query($sql_next_mmg_id);
				$result_next_mmg_id = $query_next_mmg_id->result_array();
				$next_mmg_id = $result_next_mmg_id[0]['mmg_id'];

				// Update the Next Group
				$sql_update_next_group = 'UPDATE module_menu_groups SET mmg_order = ' . $current_order . ' WHERE mmg_id = ' . $next_mmg_id;
				$this->db->query($sql_update_next_group);

				// Update Current Group
				$sql_update_current_group = 'UPDATE module_menu_groups SET mmg_order = ' . ($current_order + 1) . ' WHERE mmg_id = ' . $mmg_id;
				$this->db->query($sql_update_current_group);
			}
		}

		return;
	}

	# Insert Module Menu Item
	function Insert_module_menu_item($data, $mmg_id) {
		$this->db->set('mmi_order', 'r_get_module_menu_item_order(' . $mmg_id . ')', FALSE);
		$this->db->insert('module_menu_items', $data);
		return;
	}

	# Update Module Menu Item
	function Update_module_menu_item($data, $mmi_id) {
		$this->db->where('mmi_id', $mmi_id);
		$this->db->update('module_menu_items', $data);
		return;
	}

	# Update Moduel Menu Item Move
	function Update_module_menu_item_move($mmi_id, $mmg_id, $opt) {
		// Get Current Order
		$sql_current_order = 'SELECT mmi_order FROM module_menu_items WHERE mmi_id = ' . $mmi_id;
		$query_current_order = $this->db->query($sql_current_order);
		$result_current_order = $query_current_order->result_array();
		$current_order = $result_current_order[0]['mmi_order'];

		// Get Max Order Number
		$sql_max_order = 'SELECT MAX(mmi_order) AS max_order FROM module_menu_items WHERE mmg_id = ' . $mmg_id;
		$query_max_order = $this->db->query($sql_max_order);
		$result_max_order = $query_max_order->result_array();
		$max_order = $result_max_order[0]['max_order'];

		if($opt == 'move_up') {
			if($current_order > 1) {
				// Get Previous Item Id
				$sql_prev_mmi_id = 'SELECT mmi_id FROM module_menu_items WHERE mmi_order = ' . ($current_order - 1) . ' AND mmg_id = ' . $mmg_id;
				$query_prev_mmi_id = $this->db->query($sql_prev_mmi_id);
				$result_prev_mmi_id = $query_prev_mmi_id->result_array();
				$prev_mmi_id = $result_prev_mmi_id[0]['mmi_id'];

				// Update the Previous Item
				$sql_update_prev_item = 'UPDATE module_menu_items SET mmi_order = ' . $current_order . ' WHERE mmi_id = ' . $prev_mmi_id;
				$this->db->query($sql_update_prev_item);

				// Update Current Item
				$sql_update_current_item = 'UPDATE module_menu_items SET mmi_order = ' . ($current_order - 1) . ' WHERE mmi_id = ' . $mmi_id;
				$this->db->query($sql_update_current_item);
			}
		} elseif($opt == 'move_down') {
			if($current_order < $max_order) {
				// Get Next Item Id
				$sql_next_mmi_id = 'SELECT mmi_id FROM module_menu_items WHERE mmi_order = ' . ($current_order + 1) . ' AND mmg_id = ' . $mmg_id;
				$query_next_mmi_id = $this->db->query($sql_next_mmi_id);
				$result_next_mmi_id = $query_next_mmi_id->result_array();
				$next_mmi_id = $result_next_mmi_id[0]['mmi_id'];

				// Update the Next Item
				$sql_update_next_item = 'UPDATE module_menu_items SET mmi_order = ' . $current_order . ' WHERE mmi_id = ' . $next_mmi_id;
				$this->db->query($sql_update_next_item);

				// Update Current Item
				$sql_update_current_item = 'UPDATE module_menu_items SET mmi_order = ' . ($current_order + 1) . ' WHERE mmi_id = ' . $mmi_id;
				$this->db->query($sql_update_current_item);
			}
		}

		return;
	}
}