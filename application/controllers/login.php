<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Login extends MY_Controller {

	# Index
	function index() {
		// JS
        $page_js = array(
            'pages/login.js'
        );
        $this->smarty->assign('page_js', $page_js);

        $this->smarty->assign('page', 'Login');
		$this->smarty->assign('controller', 'login');
		$this->smarty->assign('layout', 'plain_layout.tpl');
		$this->smarty->view('pages/login.tpl');
	}

	# Initiate Login
	function initiateLogin() {
		$username = $this->input->post('frm_username');
		$password = $this->input->post('frm_password');

		try {
			// Check if Username is existing
			$employee = $this->employees_model->get_user_by_credentials($username);
			if(count($employee) == 0) {
				$data['success'] = false;
				$data['msg'] = 'Username does not exist';
			} else {
				// Check if Username and Password matches
				$employee = $this->employees_model->get_user_by_credentials($username, $password);
				if(count($employee) == 0) {
					$data['success'] = false;
					$data['msg'] = 'Username and Password does not match';
				} else {
					// Check if Employee is not deleted
					$employee = $this->employees_model->get_user_by_credentials($username, $password, false);
					if(count($employee) == 0) {
						$data['success'] = false;
						$data['msg'] = 'Your account has been deleted. Please contact your System Administrator to restore it';
					} else {
						$this->session->set_userdata('pos', $employee[0]);
						$data['success'] = true;
					}
				}
			}
		} catch(Exception $e) {
            $data['success'] = false;
            $data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}

	# Get Employee Information
	function get_employee_information() {
		$session = $this->session->userdata('pos');

		try {
			// Get Employee Information via Session
			$data['data'] = $session;

			$data['success'] = true;
		} catch(Exception $e) {
            $data['success'] = false;
            $data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}

	# Change Account Settings
	function change_account_settings() {
		$username = mysql_real_escape_string($this->input->post('frm_ca_username'));
		$old_password = mysql_real_escape_string($this->input->post('frm_ca_old_password'));
		$new_password = mysql_real_escape_string($this->input->post('frm_ca_new_password'));
		$session = $this->session->userdata('pos');

		try {
			// Check if Username is already existing
			if($this->employees_model->check_username_existing($username, $session['e_id']) == true)  {
				$data['success'] = false;
				$data['msg'] = 'Username is already existing';
			} else {
				// Check if Old Password is correct
				if(count($this->employees_model->get_user_by_credentials($session['e_username'], $old_password)) == 0) {
					$data['success'] = false;
					$data['msg'] = 'Old Password is incorrect';
				} else {
					// Update Account Settings
					$update_data = array(
						'e_username' => $username,
						'e_password' => md5($new_password)
					);
					$this->employees_model->Update($update_data, $session['e_id']);
					$data['success'] = true;
				}
			}
		} catch(Exception $e) {
            $data['success'] = false;
            $data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}

	# Logout
	function logout() {
		$this->session->sess_destroy();
		redirect(base_url() . 'login');
	}
}