<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Purchasing_return_items extends MY_Controller {

	# Index
	function index() {
		// JS
        $page_js = array(
            'pages/purchasing_return_items.js'
        );
        $this->smarty->assign('page_js', $page_js);

        $this->smarty->assign('page', 'Return Items');
        $this->smarty->assign('controller', 'purchasing_return_items');
		$this->smarty->assign('layout', 'default_layout.tpl');
		$this->smarty->view('pages/grid_container.tpl');
	}

	# Get Returns
	function get_returns() {
		$query = $this->input->get('query');
		$start = $this->input->get('start') == '' ? 0 : $this->input->get('start');
		$limit = $this->input->get('limit');
		$status = $this->input->get('status');

		try {
			// Set Status
			if($status == '' || $status == 'all') {
				$status = array('P', 'V');
			} else if($status == 'P') {
				$status = array('P');
			} else if($status == 'V') {
				$status = array('V');
			}

			// Get Data
			$data['data'] = $this->purchasing_model->get_returns($query, $start, $limit, $status);
			
			// Get Total
			$data['total'] = count($this->purchasing_model->get_returns($query, '', '', $status));

			$data['success'] = true;
		} catch(Exception $e) {
            $data['success'] = false;
            $data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}

	# Get Return Items
	function get_return_items() {
		$rn_id = $this->input->post('rn_id');

		try {
			// Get Return Items
			$return_items = $this->purchasing_model->get_return_items_by_return_id($rn_id);
			$data['return_items'] = $return_items;

			// Get Store Information
			$store_information = $this->store_information_model->get_store_information();
			$data['store_information'] = $store_information[0];
			
			$data['success'] = true;
		} catch(Exception $e) {
            $data['success'] = false;
            $data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}

	# Get Suppliers
	function get_suppliers() {
		try {
			// Get Data
			$data['data'] = $this->suppliers_model->get_suppliers();
			
			$data['success'] = true;
		} catch(Exception $e) {
            $data['success'] = false;
            $data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}

	# Get Categories
	function get_categories() {
		try {
			// Get Data
			$data['data'] = $this->categories_model->get_categories();
			$all_arr = array(
				'c_id' => 'all',
				'c_name' => 'All'
			);
			array_unshift($data['data'], $all_arr);
			
			$data['success'] = true;
		} catch(Exception $e) {
            $data['success'] = false;
            $data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}

	# Get Items
	function get_items() {
		$c_id = $this->input->post('c_id');
		$s_id = $this->input->post('s_id');

		try {
			// Get Data
			$data['data'] = $this->items_model->get_items('', '', '', false, $c_id, $s_id);
			foreach($data['data'] as $k => $v) {
				$data['data'][$k]['i_name'] = stripslashes($data['data'][$k]['i_name']);
				$data['data'][$k]['display_name'] = stripslashes($v['i_name'] . '-' . $v['i_attribute'] . '(' . $v['u_slug_name'] . ')');
			}

			$data['success'] = true;
		} catch(Exception $e) {
			$data['success'] = false;
			$data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
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
		$items = json_decode($this->input->post('items'));
		$s_id = $this->input->post('s_id');
		$session = $this->session->userdata('pos');
		
		try {
			// Insert Return data
			$insert_return_data = array(
				'rn_status' => 'P', // Processed
				'rn_returned_by' => $session['e_id'],
				's_id' => $s_id
			);
			$rn_id = $this->purchasing_model->Insert_return($insert_return_data);

			// Insert Return Details
			foreach($items as $v) {
				$insert_return_details_data = array(
					'rnd_purchase_price' => $v->purchase_price,
					'rnd_qty' => $v->qty,
					'rn_id' => $rn_id,
					'i_id' => $v->id
				);
				$this->purchasing_model->Insert_return_details($insert_return_details_data);
			}

			// Get Return
			$return = $this->purchasing_model->get_return_by_id($rn_id);
			$data['return_'] = $return[0];

			$data['success'] = true;
		} catch(Exception $e) {
			$data['success'] = false;
			$data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}

	# Void
	function void() {
		$rn_id = $this->input->post('rn_id');

		try {
			// Update Data
			$update_data = array(
				'rn_status' => 'V'
			);
			$this->purchasing_model->Update_return($update_data, $rn_id);
			
			$data['success'] = true;
		} catch(Exception $e) {
            $data['success'] = false;
            $data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}
}