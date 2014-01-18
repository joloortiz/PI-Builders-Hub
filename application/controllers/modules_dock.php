<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Modules_dock extends MY_Controller {

	# Index
	function index() {
		$session = $this->session->userdata('pos');

		// Set Module Group link
		$mmg_link = $this->uri->segment(1);

		// Get Module Menu Group
		$module_menu_group = $this->module_menu_model->get_module_menu_group_id_link('', $mmg_link);
		$module_menu_group = $module_menu_group[0];

		// Get Module Menu Items
		$module_menu_items = $this->module_menu_model->get_modules_user_group_id($session['mug_id'], $mmg_link);
		foreach($module_menu_items as $k => $v) {
			$module_menu_items[$k]['mmi_name'] = stripslashes($module_menu_items[$k]['mmi_name']);
			$module_menu_items[$k]['mmi_description'] = stripcslashes($module_menu_items[$k]['mmi_description']);
		}
		$this->smarty->assign('module_menu_items', $module_menu_items);

		$this->smarty->assign('page', $module_menu_group['mmg_name']);
        $this->smarty->assign('controller', 'modules_dock');
		$this->smarty->assign('layout', 'home_layout.tpl');
		$this->smarty->view('pages/modules_dock.tpl');
	}
}