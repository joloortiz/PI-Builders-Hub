<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class MY_Controller extends CI_Controller {

   /**
    * Index Page for this controller.
    *
    * Maps to the following URL
    * 		http://example.com/index.php/welcome
    *	- or -  
    * 		http://example.com/index.php/welcome/index
    *	- or -
    * Since this controller is set as the default controller in 
    * config/routes.php, it's displayed at http://example.com/
    *
    * So any other public methods not prefixed with an underscore will
    * map to /index.php/welcome/<method_name>
    * @see http://codeigniter.com/user_guide/general/urls.html
    */
   
    public function __construct() {
		parent::__construct();

        if(!$this->input->is_ajax_request()) {
            // Validate Session
            $this->validate_session();

            // Validate if User has access to the current module
            $this->validate_access();
            
            // Set Modules
            $this->set_modules();

            // CSS
            $css = array(
                'bootstrap.min.css',
                'extjs-icons.css',
                'styles.css'
            );
          
            // JS
            $js = array(
                'jquery-1.9.1.min.js',
                'bootstrap.min.js',
                'script.js'
            );
            
            $this->smarty->assign('base_url', base_url());
            $this->smarty->assign('current_url', current_url());
            $this->smarty->assign('current_mmg_link', $this->get_current_mmg_link());
            $this->smarty->assign('current_mmi_link', $this->get_current_mmi_link());
            $this->smarty->assign('default_css', $css);
            $this->smarty->assign('default_js', $js);
        }
    }

    // Validate Session
    function validate_session() {
        $session = $this->session->userdata('pos');
        $uri_segement = $this->uri->segment(1);
        
        // Check If Logged In
        if($uri_segement == 'login') {
            if($session) {
                redirect(base_url() . 'home');
            }
        } else {
            if(!$session) redirect(base_url() . 'login');
        }
    }

    // Validate Access
    function validate_access() {
        $session = $this->session->userdata('pos');
        $uri_segement1 = $this->uri->segment(1);
        $uri_segement2 = $this->uri->segment(2);
        $filename = $this->input->get('filename');

        if($filename == '') {
            $module_list = array();
            $modules = $this->module_menu_model->get_modules_user_group_id($session['mug_id'], $uri_segement1, $uri_segement2);
            foreach($modules as $v) {
                $module_list[] = $v['mmi_link'];
            }
            if($uri_segement2 != '') {
                if(!in_array($uri_segement2, $module_list)) {
                    redirect(base_url() . 'home');
                }
            } else {
                $exempted_list = array(
                    '',
                    'home',
                    'login',
                    'logout',
                    'change_password'
                );
                if(!in_array($uri_segement1, $exempted_list)) {
                    if(count($module_list) == 0) {
                        redirect(base_url() . 'home');
                    }
                }
            }
        }
    }

    // Set Modules
    function set_modules() {
        $session = $this->session->userdata('pos');
        $user_group_id = $session['mug_id'];

        $modules = array();
        $modules_list = $this->module_menu_model->get_modules_user_group_id($user_group_id);
        $module_menu_group_id = '';
        $module_menu_group_index = -1;
        foreach($modules_list as $v) {
            // Set Index of Module Menu Group
            if($module_menu_group_id != $v['mmg_id']) {
                $module_menu_group_index++;
                $module_menu_group_id = $v['mmg_id'];

                $modules[$module_menu_group_index]['mmg_id'] = $v['mmg_id'];
                $modules[$module_menu_group_index]['mmg_name'] = $v['mmg_name'];
                $modules[$module_menu_group_index]['mmg_link'] = $v['mmg_link'];
            }

            // Set Module Menu Item details
            $module_menu_item_details = array();
            $module_menu_item_details['mmi_id'] = $v['mmi_id'];
            $module_menu_item_details['mmi_name'] = $v['mmi_name'];
            $module_menu_item_details['mmi_link'] = $v['mmi_link'];

            // Insert Module Menu Item to current Module Menu Group
            $modules[$module_menu_group_index]['module_menu_items'][] = $module_menu_item_details;
        }

        // Set Modules
        $this->smarty->assign('modules', $modules);

        // Set Modules of Group
        $module_group_menu_items = array();
        $module_group_link = $this->uri->segment(1);
        foreach($modules as $v) {
            if($v['mmg_link'] == $module_group_link) {
                $module_group_menu_items = $v['module_menu_items'];
                break;
            }
        }
        $this->smarty->assign('module_group_menu_items', $module_group_menu_items);
    }

    // Get Current Module Menu Group Link
    function get_current_mmg_link() {
        return $this->uri->segment(1);
    }

    // Get Current Module Menu Item Link
    function get_current_mmi_link() {
        return $this->uri->segment(2);
    }
}