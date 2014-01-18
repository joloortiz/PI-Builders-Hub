<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Pos_credit_history extends MY_Controller {

	# Index
	function index() {
		// JS
		$page_js = array(
			'pages/pos_credit_history.js'
		);
		$this->smarty->assign('page_js', $page_js);

		$this->smarty->assign('page', 'Credit History');
		$this->smarty->assign('controller', 'pos_credit_history');
		$this->smarty->assign('layout', 'default_layout.tpl');
		$this->smarty->view('pages/grid_container.tpl');
	}

	# Get Credits
	function get_credits() {
		$query = $this->input->get('query');
		$start = $this->input->get('start') == '' ? 0 : $this->input->get('start');
		$limit = $this->input->get('limit');
		$status = $this->input->get('status');

		try {
			// Set Status
			if($status == '' || $status == 'all') {
				$status = '';
			}

			// Get Data
			$data['data'] = $this->orders_model->get_credits($query, $start, $limit, $status);
			
			// Get Total
			$data['total'] = count($this->orders_model->get_credits($query, '', '', $status));

			$data['success'] = true;
		} catch(Exception $e) {
			$data['success'] = false;
			$data['msg'] = $e->getMessage();
		}

		echo json_encode($data);
	}

	# Get Credit Payments
	function get_credit_payments() {
		$cr_id = $this->input->get('cr_id');

		try {
			// Get Data
			$data['data'] = $this->orders_model->get_credit_payments('', '', '', $cr_id);

			$data['success'] = true;
		} catch(Exception $e) {
			$data['success'] = false;
			$data['msg'] = $e->getMessage();
		}

		echo json_encode($data);
	}

	# Get Credit Payment By Id
	function get_credit_payment_by_id() {
		$crp_id = $this->input->post('crp_id');

		try {
			// Get Credit Payment
			$credit_payment = $this->orders_model->get_credit_payment_by_id($crp_id);
			$data['credit_payment'] = $credit_payment[0];

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
		$amount_to_pay = $this->input->post('amount_to_pay');
		$amount_tendered = $this->input->post('amount_tendered');
		$cr_id = $this->input->post('cr_id');
		$session = $this->session->userdata('pos');

		try {
			// Insert Credit Payment
			$insert_credit_payment_data = array(
				'crp_amount_payed' => $amount_to_pay,
				'crp_amount_tendered' => $amount_tendered,
				'crp_attended_by' => $session['e_id'],
				'cr_id' => $cr_id
			);
			$crp_id = $this->orders_model->Insert_credit_payment($insert_credit_payment_data);
			
			// Get Credit Payment
			$credit_payment = $this->orders_model->get_credit_payments('', '', '', $cr_id, $crp_id);
			$data['credit_payment'] = $credit_payment[0];

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