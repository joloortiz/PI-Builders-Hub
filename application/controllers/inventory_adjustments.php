<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Inventory_adjustments extends MY_Controller {

	# Index
	function index() {
		// JS
        $page_js = array(
            'pages/inventory_adjustments.js'
        );
        $this->smarty->assign('page_js', $page_js);

        $this->smarty->assign('page', 'Adjustments');
        $this->smarty->assign('controller', 'inventory_adjustments');
		$this->smarty->assign('layout', 'default_layout.tpl');
		$this->smarty->view('pages/grid_container.tpl');
	}

	# Get Adjustments
	function get_adjustments() {
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
			$data['data'] = $this->inventory_model->get_adjustments($query, $start, $limit, $status);
			
			// Get Total
			$data['total'] = count($this->inventory_model->get_adjustments($query, '', '', $status));

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
			$all_arr = array(
				's_id' => 'all',
				's_name' => 'All'
			);
			array_unshift($data['data'], $all_arr);
			
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
			// $all_arr = array(
			// 	'c_id' => 'all',
			// 	'c_name' => 'All'
			// );
			// array_unshift($data['data'], $all_arr);
			
			$data['success'] = true;
		} catch(Exception $e) {
            $data['success'] = false;
            $data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}

	# Get Items
	function get_items() {
		$query = trim(mysql_real_escape_string($this->input->get('query')));
		$c_id = $this->input->post('c_id');

		try {
			// Get Data
			$data['data'] = $this->items_model->get_items($query, '', '', false, $c_id);
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
		$session = $this->session->userdata('pos');
		
		try {
			// Insert Adjustment data
			$insert_adjustment_data = array(
				'a_status' => 'P', // Processed
				'a_adjusted_by' => $session['e_id']
			);
			$a_id = $this->inventory_model->Insert_adjustment($insert_adjustment_data);

			// Insert Adjustment Details
			foreach($items as $v) {
				$insert_adjustment_details_data = array(
					'ad_qty' => $v->qty,
					'a_id' => $a_id,
					'i_id' => $v->id
				);
				$this->inventory_model->Insert_adjustment_details($insert_adjustment_details_data);
			}

			// Get Adjustment
			$adjust = $this->inventory_model->get_adjustment_by_id($a_id);
			$data['adjust'] = $adjust[0];

			$data['success'] = true;
		} catch(Exception $e) {
			$data['success'] = false;
			$data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}

	# Void
	function void() {
		$a_id = $this->input->post('a_id');

		try {
			// Update Data
			$update_data = array(
				'a_status' => 'V'
			);
			$this->inventory_model->Update_adjustment($update_data, $a_id);
			
			$data['success'] = true;
		} catch(Exception $e) {
            $data['success'] = false;
            $data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}
}