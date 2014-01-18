<?php /* Smarty version Smarty-3.1.13, created on 2013-10-28 17:29:45
         compiled from "application/views/templates/pages/home.tpl" */ ?>
<?php /*%%SmartyHeaderCode:1559402486526dcdfbf3b9e5-40246315%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '0b908f99e69ed1a4fe8b5086e0a6295106f7e2eb' => 
    array (
      0 => 'application/views/templates/pages/home.tpl',
      1 => 1382977046,
      2 => 'file',
    ),
    '35eb6a35466dc6efc64554dd500033d30334a634' => 
    array (
      0 => 'application/views/templates/layouts/home_layout.tpl',
      1 => 1382977446,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '1559402486526dcdfbf3b9e5-40246315',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.13',
  'unifunc' => 'content_526dcdfc06a4b5_45800247',
  'variables' => 
  array (
    'layout' => 0,
    'base_url' => 0,
    'controller' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_526dcdfc06a4b5_45800247')) {function content_526dcdfc06a4b5_45800247($_smarty_tpl) {?><!DOCTYPE html> 
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
					
	<!-- <div class="row-fluid">
		<div id="charts-container1" class="span6"></div>
		<div id="charts-container2" class="span6"></div>
	</div> -->
	<div class="hero-unit" style="text-align: center;">
		<!-- <div style="background-size: 236px 181px; background: url(<?php echo $_smarty_tpl->tpl_vars['base_url']->value;?>
<?php echo @constant('IMAGES_DIR');?>
builders-hub.png) center 0 no-repeat; height: 181px;margin: 0 auto 26px; overflow: hidden; text-indent: -9999em; width: 236px;"></div> -->
		<img src="<?php echo $_smarty_tpl->tpl_vars['base_url']->value;?>
<?php echo @constant('IMAGES_DIR');?>
builders-hub.png" style="height: 200px;">
		<h1 class="text-info">Welcome to <?php echo $_smarty_tpl->tpl_vars['store_information']->value['si_name'];?>
</h1>
		<h2 class="text-info">POS & Inventory System</h2>
	</div>

				</div>
			</div>
		</div>
		<!-- <?php echo $_smarty_tpl->getSubTemplate ("segments/footer.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>
 -->
        <?php echo $_smarty_tpl->getSubTemplate ("segments/scripts.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

	</body>
</html><?php }} ?>