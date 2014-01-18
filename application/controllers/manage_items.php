<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Manage_items extends MY_Controller {

	# Index
	function index() {
		// JS
        $page_js = array(
            'pages/manage_items.js'
        );
        $this->smarty->assign('page_js', $page_js);

        $this->smarty->assign('page', 'Items');
        $this->smarty->assign('controller', 'manage_items');
		$this->smarty->assign('layout', 'default_layout.tpl');
		$this->smarty->view('pages/grid_container.tpl');
	}

	# Get Items
	function get_items() {
		$query = mysql_real_escape_string($this->input->get('query'));
		$start = $this->input->get('start') == '' ? 0 : $this->input->get('start');
		$limit = $this->input->get('limit');
		$show_deleted = $this->input->get('show_deleted') == 'true' ? true : false;
		
		try {
			// Get Data
			$items = $this->items_model->get_items($query, $start, $limit, $show_deleted);
			foreach($items as $k => $v) {
				$items[$k]['i_name'] = stripslashes($items[$k]['i_name']);
			}
			$data['data'] = $items;

			// Get Total
			$data['total'] = count($this->items_model->get_items($query, '', '', $show_deleted));

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
			
			$data['success'] = true;
		} catch(Exception $e) {
            $data['success'] = false;
            $data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}

	# Get Units
	function get_units() {
		try {
			// Get Data
			$data['data'] = $this->units_model->get_units();
			
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

	# Check if existing
	function check_existing() {
		$name = mysql_real_escape_string($this->input->post('name'));
		$attribute = mysql_real_escape_string($this->input->post('attribute'));
		$i_id = $this->input->post('i_id');

		try {
			// Chek Name and Attribute
			$data['msg_name'] = $this->items_model->check_name_existing($name, $attribute, $i_id) == true ? 'Item Name with Attribute is existing' : '';
			
			$data['success'] = true;
		} catch(Exception $e) {
            $data['success'] = false;
            $data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}

	# Save
	function save() {
		$name = mysql_real_escape_string($this->input->post('frm_name'));
		$attribute = mysql_real_escape_string($this->input->post('frm_attribute'));
		$selling_price = mysql_real_escape_string($this->input->post('frm_selling_price'));
		$purchase_price = mysql_real_escape_string($this->input->post('frm_purchase_price'));
		$vat = $this->input->post('frm_vat_check') != '' ? true : false;
		$reorder_level = mysql_real_escape_string($this->input->post('frm_reorder_level'));
		$category_id = mysql_real_escape_string($this->input->post('frm_sel_category'));
		$unit_id = mysql_real_escape_string($this->input->post('frm_sel_unit'));
		$supplier_id = mysql_real_escape_string($this->input->post('frm_sel_supplier'));
		$i_id = $this->input->post('i_id');
		$opt = $this->input->post('opt');
		
		try {
			if($opt == 'add') {
				// Insert Data
				$insert_data = array(
					'i_name' => $name,
					'i_attribute' => $attribute,
					'i_selling_price' => $selling_price,
					'i_purchase_price' => $purchase_price,
					'i_vat' => $vat,
					'i_reorder_level' => $reorder_level,
					'c_id' => $category_id,
					'u_id' => $unit_id,
					's_id' => $supplier_id
				);
				$this->items_model->Insert($insert_data);
			} else if($opt == 'edit') {
				// Update Data
				$update_data = array(
					'i_name' => $name,
					'i_attribute' => $attribute,	
					'i_selling_price' => $selling_price,
					'i_purchase_price' => $purchase_price,
					'i_vat' => $vat,
					'i_reorder_level' => $reorder_level,
					'c_id' => $category_id,
					'u_id' => $unit_id,
					's_id' => $supplier_id
				);
				$this->items_model->Update($update_data, $i_id);
			} else if($opt == 'delete') {
				// Delete Data
				$delete_data = array(
					'is_deleted' => true
				);
				$this->items_model->Update($delete_data, $i_id);
			} else if($opt == 'restore') {
				// Restore Data
				$restore_data = array(
					'is_deleted' => false
				);
				$this->items_model->Update($restore_data, $i_id);
			}
			
			$data['success'] = true;
		} catch(Exception $e) {
            $data['success'] = false;
            $data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}
}