<?php /* Smarty version Smarty-3.1.13, created on 2013-11-06 08:34:45
         compiled from "application\views\templates\pages\home.tpl" */ ?>
<?php /*%%SmartyHeaderCode:151675195e0c92c6555-86040795%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'bfb7c1a581dda49eeab3ee4570d0f9db01489da4' => 
    array (
      0 => 'application\\views\\templates\\pages\\home.tpl',
      1 => 1383726871,
      2 => 'file',
    ),
    '6051eab57f1ed72dc7865d52ca638ca04f281d56' => 
    array (
      0 => 'application\\views\\templates\\layouts\\home_layout.tpl',
      1 => 1382977446,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '151675195e0c92c6555-86040795',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.13',
  'unifunc' => 'content_5195e0c93a89f8_66972772',
  'variables' => 
  array (
    'layout' => 0,
    'base_url' => 0,
    'controller' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_5195e0c93a89f8_66972772')) {function content_5195e0c93a89f8_66972772($_smarty_tpl) {?><!DOCTYPE html> 
<html lang="en">
    <?php echo $_smarty_tpl->getSubTemplate ("segments/head.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

	<body>
		<!-- CONSTANTS -->
		<input type="hidden" id="base_url" value="<?php echo $_smarty_tpl->tpl_vars['base_url']->value;?>
">
		<input type="hidden" id="controller" value="<?php echo $_smarty_tpl->tpl_vars['controller']->value;?>
">

		<?php echo $_smarty_tpl->getSubTemplate ("segments/navbar.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

		<div id="main-container" class="container-fluid">
			<div class="row-fluid">
				<div class="span12">
					
	<div class="hero-unit" style="text-align: center;">
		<img src="<?php echo $_smarty_tpl->tpl_vars['base_url']->value;?>
<?php echo @constant('IMAGES_DIR');?>
builders-hub.png" style="height: 200px;">
		<h1 class="text-info">Welcome to <?php echo $_smarty_tpl->tpl_vars['store_information']->value['si_name'];?>
</h1>
		<h2 class="text-info">POS & Inventory System</h2>
	</div>
	<div class="row-fluid">
		<div id="charts-container1" class="span6"></div>
		<div id="charts-container2" class="span6"></div>
	</div>

				</div>
			</div>
		</div>
		<!-- <?php echo $_smarty_tpl->getSubTemplate ("segments/footer.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>
 -->
        <?php echo $_smarty_tpl->getSubTemplate ("segments/scripts.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

	</body>
</html><?php }} ?>