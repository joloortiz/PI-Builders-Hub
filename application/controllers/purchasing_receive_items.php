<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Purchasing_receive_items extends MY_Controller {

	# Index
	function index() {
		// JS
        $page_js = array(
            'pages/purchasing_receive_items.js'
        );
        $this->smarty->assign('page_js', $page_js);

        $this->smarty->assign('page', 'Receive Items');
        $this->smarty->assign('controller', 'purchasing_receive_items');
		$this->smarty->assign('layout', 'default_layout.tpl');
		$this->smarty->view('pages/grid_container.tpl');
	}

	# Get Receivings
	function get_receivings() {
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
			$data['data'] = $this->purchasing_model->get_receivings($query, $start, $limit, $status);
			
			// Get Total
			$data['total'] = count($this->purchasing_model->get_receivings($query, '', '', $status));

			$data['success'] = true;
		} catch(Exception $e) {
            $data['success'] = false;
            $data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}

	# Get Receiving Items
	function get_receiving_items() {
		$r_id = $this->input->post('r_id');

		try {
			// Get Receiving Items
			$receiving_items = $this->purchasing_model->get_receiving_items_by_receiving_id($r_id);
			$data['receiving_items'] = $receiving_items;

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
		$c_id = strtolower($this->input->post('c_id'));

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

	# Get Purchase Orders
	function get_purchase_orders() {
		try {
			// Set Status
			$status = array('O'); // Open

			// Get Data
			$data['data'] = $this->purchasing_model->get_purchase_orders('', '', '', $status);

			$data['success'] = true;
		} catch(Exception $e) {
            $data['success'] = false;
            $data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}

	# Get Purchase Order Items
	function get_purchase_order_items() {
		$po_id =  $this->input->get('po_id');

		try {
			// Get Data
			$data['data'] = $this->purchasing_model->get_purchase_order_items($po_id);

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
		// $s_id = $this->input->post('s_id');
		$po_id = $this->input->post('po_id');
		$session = $this->session->userdata('pos');
		
		try {
			// Insert Receiving data
			$insert_receiving_data = array(
				'r_status' => 'P', // Processed
				'r_received_by' => $session['e_id']
				// ,
				// 's_id' => $s_id
			);
			if($po_id != '') {
				$insert_receiving_data['po_id'] = $po_id;
			}
			$r_id = $this->purchasing_model->Insert_receiving($insert_receiving_data);

			// Insert Receiving Details
			foreach($items as $v) {
				$insert_receiving_details_data = array(
					'rd_purchase_price' => $v->purchase_price,
					'rd_qty' => $v->qty,
					'r_id' => $r_id,
					'i_id' => $v->id
				);
				$this->purchasing_model->Insert_receiving_details($insert_receiving_details_data);

				// Update Item's Supplier & Category
				$update_item_data = array(
					's_id' => $v->s_id,
					'c_id' => $v->c_id
				);
				$this->items_model->Update($update_item_data, $v->id);

				// If pod_id is existing, Updat Purchase Order Detail
				if($v->pod_id != '') {
					$this->purchasing_model->Update_purchase_order_details_received($v->pod_id, $v->qty);
				}
			}

			// If po_id is existing, Update Purchase Order Status if all items are received
			if($po_id != '') {
				$this->purchasing_model->Update_purchase_order_received($po_id);
			}

			// Get Receiving
			$receiving = $this->purchasing_model->get_receiving_by_id($r_id);
			$data['receiving'] = $receiving[0];

			$data['success'] = true;
		} catch(Exception $e) {
			$data['success'] = false;
			$data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}

	# Void
	function void() {
		$r_id = $this->input->post('r_id');

		try {
			// Update Data
			$update_data = array(
				'r_status' => 'V'
			);
			$this->purchasing_model->Update_receiving($update_data, $r_id);
			
			$data['success'] = true;
		} catch(Exception $e) {
            $data['success'] = false;
            $data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}
}