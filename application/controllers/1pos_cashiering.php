<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Pos_cashiering extends MY_Controller {

	# Index
	function index() {
		// JS
        $page_js = array(
            'pages/pos_cashiering.js'
        );
        $this->smarty->assign('page_js', $page_js);

        $this->smarty->assign('page', 'Cashiering');
        $this->smarty->assign('controller', 'pos_cashiering');
		$this->smarty->assign('layout', 'default_layout.tpl');
		$this->smarty->view('pages/grid_container.tpl');
	}

	# Get Orders
	function get_orders() {
		$query = $this->input->get('query');
		$start = $this->input->get('start') == '' ? 0 : $this->input->get('start');
		$limit = $this->input->get('limit');
		$type = $this->input->get('type');

		try {
			// Set Type
			if($type == '' || $type == 'all') {
				$type = array('S', 'R');
			} else if($type == 'S') {
				$type = array('S');
			} else if($type == 'R') {
				$type = array('R');
			}

			// Set Status to Pending Orders
			$status = 'P'; // Pending

			// Get Data
			$data['data'] = $this->orders_model->get_orders($query, $start, $limit, $type, $status);	
			
			// Get Total
			$data['total'] = count($this->orders_model->get_orders($query, '', '', $type, $status));

			$data['success'] = true;
		} catch(Exception $e) {
            $data['success'] = false;
            $data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}

	# Get Order Items
	function get_order_items() {

	}

	# Save
	function save() {
		$o_id = $this->input->post('o_id');
		$amount_tendered = $this->input->post('amount_tendered');
		$opt = $this->input->post('opt');
		$session = $this->session->userdata('pos');

		try {
			if($opt == 'void') {
				// Update Data
				$update_data = array(
					'o_status' => 'V',
					'o_processed_by' => $session['e_id']
				);
				$this->orders_model->Update($update_data, $o_id);
			} else if($opt == 'process') {
				
			}
			
			$data['success'] = true;
		} catch(Exception $e) {
            $data['success'] = false;
            $data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}
}