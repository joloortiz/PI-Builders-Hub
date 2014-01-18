<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Reports_dashboard extends MY_Controller {

	# Index
	function index() {
		// JS
		$page_js = array(
			'pages/reports_dashboard.js'
		);
		$this->smarty->assign('page_js', $page_js);

        $this->smarty->assign('page', 'Dashboard');
        $this->smarty->assign('controller', 'reports_dashboard');
		$this->smarty->assign('layout', 'default_layout.tpl');
		$this->smarty->view('pages/reports_dashboard.tpl');
	}

	# Get Sales
	function get_sales() {
		try {
			// Set Timezone
			date_default_timezone_set('Asia/Manila');

			// Set Dates
			$day_of_week = date('w');
			$today_start = date('Y-m-d 00:00:00');
			$today_end = date('Y-m-d 23:59:59');
			$week_start  = date('Y-m-d 00:00:00', strtotime('-'. $day_of_week . ' days'));
			$month_start  = date('Y-m-d 00:00:00', strtotime(date('Y-m-01')));
			$year_start  = date('Y-m-d 00:00:00', strtotime(date('Y-01-01')));

			// Get Today's Sale
			$sales_today = $this->reports_model->get_sales_report_by_date_range($today_start, $today_end);
			$data['sales_today'] = $sales_today[0]['sales'];

			// Get Week to Date Sale
			$sales_week_to_date = $this->reports_model->get_sales_report_by_date_range($week_start, $today_end);
			$data['sales_week_to_date'] = $sales_week_to_date[0]['sales'];

			// Get Month to Date Sale
			$sales_month_to_date = $this->reports_model->get_sales_report_by_date_range($month_start, $today_end);
			$data['sales_month_to_date'] = $sales_month_to_date[0]['sales'];

			// Get Year to Date Sale
			$sales_year_to_date = $this->reports_model->get_sales_report_by_date_range($year_start, $today_end);
			$data['sales_year_to_date'] = $sales_year_to_date[0]['sales'];

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

		try {
			// Get Data
			$data['data'] = $this->reports_model->get_items_reordering($query, $start, $limit);
			foreach($data['data'] as $k => $v) {
				$data['data'][$k]['i_name'] = stripslashes($data['data'][$k]['i_name']);
			}
			
			// Get Total
			$data['total'] = count($this->reports_model->get_items_reordering($query, '', ''));

			$data['success'] = true;
		} catch(Exception $e) {
			$data['success'] = false;
			$data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}

	# Export Items for Reordering
	function export_items_reordering() {
		try {
			// Set Default Timezone
            date_default_timezone_set('Asia/Manila');

			// Get Items for Reordering
			$items_reordering = $this->reports_model->get_items_reordering();

			// Initialize CSV content
			$csv_content = array();
			$csv_content[] = array('Items for Reordering');
			$csv_content[] = array('Report Generated', date('M. j, Y g:i A'));
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
			$filename = 'Items_Reordering_' . date('YmdHis') . '.csv';
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