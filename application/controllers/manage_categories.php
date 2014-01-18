<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Manage_categories extends MY_Controller {

	# Index
	function index() {
		// JS
        $page_js = array(
            'pages/manage_categories.js'
        );
        $this->smarty->assign('page_js', $page_js);

        $this->smarty->assign('page', 'Categories');
        $this->smarty->assign('controller', 'manage_categories');
		$this->smarty->assign('layout', 'default_layout.tpl');
		$this->smarty->view('pages/grid_container.tpl');
	}

	# Get Categories
	function get_categories() {
		$query = $this->input->get('query');
		$start = $this->input->get('start') == '' ? 0 : $this->input->get('start');
		$limit = $this->input->get('limit');
		$show_deleted = $this->input->get('show_deleted') == 'true' ? true : false;
		
		try {
			// Get Data
			$data['data'] = $this->categories_model->get_categories($query, $start, $limit, $show_deleted);
			
			// Get Total
			$data['total'] = count($this->categories_model->get_categories($query, '', '', $show_deleted));

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
		$c_id = $this->input->post('c_id');

		try {
			// Chek Name
			$data['msg_name'] = $this->categories_model->check_name_existing($name, $c_id) == true ? 'Category Name is existing' : '';
			
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
		$description = mysql_real_escape_string($this->input->post('frm_description'));
		$c_id = $this->input->post('c_id');
		$opt = $this->input->post('opt');

		try {
			if($opt == 'add') {
				// Insert Data
				$insert_data = array(
					'c_name' => $name,
					'c_description' => $description
				);
				$this->categories_model->Insert($insert_data);
			} else if($opt == 'edit') {
				// Update Data
				$update_data = array(
					'c_name' => $name,
					'c_description' => $description
				);
				$this->categories_model->Update($update_data, $c_id);
			} else if($opt == 'delete') {
				// Delete Data
				$delete_data = array(
					'is_deleted' => true
				);
				$this->categories_model->Update($delete_data, $c_id);
			} else if($opt == 'restore') {
				// Restore Data
				$restore_data = array(
					'is_deleted' => false
				);
				$this->categories_model->Update($restore_data, $c_id);
			}
			
			$data['success'] = true;
		} catch(Exception $e) {
            $data['success'] = false;
            $data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}
}