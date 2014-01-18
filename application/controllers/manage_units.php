<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Manage_units extends MY_Controller {

	# Index
	function index() {
		// JS
        $page_js = array(
            'pages/manage_units.js'
        );
        $this->smarty->assign('page_js', $page_js);

        $this->smarty->assign('page', 'Units');
        $this->smarty->assign('controller', 'manage_units');
		$this->smarty->assign('layout', 'default_layout.tpl');
		$this->smarty->view('pages/grid_container.tpl');
	}

	# Get Units
	function get_units() {
		$query = $this->input->get('query');
		$start = $this->input->get('start') == '' ? 0 : $this->input->get('start');
		$limit = $this->input->get('limit');
		$show_deleted = $this->input->get('show_deleted') == 'true' ? true : false;
		
		try {
			// Get Data
			$data['data'] = $this->units_model->get_units($query, $start, $limit, $show_deleted);
			
			// Get Total
			$data['total'] = count($this->units_model->get_units($query, '', '', $show_deleted));

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
		$slug_name = mysql_real_escape_string($this->input->post('slug_name'));
		$u_id = $this->input->post('u_id');

		try {
			// Chek Name
			$data['msg_name'] = $this->units_model->check_name_existing($name, $u_id) == true ? 'Unit Name is existing' : '';

			// Chek Slug Name
			$data['msg_slug_name'] = $this->units_model->check_slug_name_existing($slug_name, $u_id) == true ? 'Unit Slug Name is existing' : '';
			
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
		$slug_name = mysql_real_escape_string($this->input->post('frm_slug_name'));
		$u_id = $this->input->post('u_id');
		$opt = $this->input->post('opt');

		try {
			if($opt == 'add') {
				// Insert Data
				$insert_data = array(
					'u_name' => $name,
					'u_slug_name' => $slug_name
				);
				$this->units_model->Insert($insert_data);
			} else if($opt == 'edit') {
				// Update Data
				$update_data = array(
					'u_name' => $name,
					'u_slug_name' => $slug_name
				);
				$this->units_model->Update($update_data, $u_id);
			} else if($opt == 'delete') {
				// Delete Data
				$delete_data = array(
					'is_deleted' => true
				);
				$this->units_model->Update($delete_data, $u_id);
			} else if($opt == 'restore') {
				// Restore Data
				$restore_data = array(
					'is_deleted' => false
				);
				$this->units_model->Update($restore_data, $u_id);
			}
			
			$data['success'] = true;
		} catch(Exception $e) {
            $data['success'] = false;
            $data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}
}