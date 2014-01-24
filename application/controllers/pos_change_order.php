<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Pos_change_order extends MY_Controller {

	# Index
	function index() {
		// JS
        $page_js = array(
            'pages/pos_change_order.js'
        );
        $this->smarty->assign('page_js', $page_js);

        $this->smarty->assign('page', 'Change Order');
        $this->smarty->assign('controller', 'pos_change_order');
		$this->smarty->assign('layout', 'default_layout.tpl');
		$this->smarty->view('pages/grid_container.tpl');
	}

	# Get Orders
	function get_orders() {
		$query = $this->input->get('query');
		$start = $this->input->get('start') == '' ? 0 : $this->input->get('start');
		$limit = $this->input->get('limit');
		$show_changed = $this->input->get('show_changed') == 'true' ? true : false;

		try {
			// Set Status to Pending Orders
			$status = array('P'); // Pending

			// Get Data
			$data['data'] = $this->orders_model->get_orders($query, $start, $limit, $status, $show_changed);
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
			$data['total'] = count($this->orders_model->get_orders($query, '', '', $status, $show_changed));

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

	# Get Ordered Items
	function get_ordered_items() {
		$o_id = $this->input->get('o_id');

		try {
			// Get Data
			$data['data'] = $this->orders_model->get_order_items_by_order_id($o_id);
			foreach($data['data'] as $k => $v) {
				$data['data'][$k]['item_display_name'] = '<strong>' . $v['i_name'] . '</strong>' . ($v['i_attribute'] != '' ? '-' . $v['i_attribute'] : '');
				$data['data'][$k]['subtotal'] = ($v['od_selling_price'] * $v['od_qty']) - ($v['od_discount'] * $v['od_qty']);
			}

			$data['success'] = true;
		} catch(Exception $e) {
			$data['success'] = false;
			$data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}

	# Get Changed Order Items
	function get_change_order_items() {
		$o_id = $this->input->post('o_id');

		try {
			// Get Change Order
			$change_order = $this->orders_model->get_change_order_by_order_id($o_id);
			$data['change_order'] = $change_order[0];

			// Get Change Order Items
			$change_order_items = $this->orders_model->get_change_order_items_by_change_order_id($change_order[0]['co_id']);
			$data['change_order_items'] = $change_order_items;

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

	# Save
	function save() {
		$ordered_items = json_decode($this->input->post('ordered_items'));
		$order_taking_items = json_decode($this->input->post('order_taking_items'));
		$amount_tendered = $this->input->post('amount_tendered');
		$total = $this->input->post('total');
		$o_id = $this->input->post('o_id');
		$session = $this->session->userdata('pos');

		try {
			// Insert Change Order data
			$insert_change_order_data = array(
				'co_amount_total' => $total,
				'co_amount_tendered' => $amount_tendered,
				'co_attended_by' => $session['e_id'],
				'o_id' => $o_id
			);
			$co_id = $this->orders_model->Insert_change_order($insert_change_order_data);

			// Insert Change Order Details
			foreach($ordered_items as $v) {
				$insert_change_order_details_data = array(
					'cod_selling_price' => $v->selling_price,
					'cod_purchase_price' => $v->purchase_price,
					'cod_discount' => $v->discount,
					'cod_qty' => $v->change_qty,
					'cod_vat' => $v->vat == '1' ? true : false,
					'cod_type' => 'O',
					'co_id' => $co_id,
					'i_id' => $v->id
				);
				$this->orders_model->Insert_change_order_details($insert_change_order_details_data);	
			}
			foreach($order_taking_items as $v) {
				$insert_change_order_details_data = array(
					'cod_selling_price' => $v->selling_price,
					'cod_purchase_price' => $v->purchase_price,
					'cod_discount' => $v->discount,
					'cod_qty' => $v->qty,
					'cod_vat' => $v->vat == '1' ? true : false,
					'cod_type' => 'N',
					'co_id' => $co_id,
					'i_id' => $v->id
				);
				$this->orders_model->Insert_change_order_details($insert_change_order_details_data);	
			}

			// Get Change Order
			$change_order = $this->orders_model->get_change_order_by_id($co_id);
			$data['change_order'] = $change_order[0];

			// Get Change Order Items
			$change_order_items = $this->orders_model->get_change_order_items_by_change_order_id($co_id);
			$data['change_order_items'] = $change_order_items;

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