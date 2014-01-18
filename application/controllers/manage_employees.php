<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Manage_employees extends MY_Controller {

	# Index
	function index() {
		// JS
        $page_js = array(
            'pages/manage_employees.js'
        );
        $this->smarty->assign('page_js', $page_js);

        $this->smarty->assign('page', 'Employees');
        $this->smarty->assign('controller', 'manage_employees');
		$this->smarty->assign('layout', 'default_layout.tpl');
		$this->smarty->view('pages/grid_container.tpl');
	}

	# Get Employees
	function get_employees() {
		$query = $this->input->get('query');
		$start = $this->input->get('start') == '' ? 0 : $this->input->get('start');
		$limit = $this->input->get('limit');
		$show_deleted = $this->input->get('show_deleted') == 'true' ? true : false;
		
		try {
			// Get Data
			$data['data'] = $this->employees_model->get_employees($query, $start, $limit, $show_deleted);
			
			// Get Total
			$data['total'] = count($this->employees_model->get_employees($query, '', '', $show_deleted));

			$data['success'] = true;
		} catch(Exception $e) {
            $data['success'] = false;
            $data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}

	# Get User Groups
	function get_module_user_groups() {
		try {
			// Get Data
			$data['data'] = $this->permissions_model->get_module_user_groups();
			
			$data['success'] = true;
		} catch(Exception $e) {
            $data['success'] = false;
            $data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}

	# Check if existing
	function check_existing() {
		$fname = mysql_real_escape_string($this->input->post('fname'));
		$lname = mysql_real_escape_string($this->input->post('lname'));
		$mname = mysql_real_escape_string($this->input->post('mname'));
		$username = mysql_real_escape_string($this->input->post('username'));
		$e_id = $this->input->post('e_id');

		try {
			// Chek Name
			$data['msg_name'] = $this->employees_model->check_name_existing($fname, $lname, $mname, $e_id) == true ? 'Name is existing' : '';

			// Chek Username
			$data['msg_username'] = $this->employees_model->check_username_existing($username, $e_id) == true ? 'Username is existing' : '';
			
			$data['success'] = true;
		} catch(Exception $e) {
            $data['success'] = false;
            $data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}

	# Save
	function save() {
		$fname = mysql_real_escape_string($this->input->post('frm_fname'));
		$lname = mysql_real_escape_string($this->input->post('frm_lname'));
		$mname = mysql_real_escape_string($this->input->post('frm_mname'));
		$user_group_id = $this->input->post('frm_sel_user_group');
		$username = mysql_real_escape_string($this->input->post('frm_username'));
		$password = $this->input->post('frm_password');
		$e_id = $this->input->post('e_id');
		$opt = $this->input->post('opt');
		$password = $password == '' ? '123456' : $password;
		
		try {
			if($opt == 'add') {
				// Insert Data
				$insert_data = array(
					'e_fname' => $fname,
					'e_lname' => $lname,
					'e_mname' => $mname,
					'e_username' => $username,
					'e_password' => md5($password),
					'mug_id' => $user_group_id
				);
				$this->employees_model->Insert($insert_data);
			} else if($opt == 'edit') {
				// Update Data
				$update_data = array(
					'e_fname' => $fname,
					'e_lname' => $lname,
					'e_mname' => $mname,
					'e_username' => $username,
					'mug_id' => $user_group_id
				);
				if($password != '') {
					$update_data['e_password'] = md5($password);
				}
				$this->employees_model->Update($update_data, $e_id);
			} else if($opt == 'delete') {
				// Delete Data
				$delete_data = array(
					'is_deleted' => true
				);
				$this->employees_model->Update($delete_data, $e_id);
			} else if($opt == 'restore') {
				// Restore Data
				$restore_data = array(
					'is_deleted' => false
				);
				$this->employees_model->Update($restore_data, $e_id);
			}
			
			$data['success'] = true;
		} catch(Exception $e) {
            $data['success'] = false;
            $data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}
}