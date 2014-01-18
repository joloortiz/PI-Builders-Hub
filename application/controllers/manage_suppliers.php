<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Manage_suppliers extends MY_Controller {

	# Index
	function index() {
		// JS
        $page_js = array(
            'pages/manage_suppliers.js'
        );
        $this->smarty->assign('page_js', $page_js);

        $this->smarty->assign('page', 'Suppliers');
        $this->smarty->assign('controller', 'manage_suppliers');
		$this->smarty->assign('layout', 'default_layout.tpl');
		$this->smarty->view('pages/grid_container.tpl');
	}

	# Get Suppliers
	function get_suppliers() {
		$query = $this->input->get('query');
		$start = $this->input->get('start') == '' ? 0 : $this->input->get('start');
		$limit = $this->input->get('limit');
		$show_deleted = $this->input->get('show_deleted') == 'true' ? true : false;
		
		try {
			// Get Data
			$data['data'] = $this->suppliers_model->get_suppliers($query, $start, $limit, $show_deleted);
			
			// Get Total
			$data['total'] = count($this->suppliers_model->get_suppliers($query, '', '', $show_deleted));

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
		$s_id = $this->input->post('s_id');

		try {
			// Chek Name
			$data['msg_name'] = $this->suppliers_model->check_name_existing($name, $s_id) == true ? 'Supplier Name is existing' : '';
			
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
		$contact_person = mysql_real_escape_string($this->input->post('frm_contact_person'));
		$contact_number = mysql_real_escape_string($this->input->post('frm_contact_number'));
		$address = mysql_real_escape_string($this->input->post('frm_address'));
		$s_id = $this->input->post('s_id');
		$opt = $this->input->post('opt');

		try {
			if($opt == 'add') {
				// Insert Data
				$insert_data = array(
					's_name' => $name,
					's_contact_person' => $contact_person,
					's_contact_number' => $contact_number,
					's_address' => $address
				);
				$this->suppliers_model->Insert($insert_data);
			} else if($opt == 'edit') {
				// Update Data
				$update_data = array(
					's_name' => $name,
					's_contact_person' => $contact_person,
					's_contact_number' => $contact_number,
					's_address' => $address
				);
				$this->suppliers_model->Update($update_data, $s_id);
			} else if($opt == 'delete') {
				// Delete Data
				$delete_data = array(
					'is_deleted' => true
				);
				$this->suppliers_model->Update($delete_data, $s_id);
			} else if($opt == 'restore') {
				// Restore Data
				$restore_data = array(
					'is_deleted' => false
				);
				$this->suppliers_model->Update($restore_data, $s_id);
			}
			
			$data['success'] = true;
		} catch(Exception $e) {
            $data['success'] = false;
            $data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}
}