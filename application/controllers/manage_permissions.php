<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Manage_permissions extends MY_Controller {

	# Index
	function index() {
		// JS
        $page_js = array(
            'pages/manage_permissions.js'
        );
        $this->smarty->assign('page_js', $page_js);

        $this->smarty->assign('page', 'User Groups & Permissions');
        $this->smarty->assign('controller', 'manage_permissions');
		$this->smarty->assign('layout', 'default_layout.tpl');
		$this->smarty->view('pages/grid_container.tpl');
	}

	# Get User Groups
	function get_module_user_groups() {
		$query = $this->input->get('query');
		$start = $this->input->get('start') == '' ? 0 : $this->input->get('start');
		$limit = $this->input->get('limit');
		$show_deleted = $this->input->get('show_deleted') == 'true' ? true : false;
		
		try {
			// Get Data
			$data['data'] = $this->permissions_model->get_module_user_groups($query, $start, $limit, $show_deleted);
			
			// Get Total
			$data['total'] = count($this->permissions_model->get_module_user_groups($query, '', '', $show_deleted));

			$data['success'] = true;
		} catch(Exception $e) {
            $data['success'] = false;
            $data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}

	# Get Module Menu Items
	function get_module_menu_items() {
		$mug_id = $this->input->get('mug_id');

		try {
			// Get Data
			$data['data'] = $this->permissions_model->get_module_menu_items($mug_id);
			
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
		$mug_id = $this->input->post('mug_id');

		try {
			// Chek Name
			$data['msg_name'] = $this->permissions_model->check_name_existing($name, $mug_id) == true ? 'User Group Name is existing' : '';
			
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
		$mug_id = $this->input->post('mug_id');
		$module_menu_items = json_decode($this->input->post('module_menu_items'));
		$opt = $this->input->post('opt');
		
		try {
			if($opt == 'add') {
				// Insert Data
				$insert_data = array(
					'mug_name' => $name
				);
				$mug_id = $this->permissions_model->Insert($insert_data);

				// Insert Access Rights Data
				if($module_menu_items) {
					foreach($module_menu_items as $v) {
						$insert_access_rights_data = array(
							'mmi_id' => $v,
							'mug_id' => $mug_id
						);
						$this->permissions_model->Insert_module_access_rights($insert_access_rights_data);
					}
				}
			} else if($opt == 'edit') {
				// Update Data
				$update_data = array(
					'mug_name' => $name
				);
				$this->permissions_model->Update($update_data, $mug_id);

				// Delete Access Rights
				$this->permissions_model->Delete_module_access_rights($mug_id);

				// Insert Access Rights Data
				if($module_menu_items) {
					foreach($module_menu_items as $v) {
						$insert_access_rights_data = array(
							'mmi_id' => $v,
							'mug_id' => $mug_id
						);
						$this->permissions_model->Insert_module_access_rights($insert_access_rights_data);
					}
				}
			} else if($opt == 'delete') {
				// Delete Data
				$delete_data = array(
					'is_deleted' => true
				);
				$this->permissions_model->Update($delete_data, $mug_id);
			} else if($opt == 'restore') {
				// Restore Data
				$restore_data = array(
					'is_deleted' => false
				);
				$this->permissions_model->Update($restore_data, $mug_id);
			}
			
			$data['success'] = true;
		} catch(Exception $e) {
            $data['success'] = false;
            $data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}
}