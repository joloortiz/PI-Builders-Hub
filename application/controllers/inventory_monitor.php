<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Inventory_monitor extends MY_Controller {

	# Index
	function index() {
		// JS
        $page_js = array(
            'pages/inventory_monitor.js'
        );
        $this->smarty->assign('page_js', $page_js);

        $this->smarty->assign('page', 'Inventory Monitor');
        $this->smarty->assign('controller', 'inventory_monitor');
		$this->smarty->assign('layout', 'default_layout.tpl');
		$this->smarty->view('pages/grid_container.tpl');
	}

	# Get Items
	function get_items() {
		$query = trim(mysql_real_escape_string($this->input->get('query')));
		$start = $this->input->get('start') == '' ? 0 : $this->input->get('start');
		$limit = $this->input->get('limit');
		$c_id = $this->input->get('c_id');
		$s_id = $this->input->get('s_id');
		$order_qty_on_hand = $this->input->get('order_qty_on_hand');

		try {
			// Get Data
			$items = $this->items_model->get_items($query, $start, $limit, false, $c_id, $s_id, $order_qty_on_hand);
			foreach($items as $k => $v) {
				$items[$k]['i_name'] = stripslashes($items[$k]['i_name']);
			}
			$data['data'] = $items;

			// Get Total
			$data['total'] = count($this->items_model->get_items($query, '', '', false, $c_id, $s_id, $order_qty_on_hand));

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
}