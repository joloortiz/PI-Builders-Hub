<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Reports_sales_by_date extends MY_Controller {

	# Index
	function index() {
		// JS
		$page_js = array(
			'pages/reports_sales_by_date.js'
		);
		$this->smarty->assign('page_js', $page_js);

        $this->smarty->assign('page', 'Sales by Date');
        $this->smarty->assign('controller', 'reports_sales_by_date');
		$this->smarty->assign('layout', 'default_layout.tpl');
		$this->smarty->view('pages/grid_container.tpl');
	}

	# Get Sales By Date
	function get_sales_by_date() {
		$datefrom = $this->input->get('datefrom') != '' ? date('Y-m-d 00:00:00', strtotime($this->input->get('datefrom'))) : date('Y-m-d 00:00:00');
		$dateto = $this->input->get('datefrom') != '' ? date('Y-m-d 23:59:59', strtotime($this->input->get('dateto'))) : date('Y-m-d 23:59:59');

		try {
			// Set Timezone
			date_default_timezone_set('Asia/Manila');

			$sales_data = array();
			$datefrom_time = strtotime($datefrom);
			$dateto_time = strtotime($dateto);
			$datediff = $dateto_time - $datefrom_time;
			$days = ceil($datediff/3600/24);

			// Get Sales of Date Range
			for($i = 0; $i < $days; $i++) {
				$start_time = date('Y-m-d 00:00:00', strtotime($datefrom . '+' . $i . ' days'));
				$end_time = date('Y-m-d 23:59:59', strtotime($datefrom . '+' . $i . ' days'));
				$sales = $this->reports_model->get_sales_report_by_date_range($start_time, $end_time);

				$sales_data[] = array(
					'start_time' => $start_time,
					'end_time' => $end_time,
					'sales' => $sales[0]['sales'], 
					'date' => date('Y-m-d', strtotime($start_time))
				);
			}
			$data['data'] = $sales_data;
		} catch(Exception $e) {
			$data['success'] = false;
			$data['msg'] = $e->getMessage();
        }

		echo json_encode($data);		
	}

	# Export Items for Reordering
	function export_sales_by_date() {
		$datefrom = $this->input->post('datefrom') != '' ? date('Y-m-d 00:00:00', strtotime($this->input->post('datefrom'))) : date('Y-m-d 00:00:00');
		$dateto = $this->input->post('datefrom') != '' ? date('Y-m-d 23:59:59', strtotime($this->input->post('dateto'))) : date('Y-m-d 23:59:59');

		try {
			// Set Default Timezone
            date_default_timezone_set('Asia/Manila');

			$sales_data = array();
			$datefrom_time = strtotime($datefrom);
			$dateto_time = strtotime($dateto);
			$datediff = $dateto_time - $datefrom_time;
			$days = ceil($datediff/3600/24);

			// Get Sales of Date Range
			for($i = 0; $i < $days; $i++) {
				$start_time = date('Y-m-d 00:00:00', strtotime($datefrom . '+' . $i . ' days'));
				$end_time = date('Y-m-d 23:59:59', strtotime($datefrom . '+' . $i . ' days'));
				$sales = $this->reports_model->get_sales_report_by_date_range($start_time, $end_time);

				$sales_data[] = array(
					'start_time' => $start_time,
					'end_time' => $end_time,
					'sales' => $sales[0]['sales'], 
					'date' => date('Y-m-d', strtotime($start_time))
				);
			}

			// Initialize CSV content
			$csv_content = array();
			$csv_content[] = array('Sales By Date');
			$csv_content[] = array('Report Generated', date('M. j, Y g:i A'));
			$csv_content[] = array('Date From', date('M. j, Y', strtotime($datefrom)));
			$csv_content[] = array('Date To', date('M. j, Y', strtotime($dateto)));
			$csv_content[] = array('');
			$csv_content[] = array(
				'Date',
				'Sales'
			);
			foreach($sales_data as $v) {
				$csv_content[] = array(
					date('M. j, Y', strtotime($v['date'])),
					number_format($v['sales'], 2)
				);
			}

			// Populate CSV
			$filename = 'Sales_By_Date' . date('YmdHis') . '.csv';
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
	function download_sales_by_date() {
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