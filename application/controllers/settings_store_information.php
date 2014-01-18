<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Settings_store_information extends MY_Controller {
	
	# Index
	function index() {
		// JS
        $page_js = array(
            'pages/settings_store_information.js'
        );
        $this->smarty->assign('page_js', $page_js);

        $this->smarty->assign('page', 'Store Information');
        $this->smarty->assign('controller', 'settings_store_information');
		$this->smarty->assign('layout', 'default_layout.tpl');
		$this->smarty->view('pages/grid_container.tpl');
	}

	# Get Store Information
	function get_store_information() {
		try {
			// Get Data
			$store_information = $this->store_information_model->get_store_information();
			$data['data'] = $store_information[0];

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
		$address = mysql_real_escape_string($this->input->post('frm_address'));
		$owner = mysql_real_escape_string($this->input->post('frm_owner'));
		$telephone_no = mysql_real_escape_string($this->input->post('frm_telephone_no'));
		$email = mysql_real_escape_string($this->input->post('frm_email'));

		try {
			// Update Store Information
			$update_data = array(
				'si_name' => $name,
				'si_address' => $address,
				'si_owner' => $owner,
				'si_telephone_no' => $telephone_no,
				'si_email' => $email
			);
			$this->store_information_model->Update($update_data);

			$data['success'] = true;
		} catch(Exception $e) {
			$data['success'] = false;
			$data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}
}