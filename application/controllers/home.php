<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Home extends MY_Controller {

	# Index
	function index() {
        // // JS
        // $page_js = array(
        //     'example-data.js',
        //     'pages/home.js'
        // );
        // $this->smarty->assign('page_js', $page_js);

        // Get Data
        $store_information = $this->store_information_model->get_store_information();
        $data['store_information'] = $store_information[0];

        $this->smarty->assign('page', 'Home');
        $this->smarty->assign('controller', 'home');
        $this->smarty->assign('layout', 'home_layout.tpl');
        $this->smarty->view('pages/home.tpl', $data);
	}
}