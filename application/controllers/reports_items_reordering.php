<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Reports_items_reordering extends MY_Controller {

	# Index
	function index() {
		// JS
		$page_js = array(
			'pages/reports_items_reordering.js'
		);
		$this->smarty->assign('page_js', $page_js);

        $this->smarty->assign('page', 'Items for Reordering');
        $this->smarty->assign('controller', 'reports_items_reordering');
		$this->smarty->assign('layout', 'default_layout.tpl');
		$this->smarty->view('pages/grid_container.tpl');
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

	# Get Items for Reordering
	function get_items_reordering() {
		$query = $this->input->get('query');
		$start = $this->input->get('start') == '' ? 0 : $this->input->get('start');
		$limit = $this->input->get('limit');
		$c_id = $this->input->get('c_id');
		$s_id = $this->input->get('s_id');

		try {
			// Get Data
			$data['data'] = $this->reports_model->get_items_reordering($query, $start, $limit, $c_id, $s_id);
			foreach($data['data'] as $k => $v) {
				$data['data'][$k]['i_name'] = stripslashes($data['data'][$k]['i_name']);
			}
			
			// Get Total
			$data['total'] = count($this->reports_model->get_items_reordering($query, '', '', $c_id, $s_id));

			$data['success'] = true;
		} catch(Exception $e) {
			$data['success'] = false;
			$data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}

	# Export Items for Reordering
	function export_items_reordering() {
		$c_id = $this->input->post('c_id');
		$s_id = $this->input->post('s_id');

		try {
			// Set Default Timezone
            date_default_timezone_set('Asia/Manila');

            // Get Category
            $category = '';
            if($c_id != 'all') {
            	$category_query = $this->categories_model->get_category_by_id($c_id);
            	$category = $category_query[0]['c_name'];
            } else {
            	$category = 'All';
            }

            // Get Supplier
            $supplier = '';
            if($s_id != 'all') {
            	$supplier_query = $this->suppliers_model->get_supplier_by_id($s_id);
            	$supplier = $supplier_query[0]['s_name'];
            } else {
            	$supplier = 'All';
            }

			// Get Items for Reordering
			$items_reordering = $this->reports_model->get_items_reordering('', '', '', $c_id, $s_id);

			// Initialize CSV content
			$csv_content = array();
			$csv_content[] = array('Items for Reordering Detailed');
			$csv_content[] = array('Report Generated', date('M. j, Y g:i A'));
			$csv_content[] = array('Category', $category);
			$csv_content[] = array('Supplier', $supplier);
			$csv_content[] = array('');
			$csv_content[] = array(
				'Item Name',
				'Reorder Level',
				'Qty on Hand',
				'Attribute',
				'Selling Price',
				'Purchase Price',
				'VAT',
				'Category',
				'Unit',
				'Supplier'
			);
			foreach($items_reordering as $v) {
				$csv_content[] = array(
					$v['i_name'],
					$v['i_reorder_level'],
					$v['qty_on_hand'],
					$v['i_attribute'],
					$v['i_selling_price'],
					$v['i_purchase_price'],
					$v['i_vat'] == '1' ? 'Yes' : 'No',
					$v['c_name'],
					$v['u_slug_name'],
					$v['s_name']
				);
			}

			// Populate CSV
			$filename = 'Items_Reordering_Detailed_' . date('YmdHis') . '.csv';
			$fp = fopen(dirname(__FILE__) . '\..\..\assets\files\\' . $filename , 'w+');
			foreach ($csv_content as $v) {
			    fputcsv($fp, $v);
			}
			fclose($fp);
			$data['filename'] = $filename;

			$data['success'] = true;
		} catch(Exception $e) {
			$data['success'] = false;
			$data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}

	# Download File
	function download_export_items_reordering() {
		$filename = mysql_real_escape_string($this->input->get('filename'));

		header('Content-Encoding: UTF-8');
        header('Content-Description: File Transfer');
        header('Content-Type: application/force-download; charset=UTF-8');
        header('Content-Disposition: attachment; filename=' . $filename);
        header('Cache-Control: max-age=0');
        flush();
        readfile(FILES_DIR . $filename);
        sleep(3);
        unlink(FILES_DIR . $filename);
        exit;
	}
}