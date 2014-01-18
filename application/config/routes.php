<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/*
| -------------------------------------------------------------------------
| URI ROUTING
| -------------------------------------------------------------------------
| This file lets you re-map URI requests to specific controller functions.
|
| Typically there is a one-to-one relationship between a URL string
| and its corresponding controller class/method. The segments in a
| URL normally follow this pattern:
|
|	example.com/class/method/id/
|
| In some instances, however, you may want to remap this relationship
| so that a different class/function is called than the one
| corresponding to the URL.
|
| Please see the user guide for complete details:
|
|	http://codeigniter.com/user_guide/general/routing.html
|
| -------------------------------------------------------------------------
| RESERVED ROUTES
| -------------------------------------------------------------------------
|
| There area two reserved routes:
|
|	$route['default_controller'] = 'welcome';
|
| This route indicates which controller class should be loaded if the
| URI contains no data. In the above example, the "welcome" class
| would be loaded.
|
|	$route['404_override'] = 'errors/page_missing';
|
| This route will tell the Router what URI segments to use if those provided
| in the URL cannot be matched to a valid route.
|
*/

$route['default_controller'] = 'home';
$route['404_override'] = '';

// Logout
$route['logout'] = 'login/logout';
$route['get_employee_information'] = 'login/get_employee_information';
$route['change_account_settings'] = 'login/change_account_settings';

// Dynamic Module Navigation
require_once( BASEPATH .'database/DB'. EXT );
$db =& DB();

// Module Menu Groups
$query = $db->query('SELECT * FROM module_menu_groups WHERE is_deleted = FALSE');
$result = $query->result_array();
foreach($result as $v) {
	$route[$v['mmg_link']] = 'modules_dock';
}

// Module Menu Items
$sql = '
	SELECT
		mmi.*, mmg.*
	FROM
		module_menu_items mmi
	LEFT JOIN
		module_menu_groups mmg ON mmi.mmg_id = mmg.mmg_id
	WHERE
		mmi.is_deleted = FALSE
		AND mmg.is_deleted = FALSE
	ORDER BY
		mmg.mmg_order,
		mmi.mmi_order
';
$query = $db->query($sql);
$result = $query->result_array();
foreach($result as $v) {
	$route[$v['mmg_link'] . '/' . $v['mmi_link']] = $v['mmg_link'] . '_' . str_replace('-', '_', $v['mmi_link']);
}


/* End of file routes.php */
/* Location: ./application/config/routes.php */