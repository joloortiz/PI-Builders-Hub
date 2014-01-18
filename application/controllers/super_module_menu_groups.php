<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Super_module_menu_groups extends MY_Controller {

	# Index
	function index() {
		// JS
        $page_js = array(
            'pages/super_module_menu_groups.js'
        );
        $this->smarty->assign('page_js', $page_js);

        $this->smarty->assign('page', 'Module Menu Groups');
        $this->smarty->assign('controller', 'super_module_menu_groups');
		$this->smarty->assign('layout', 'default_layout.tpl');
		$this->smarty->view('pages/grid_container.tpl');
	}

	# Get Module Menu Groups
	function get_module_menu_groups() {
		$query = $this->input->get('query');
		$start = $this->input->get('start') == '' ? 0 : $this->input->get('start');
		$limit = $this->input->get('limit');
		$show_deleted = $this->input->get('show_deleted') == 'true' ? true : false;
		
		try {
			// Get Data
			$data['data'] = $this->module_menu_model->get_module_menu_groups($query, $start, $limit, $show_deleted);
			foreach($data['data'] as $k => $v) {
				$data['data'][$k]['mmg_name'] = stripslashes($data['data'][$k]['mmg_name']);
			}
			
			// Get Total
			$data['total'] = count($this->module_menu_model->get_module_menu_groups($query, '', '', $show_deleted));
			
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
		$mmg_id = $this->input->post('mmg_id');

		try {
			// Check Name
			$data['msg_name'] = $this->module_menu_model->check_module_menu_group_name_existing($name, $mmg_id) == true ? 'Module Menu Group Name is existing' : '';

			// Check Link
			$data['msg_link'] = $this->module_menu_model->check_module_menu_group_link_existing($link, $mmg_id) == true ? 'Module Menu Group Link is existing' : '';
			
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
		$mmg_id = $this->input->post('mmg_id');
		$opt = $this->input->post('opt');
		
		try {
			if($opt == 'add') {
				// Insert Data
				$insert_data = array(
					'mmg_name' => $name,
					'mmg_link' => $link
				);
				$this->module_menu_model->Insert_module_menu_group($insert_data);
			} else if($opt == 'edit') {
				// Update Data
				$update_data = array(
					'mmg_name' => $name,
					'mmg_link' => $link
				);
				$this->module_menu_model->Update_module_menu_group($update_data, $mmg_id);
			} else if($opt == 'delete') {
				// Delete Data
				$delete_data = array(
					'is_deleted' => true
				);
				$this->module_menu_model->Update_module_menu_group($delete_data, $mmg_id);
			} else if($opt == 'restore') {
				// Restore Data
				$restore_data = array(
					'is_deleted' => false
				);
				$this->module_menu_model->Update_module_menu_group($restore_data, $mmg_id);
			} else if($opt == 'move_up' || $opt == 'move_down') {
				$this->module_menu_model->Update_module_menu_group_move($mmg_id, $opt);
			}
			
			$data['success'] = true;
		} catch(Exception $e) {
            $data['success'] = false;
            $data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}
}