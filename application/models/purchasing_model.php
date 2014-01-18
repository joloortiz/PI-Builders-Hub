<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Purchasing_model extends CI_Model {

	# Get Receivings
	function get_receivings($query='', $start='', $limit='', $status='') {
		// Select
		$this->db->select('
			r.*,
			CONCAT(e.e_fname, \' \', e.e_lname) AS received_name,
			(SELECT SUM(rd_purchase_price * rd_qty) FROM receiving_details WHERE r_id = r.r_id) AS total_cost,
			s.s_id,
			s.s_name,
			po.po_purchase_order_number
		', FALSE);
		$this->db->from('receivings r');
		$this->db->join('employees e', 'r.r_received_by = e.e_id', 'left');
		$this->db->join('suppliers s', 'r.s_id = s.s_id', 'left');
		$this->db->join('purchase_orders po', 'r.po_id = po.po_id', 'left');

		// Options
		if($query != '') {
			$filter_query = array();
			$filter_query[] = "r.r_receiving_number = " . $query;
			$filter_query[] = "e.e_fname LIKE '%" . $query . "%'";
			$filter_query[] = "e.e_lname LIKE '%" . $query . "%'";
			$this->db->where('(' . implode(' OR ', $filter_query) . ')');
		}
		if($status != '') {
			$this->db->where_in('r.r_status', $status);
		}
		$this->db->order_by('r.r_date', 'desc');

		// Get Data
		if($start == '' && $limit == '') {
			$query = $this->db->get();
		} else {
			$this->db->limit($limit, $start);
			$query = $this->db->get();
		}
		return $query->result_array();
	}

	# Get Receiving By Id
	function get_receiving_by_id($r_id) {
		// Select
		$this->db->select('
			r.*,
			CONCAT(e.e_fname, \' \', e.e_lname) AS received_name,
			(SELECT SUM(rd_purchase_price * rd_qty) FROM receiving_details WHERE r_id = r.r_id) AS total_cost,
			s.s_id,
			s.s_name,
			po.po_purchase_order_number
		', FALSE);
		$this->db->from('receivings r');
		$this->db->join('employees e', 'r.r_received_by = e.e_id', 'left');
		$this->db->join('suppliers s', 'r.s_id = s.s_id', 'left');
		$this->db->join('purchase_orders po', 'r.po_id = po.po_id', 'left');

		// Options
		$this->db->where('r.r_id', $r_id);

		// Get Data
		$query = $this->db->get();
		return $query->result_array();
	}

	# Get Receiving Items By Receiving Id
	function get_receiving_items_by_receiving_id($r_id) {
		// Select
		$this->db->select('rd.*, i.i_name, i.i_attribute, u.u_id, u.u_name, u.u_slug_name');
		$this->db->from('receiving_details rd');
		$this->db->join('items i', 'rd.i_id = i.i_id', 'left');
		$this->db->join('units u', 'i.u_id = u.u_id', 'left');

		// Options
		$this->db->where('rd.r_id', $r_id);

		// Get Data
		$query = $this->db->get();
		return $query->result_array();
	}

	# Get Returns
	function get_returns($query='', $start='', $limit='', $status='') {
		// Select
		$this->db->select('
			rn.*,
			CONCAT(e.e_fname, \' \', e.e_lname) AS returned_name,
			(SELECT SUM(rnd_purchase_price * rnd_qty) FROM return_details WHERE rn_id = rn.rn_id) AS total_cost,
			s.s_id,
			s.s_name
		', FALSE);
		$this->db->from('returns rn');
		$this->db->join('employees e', 'rn.rn_returned_by = e.e_id', 'left');
		$this->db->join('suppliers s', 'rn.s_id = s.s_id', 'left');

		// Options
		if($query != '') {
			$filter_query = array();
			$filter_query[] = "rn.rn_return_number = " . $query;
			$filter_query[] = "e.e_fname LIKE '%" . $query . "%'";
			$filter_query[] = "e.e_lname LIKE '%" . $query . "%'";
			$this->db->where('(' . implode(' OR ', $filter_query) . ')');
		}
		if($status != '') {
			$this->db->where_in('rn.rn_status', $status);
		}
		$this->db->order_by('rn.rn_date', 'desc');

		// Get Data
		if($start == '' && $limit == '') {
			$query = $this->db->get();
		} else {
			$this->db->limit($limit, $start);
			$query = $this->db->get();
		}
		return $query->result_array();
	}

	# Get Return By Id
	function get_return_by_id($rn_id) {
		// Select
		$this->db->select('
			rn.*,
			CONCAT(e.e_fname, \' \', e.e_lname) AS returned_name,
			(SELECT SUM(rnd_purchase_price * rnd_qty) FROM return_details WHERE rn_id = rn.rn_id) AS total_cost,
			s.s_id,
			s.s_name
		', FALSE);
		$this->db->from('returns rn');
		$this->db->join('employees e', 'rn.rn_returned_by = e.e_id', 'left');
		$this->db->join('suppliers s', 'rn.s_id = s.s_id', 'left');

		// Options
		$this->db->where('rn.rn_id', $rn_id);

		// Get Data
		$query = $this->db->get();
		return $query->result_array();
	}

	# Get Return Items By Return Id
	function get_return_items_by_return_id($rn_id) {
		// Select
		$this->db->select('rnd.*, i.i_name, i.i_attribute, u.u_id, u.u_name, u.u_slug_name');
		$this->db->from('return_details rnd');
		$this->db->join('items i', 'rnd.i_id = i.i_id', 'left');
		$this->db->join('units u', 'i.u_id = u.u_id', 'left');

		// Options
		$this->db->where('rnd.rn_id', $rn_id);

		// Get Data
		$query = $this->db->get();
		return $query->result_array();
	}

	# Get Purchase Orders
	function get_purchase_orders($query='', $start='', $limit='', $status='', $show_deleted=false) {
		// Select
		$this->db->select('
			po.*,
			CONCAT(e.e_fname, \' \', e.e_lname) AS created_name,
			(SELECT SUM(pod_purchase_price * pod_qty) FROM purchase_order_details WHERE po_id = po.po_id) AS total_cost,
			CASE
				WHEN (SELECT COUNT(*) FROM receivings WHERE po_id = po.po_id) > 0 THEN 1
				ELSE 0
			END AS has_receiving,
			s.s_id,
			s.s_name
		', FALSE);
		$this->db->from('purchase_orders po');
		$this->db->join('employees e', 'po.po_created_by = e.e_id', 'left');
		$this->db->join('suppliers s', 'po.s_id = s.s_id', 'left');

		// Options
		if($query != '') {
			$filter_query = array();
			$filter_query[] = "po.po_purchase_order_number = " . $query;
			$filter_query[] = "e.e_fname LIKE '%" . $query . "%'";
			$filter_query[] = "e.e_lname LIKE '%" . $query . "%'";
			$this->db->where('(' . implode(' OR ', $filter_query) . ')');
		}
		if($status != '') {
			$this->db->where_in('po.po_status', $status);
		}
		if($show_deleted == false) {
			$this->db->where('po.is_deleted', FALSE);
		}
		$this->db->order_by('po.po_date', 'desc');

		// Get Data
		if($start == '' && $limit == '') {
			$query = $this->db->get();
		} else {
			$this->db->limit($limit, $start);
			$query = $this->db->get();
		}
		return $query->result_array();
	}

	# Get Purchase Order By Id
	function get_purchase_order_by_id($po_id) {
		// Select
		$this->db->select('
			po.*,
			CONCAT(e.e_fname, \' \', e.e_lname) AS created_name,
			(SELECT SUM(pod_purchase_price * pod_qty) FROM purchase_order_details WHERE po_id = po.po_id) AS total_cost,
			s.s_id,
			s.s_name
		', FALSE);
		$this->db->from('purchase_orders po');
		$this->db->join('employees e', 'po.po_created_by = e.e_id', 'left');
		$this->db->join('suppliers s', 'po.s_id = s.s_id', 'left');

		// Options
		$this->db->where('po.po_id', $po_id);

		// Get Data
		$query = $this->db->get();
		return $query->result_array();
	}

	# Get Purchase Order Items
	function get_purchase_order_items($po_id, $query='', $start='', $limit='', $show_fully_received=false) {
		// Select
		$this->db->select('pod.*, i.*, c.c_id, c.c_name, u.u_id, u.u_name, u.u_slug_name, s.s_id, s.s_name, (pod.pod_purchase_price * pod.pod_qty) AS cost');
		$this->db->from('purchase_order_details pod');
		$this->db->join('items i', 'pod.i_id = i.i_id', 'left');
		$this->db->join('categories c', 'i.c_id = c.c_id', 'left');
		$this->db->join('units u', 'i.u_id = u.u_id', 'left');
		$this->db->join('suppliers s', 'i.s_id = s.s_id', 'left');
		$this->db->join('purchase_orders po', 'pod.po_id = po.po_id', 'left');

		// Options
		if($query != '') {
			$filter_query = array();
			$filter_query[] = "i.i_name LIKE '%" . $query . "%'";
			$filter_query[] = "i.i_attribute LIKE '%" . $query . "%'";
			$filter_query[] = "c.c_name LIKE '%" . $query . "%'";
			$filter_query[] = "u.u_name LIKE '%" . $query . "%'";
			$filter_query[] = "s.s_name LIKE '%" . $query . "%'";
			$filter_query[] = "po.po_purchase_order_number = " . $query;
			$this->db->where('(' . implode(' OR ', $filter_query) . ')');
		}
		if($show_fully_received == false) {
			$this->db->where('pod.pod_received < pod.pod_qty');
		}
		$this->db->where('pod.po_id', $po_id);
		$this->db->order_by('pod.pod_id', 'asc');

		// Get Data
		if($start == '' && $limit == '') {
			$query = $this->db->get();
		} else {
			$this->db->limit($limit, $start);
			$query = $this->db->get();
		}
		return $query->result_array();
	}

	# Insert Receiving
	function Insert_receiving($data) {
		$this->db->set('r_receiving_number', '(SELECT r_get_receiving_number())', FALSE);
		$this->db->set('r_date', 'NOW()', FALSE);
		$this->db->insert('receivings', $data);
		return $this->db->insert_id();
	}

	# Insert Receiving Details
	function Insert_receiving_details($data) {
		$this->db->insert('receiving_details', $data);
		return;
	}

	# Insert Return
	function Insert_return($data) {
		$this->db->set('rn_return_number', '(SELECT r_get_return_number())', FALSE);
		$this->db->set('rn_date', 'NOW()', FALSE);
		$this->db->insert('returns', $data);
		return $this->db->insert_id();
	}

	# Insert Return Details
	function Insert_return_details($data) {
		$this->db->insert('return_details', $data);
		return;
	}

	# Insert Purchase Order
	function Insert_purchase_order($data) {
		$this->db->set('po_purchase_order_number', '(SELECT r_get_purchase_order_number())', FALSE);
		$this->db->set('po_date', 'NOW()', FALSE);
		$this->db->insert('purchase_orders', $data);
		return $this->db->insert_id();
	}

	# Insert Purchase Order Details
	function Insert_purchase_order_details($data) {
		$this->db->insert('purchase_order_details', $data);
		return;
	}

	# Update Receiving
	function Update_receiving($data, $r_id) {
		$this->db->where('r_id', $r_id);
		$this->db->update('receivings', $data);
		return;
	}

	# Update Return
	function Update_return($data, $rn_id) {
		$this->db->where('rn_id', $rn_id);
		$this->db->update('returns', $data);
		return;
	}

	# Update Purchase Order
	function Update_purchase_order($data, $po_id) {
		$this->db->where('po_id', $po_id);
		$this->db->update('purchase_orders', $data);
		return;
	}

	# Update Purchase Order Received
	function Update_purchase_order_received($po_id) {
		$sql = "
			UPDATE purchase_orders
			SET po_status = (
				SELECT
					CASE
						WHEN (SELECT COUNT(*) FROM purchase_order_details WHERE pod_received < pod_qty AND po_id = $po_id) > 0 THEN 'O'
						ELSE 'C'
					END
			)
			WHERE po_id = $po_id
		";
		$this->db->query($sql);
		return;
	}

	# Update Purchase Order Details Received
	function Update_purchase_order_details_received($pod_id, $qty) {
		$sql = "
			UPDATE purchase_order_details
			SET pod_received = pod_received + $qty
			WHERE pod_id = $pod_id
		";
		$this->db->query($sql);
		return;
	}

	# Delete Purchase Order Details
	function Delete_purchase_order_details($po_id) {
		$this->db->where('po_id', $po_id);
		$this->db->delete('purchase_order_details');
		return;
	}
}