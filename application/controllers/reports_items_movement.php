<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Reports_items_movement extends MY_Controller {

	# Index
	function index() {
		// JS
		$page_js = array(
			'pages/reports_items_movement.js'
		);
		$this->smarty->assign('page_js', $page_js);

        $this->smarty->assign('page', 'Item Movement');
        $this->smarty->assign('controller', 'reports_items_movement');
		$this->smarty->assign('layout', 'default_layout.tpl');
		$this->smarty->view('pages/grid_container.tpl');
	}

	# Get Items Movement
	function get_items_movement() {
		$query = $this->input->get('query');
		$start = $this->input->get('start') == '' ? 0 : $this->input->get('start');
		$limit = $this->input->get('limit');
		$movement_type = $this->input->get('movement_type');
		$slow_moving_limit = $this->input->get('slow_moving_limit');
		$datefrom = $this->input->get('datefrom') != '' ? date('Y-m-d 00:00:00', strtotime($this->input->get('datefrom'))) : '';
		$dateto = $this->input->get('dateto') != '' ? date('Y-m-d 23:59:59', strtotime($this->input->get('dateto'))) : '';

		try {
			// Initialize Movement Qty
			$qtyfrom = '';
			$qtyto = '';
			if($movement_type == 'non') {
				$qtyfrom = '0';
				$qtyto = '0';
			} elseif($movement_type == 'slow') {
				$qtyfrom = '1';
				$qtyto = $slow_moving_limit;
			} elseif($movement_type == 'fast') {
				$qtyfrom = $slow_moving_limit + 1;
				$qtyto = '';
			}
			
			// Get Data
			$data['data'] = $this->reports_model->get_items_movement($query, $start, $limit, $datefrom, $dateto, $qtyfrom, $qtyto);
			foreach($data['data'] as $k => $v) {
				$data['data'][$k]['i_name'] = stripslashes($data['data'][$k]['i_name']);
			}

			// Get Total
			$data['total'] = count($this->reports_model->get_items_movement($query, '', '', $datefrom, $dateto, $qtyfrom, $qtyto));
			
			$data['success'] = true;
		} catch(Exception $e) {
            $data['success'] = false;
            $data['msg'] = $e->getMessage();
        }

		echo json_encode($data);
	}

	# Export Items Movement
	function export_items_movement() {
		$movement_type = $this->input->post('movement_type');
		$slow_moving_limit = $this->input->post('slow_moving_limit');
		$datefrom = $this->input->post('datefrom') != '' ? date('Y-m-d 00:00:00', strtotime($this->input->post('datefrom'))) : '';
		$dateto = $this->input->post('dateto') != '' ? date('Y-m-d 23:59:59', strtotime($this->input->post('dateto'))) : '';

		try {
			// Set Default Timezone
            date_default_timezone_set('Asia/Manila');

            // Initialize Movement Qty
			$qtyfrom = '';
			$qtyto = '';
			if($movement_type == 'non') {
				$qtyfrom = '0';
				$qtyto = '0';
				$movement_type_name = 'NON-Moving Items';
			} elseif($movement_type == 'slow') {
				$qtyfrom = '1';
				$qtyto = $slow_moving_limit;
				$movement_type_name = 'SLOW-Moving Items';
			} elseif($movement_type == 'fast') {
				$qtyfrom = $slow_moving_limit + 1;
				$qtyto = '';
				$movement_type_name = 'FAST-Moving Items';
			}
			
			// Get Items for Reordering
			$items_movement = $this->reports_model->get_items_movement('', '', '', $datefrom, $dateto, $qtyfrom, $qtyto);

			// Initialize CSV content
			$csv_content = array();
			$csv_content[] = array('Items Movement');
			$csv_content[] = array('Report Generated', date('M. j, Y g:i A'));
			$csv_content[] = array('Movement Type', $movement_type_name);
			$csv_content[] = array('Date From', $datefrom != '' ? date('M. j, Y', strtotime($datefrom)) : '');
			$csv_content[] = array('Date To', $dateto != '' ? date('M. j, Y', strtotime($dateto)) : '');
			$csv_content[] = array('Slow Moving Limit', $slow_moving_limit);
			$csv_content[] = array('');
			$csv_content[] = array(
				'Item Name',
				'Movement',
				'Attribute',
				'Selling Price',
				'Purchase Price',
				'VAT',
				'Category',
				'Unit',
				'Supplier'
			);
			foreach($items_movement as $v) {
				$csv_content[] = array(
					$v['i_name'],
					$v['item_movement'],
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
			$filename = 'Items_Movement_' . date('YmdHis') . '.csv';
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
	function download_export_items_movement() {
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