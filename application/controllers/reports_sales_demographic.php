<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Reports_sales_demographic extends MY_Controller {

	# Index
	function index() {
		// JS
		$page_js = array(
			'pages/reports_sales_demographic.js'
		);
		$this->smarty->assign('page_js', $page_js);

        $this->smarty->assign('page', 'Sales');
        $this->smarty->assign('controller', 'reports_sales_demographic');
		$this->smarty->assign('layout', 'default_layout.tpl');
		$this->smarty->view('pages/grid_container.tpl');
	}

	# Get Sales
	function get_sales() {
		$sales_time = $this->input->get('sales_time');
		$datefrom = date('Y-m-d 00:00:00', strtotime($this->input->get('datefrom')));
		$dateto = date('Y-m-d 23:59:59', strtotime($this->input->get('dateto')));

		try {
			// Set Timezone
			date_default_timezone_set('Asia/Manila');

			$sales_data = array();
			if($sales_time == 'today') {
				// Get Data from Hours
				for($i = 0; $i < 24; $i++) {
					$start_time = date('Y-m-d H:i:s', strtotime(date('Y-m-d ' . $i . ':00:01')));
					$end_time = date('Y-m-d H:i:s', strtotime(date('Y-m-d ' . ($i + 1) . ':00:00')));
					$sales = $this->reports_model->get_sales_report_by_date_range($start_time, $end_time);

					$sales_data[] = array(
						'start_time' => $start_time,
						'end_time' => $end_time,
						'sales' => $sales[0]['sales'], 
						'date' => date('gA', strtotime($end_time))
					);
				}
			} elseif($sales_time == 'week') {
				$day_of_week = date('w');

				// Get Data from Days of the Week
				for($i = 0; $i < 7; $i++) {
					$day_num = $i - $day_of_week;
					$start_time = date('Y-m-d 00:00:00', strtotime(($day_num >= 0 ? '+' . $day_num : $day_num) . ' days'));
					$end_time = date('Y-m-d 23:59:59', strtotime(($day_num >= 0 ? '+' . $day_num : $day_num) . ' days'));
					$sales = $this->reports_model->get_sales_report_by_date_range($start_time, $end_time);

					$sales_data[] = array(
						'start_time' => $start_time,
						'end_time' => $end_time,
						'sales' => $sales[0]['sales'], 
						'date' => date('l', strtotime($start_time))
					);
				}
			} elseif($sales_time == 'month') {
				// Get Data from Days of the Month
				for($i = 1; $i <= date('t'); $i++) {
					$start_time = date('Y-m-d 00:00:00', strtotime(date('Y-m-' . $i)));
					$end_time = date('Y-m-d 23:59:59', strtotime(date('Y-m-' . $i)));
					$sales = $this->reports_model->get_sales_report_by_date_range($start_time, $end_time);

					$sales_data[] = array(
						'start_time' => $start_time,
						'end_time' => $end_time,
						'sales' => $sales[0]['sales'], 
						'date' => date('Y-m-d', strtotime($start_time))
					);
				}
			} elseif($sales_time == 'year') {
				// Get Months of the Year
				for($i = 1; $i <= 12; $i++) {
					$start_time = date('Y-m-d 00:00:00', strtotime(date('Y-' . $i . '-01')));
					$end_time = date('Y-m-d 23:59:59', strtotime(date('Y-' . $i . '-' . date('t', strtotime($start_time)))));
					$sales = $this->reports_model->get_sales_report_by_date_range($start_time, $end_time);

					$sales_data[] = array(
						'start_time' => $start_time,
						'end_time' => $end_time,
						'sales' => $sales[0]['sales'], 
						'date' => date('F', strtotime($start_time))
					);
				}
			} elseif($sales_time == 'daterange') {
				$datefrom_time = strtotime($datefrom);
				$dateto_time = strtotime($dateto);
				$datediff = $dateto_time - $datefrom_time;
				$days = ceil($datediff/3600/24);
				
				// Get Dates of Date Range
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
			}
			$data['data'] = $sales_data;

			$data['success'] = true;
		} catch(Exception $e) {
			$data['success'] = false;
			$data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}
}