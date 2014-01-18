<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Super_module_menu_items extends MY_Controller {

	# Index
	function index() {
		// JS
        $page_js = array(
            'pages/super_module_menu_items.js'
        );
        $this->smarty->assign('page_js', $page_js);

        $this->smarty->assign('page', 'Module Menu Items');
        $this->smarty->assign('controller', 'super_module_menu_items');
		$this->smarty->assign('layout', 'default_layout.tpl');
		$this->smarty->view('pages/grid_container.tpl');
	}

	# Get Module Menu Items
	function get_module_menu_items() {
		$query = $this->input->get('query');
		$start = $this->input->get('start') == '' ? 0 : $this->input->get('start');
		$limit = $this->input->get('limit');
		$show_deleted = $this->input->get('show_deleted') == '' ? false : true;
		$mmg_id = $this->input->get('mmg_id');

		try {
			// Get Data
			$data['data'] = $this->module_menu_model->get_module_menu_items($query, $start, $limit, $show_deleted, $mmg_id);
			foreach($data['data'] as $k => $v) {
				$data['data'][$k]['mmi_name'] = stripslashes($data['data'][$k]['mmi_name']);
				$data['data'][$k]['mmi_description'] = stripcslashes($data['data'][$k]['mmi_description']);
				$data['data'][$k]['mmg_name'] = stripslashes($data['data'][$k]['mmg_name']);
			}
			
			// Get Total
			$data['total'] = count($this->module_menu_model->get_module_menu_items($query, '', '', $show_deleted, $mmg_id));
			
			$data['success'] = true;
		} catch(Exception $e) {
			$data['success'] = false;
			$data['msg'] = $e->getMessage();
		}

		echo json_encode($data);
	}

	# Get Module Menu Groups
	function get_module_menu_groups() {
		try {
			// Get Data
			$data['data'] = $this->module_menu_model->get_module_menu_groups();
			foreach($data['data'] as $k => $v) {
				$data['data'][$k]['mmg_name'] = stripslashes($data['data'][$k]['mmg_name']);
			}
			
			$data['success'] = true;
		} catch(Exception $e) {
            $data['success'] = false;
            $data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}

	# Get Module Menu Groups All
	function get_module_menu_groups_all() {
		try {
			// Get Data
			$data['data'] = $this->module_menu_model->get_module_menu_groups();
			foreach($data['data'] as $k => $v) {
				$data['data'][$k]['mmg_name'] = stripslashes($data['data'][$k]['mmg_name']);
			}
			$all_arr = array(
				'mmg_id' => 'all',
				'mmg_name' => 'All'
			);
			array_unshift($data['data'], $all_arr);
			
			$data['success'] = true;
		} catch(Exception $e) {
            $data['success'] = false;
            $data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}

	# Check if existing
	function check_existing() {
		$name = mysql_real_escape_string($this->input->post('name'));
		$link = mysql_real_escape_string($this->input->post('link'));
		$mmi_id = $this->input->post('mmi_id');
		$mmg_id = $this->input->post('mmg_id');

		try {
			// Check Name
			$data['msg_name'] = $this->module_menu_model->check_module_menu_item_name_existing($name, $mmi_id, $mmg_id) == true ? 'Module Menu Item Name is existing' : '';

			// Check Link
			$data['msg_link'] = $this->module_menu_model->check_module_menu_item_link_existing($link, $mmi_id, $mmg_id) == true ? 'Module Menu Item Link is existing' : '';
			
			$data['success'] = true;
		} catch(Exception $e) {
            $data['success'] = false;
            $data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}

	# Save
	function save() {
		$name = mysql_real_escape_string($this->input->post('frm_name'));
		$link = mysql_real_escape_string($this->input->post('frm_link'));
		$description = mysql_real_escape_string($this->input->post('frm_description'));
		$mmi_id = $this->input->post('mmi_id');
		$mmg_id = $this->input->post('frm_sel_module_menu_group') ? $this->input->post('frm_sel_module_menu_group') : $this->input->post('mmg_id');
		$opt = $this->input->post('opt');
		
		try {
			if($opt == 'add') {
				// Insert Data
				$insert_data = array(
					'mmi_name' => $name,
					'mmi_link' => $link,
					'mmi_description' => $description,
					'mmg_id' => $mmg_id
				);
				$this->module_menu_model->Insert_module_menu_item($insert_data, $mmg_id);
			} else if($opt == 'edit') {
				// Update Data
				$update_data = array(
					'mmi_name' => $name,
					'mmi_link' => $link,
					'mmi_description' => $description,
					'mmg_id' => $mmg_id
				);
				$this->module_menu_model->Update_module_menu_item($update_data, $mmi_id);
			} else if($opt == 'delete') {
				// Delete Data
				$delete_data = array(
					'is_deleted' => true
				);
				$this->module_menu_model->Update_module_menu_item($delete_data, $mmi_id);
			} else if($opt == 'restore') {
				// Restore Data
				$restore_data = array(
					'is_deleted' => false
				);
				$this->module_menu_model->Update_module_menu_item($restore_data, $mmi_id);
			} else if($opt == 'move_up' || $opt == 'move_down') {
				$this->module_menu_model->Update_module_menu_item_move($mmi_id, $mmg_id, $opt);
			}
			
			$data['success'] = true;
		} catch(Exception $e) {
            $data['success'] = false;
            $data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}
}