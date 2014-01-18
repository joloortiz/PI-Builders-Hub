<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Purchasing_purchase_order extends MY_Controller {

	# Index
	function index() {
		// JS
        $page_js = array(
            'pages/purchasing_purchase_order.js'
        );
        $this->smarty->assign('page_js', $page_js);

        $this->smarty->assign('page', 'Purchase Order');
        $this->smarty->assign('controller', 'purchasing_purchase_order');
		$this->smarty->assign('layout', 'default_layout.tpl');
		$this->smarty->view('pages/grid_container.tpl');
	}

	# Get Purchase Orders
	function get_purchase_orders() {
		$query = $this->input->get('query');
		$start = $this->input->get('start') == '' ? 0 : $this->input->get('start');
		$limit = $this->input->get('limit');
		$status = $this->input->get('status');
		$show_deleted = $this->input->get('show_deleted') == 'true' ? true : false;

		try {
			// Set Status
			if($status == '' || $status == 'all') {
				$status = array('O', 'C');
			} else if($status == 'O') {
				$status = array('O');
			} else if($status == 'C') {
				$status = array('C');
			}

			// Get Data
			$data['data'] = $this->purchasing_model->get_purchase_orders($query, $start, $limit, $status, $show_deleted);
			
			// Get Total
			$data['total'] = count($this->purchasing_model->get_purchase_orders($query, '', '', $status, $show_deleted));

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

	# Get Purchase Order Items
	function get_purchase_order_items() {
		$po_id =  $this->input->post('po_id');

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
		$s_id = $this->input->post('s_id');
		$po_id = $this->input->post('po_id');
		$opt = $this->input->post('opt');
		$session = $this->session->userdata('pos');

		try {
			if($opt == 'add') {
				// Insert Purchase Order data
				$insert_po_data = array(
					'po_status' => 'O', // Open
					'po_created_by' => $session['e_id'],
					's_id' => $s_id
				);
				$po_id = $this->purchasing_model->Insert_purchase_order($insert_po_data);

				// Insert Purchase Order Details
				foreach($items as $v) {
					$insert_po_details_data = array(
						'pod_purchase_price' => $v->purchase_price,
						'pod_qty' => $v->qty,
						'pod_received' => 0, // Initialize as 0 received first
						'po_id' => $po_id,
						'i_id' => $v->id
					);
					$this->purchasing_model->Insert_purchase_order_details($insert_po_details_data);	
				}

				// Get Purchase Order
				$purchase_order = $this->purchasing_model->get_purchase_order_by_id($po_id);
				$data['purchase_order'] = $purchase_order[0];
			} else if($opt == 'edit') {
				// Delete Purchase Order Details
				$this->purchasing_model->Delete_purchase_order_details($po_id);

				// Insert Purchase Order Details
				foreach($items as $v) {
					$insert_po_details_data = array(
						'pod_purchase_price' => $v->purchase_price,
						'pod_qty' => $v->qty,
						'pod_received' => 0, // Initialize as 0 received first
						'po_id' => $po_id,
						'i_id' => $v->id
					);
					$this->purchasing_model->Insert_purchase_order_details($insert_po_details_data);	
				}

				// Get Purchase Order
				$purchase_order = $this->purchasing_model->get_purchase_order_by_id($po_id);
				$data['purchase_order'] = $purchase_order[0];
			} else if($opt == 'delete') {
				// Delete Data
				$delete_data = array(
					'is_deleted' => true
				);
				$this->purchasing_model->Update_purchase_order($delete_data, $po_id);
			} else if($opt == 'restore') {
				// Restore Data
				$restore_data = array(
					'is_deleted' => false
				);
				$this->purchasing_model->Update_purchase_order($restore_data, $po_id);
			}

			$data['success'] = true;
		} catch(Exception $e) {
			$data['success'] = false;
			$data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}
}