<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Pos_order_taking extends MY_Controller {

	# Index
	function index() {
		// JS
        $page_js = array(
            'pages/pos_order_taking.js'
        );
        $this->smarty->assign('page_js', $page_js);

        $this->smarty->assign('page', 'Order Taking');
        $this->smarty->assign('controller', 'pos_order_taking');
		$this->smarty->assign('layout', 'default_layout.tpl');
		$this->smarty->view('pages/grid_container.tpl');
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
		// $query = trim(mysql_real_escape_string($this->input->get('query')));
		$c_id = strtolower($this->input->post('c_id'));

		try {
			// Get Data
			$data['data'] = $this->items_model->get_items('', '', '', false, $c_id);
			foreach($data['data'] as $k => $v) {
				$data['data'][$k]['display_name'] = $v['i_name'] . '-' . $v['i_attribute'] . '(' . $v['u_slug_name'] . ')';
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
		$all_items = json_decode($this->input->post('all_items'));
		$vattable_items = json_decode($this->input->post('vattable_items'));
		$include_vattable = $this->input->post('include_vattable');
		$amount_tendered = $this->input->post('amount_tendered');
		$total = $this->input->post('total');
		$session = $this->session->userdata('pos');
		
		try {
			// Insert Order Data
			$insert_order_data = array(
				'o_amount_tendered' => $amount_tendered,
				'o_status' => 'P', // Processed
				'o_attended_by' => $session['e_id']
			);
			$o_id = $this->orders_model->Insert($insert_order_data);

			// Insert Order Details
			foreach($all_items as $v) {
				$insert_order_details_data = array(
					'od_selling_price' => $v->selling_price,
					'od_purchase_price' => $v->purchase_price,
					'od_discount' => $v->discount,
					'od_qty' => $v->qty,
					'od_vat' => $v->vat == '1' ? true : false,
					'i_id' => $v->id,
					'o_id' => $o_id
				);
				$this->orders_model->Insert_order_details($insert_order_details_data);	
			}

			// Get Order
			$order = $this->orders_model->get_order_by_id($o_id);
			$data['order'] = $order[0];

			$data['success'] = true;
		} catch(Exception $e) {
			$data['success'] = false;
			$data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}
}