<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Pos_order_history extends MY_Controller {

	# Index
	function index() {
		// JS
        $page_js = array(
            'pages/pos_order_history.js'
        );
        $this->smarty->assign('page_js', $page_js);

        $this->smarty->assign('page', 'Order History');
        $this->smarty->assign('controller', 'pos_order_history');
		$this->smarty->assign('layout', 'default_layout.tpl');
		$this->smarty->view('pages/grid_container.tpl');
	}

	# Get Orders
	function get_orders() {
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
			$data['data'] = $this->orders_model->get_orders($query, $start, $limit, $status, true);
			foreach($data['data'] as $k => $v) {
				$change = 0;
				if($v['o_amount_tendered'] >= $v['total']) {
					$change = $v['o_amount_tendered'] - $v['total'];
				} else {
					$change = $v['total'] - $v['o_amount_tendered'];
				}
				$data['data'][$k]['change'] = $change;
			}
			
			// Get Total
			$data['total'] = count($this->orders_model->get_orders($query, '', '', $status, true));

			$data['success'] = true;
		} catch(Exception $e) {
			$data['success'] = false;
			$data['msg'] = $e->getMessage();
		}

		echo json_encode($data);
	}

	# Void
	function void() {
		$o_id = $this->input->post('o_id');

		try {
			// Update Data
			$update_data = array(
				'o_status' => 'V'
			);
			$this->orders_model->Update($update_data, $o_id);
			
			$data['success'] = true;
		} catch(Exception $e) {
            $data['success'] = false;
            $data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}

	# Get Order Items
	function get_order_items() {
		$o_id = $this->input->post('o_id');

		try {
			// Get Order Items
			$order_items = $this->orders_model->get_order_items_by_order_id($o_id);
			$data['order_items'] = $order_items;

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
}