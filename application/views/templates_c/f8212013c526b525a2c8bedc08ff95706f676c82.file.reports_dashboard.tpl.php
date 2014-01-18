<?php /* Smarty version Smarty-3.1.13, created on 2013-11-05 02:51:45
         compiled from "application\views\templates\pages\reports_dashboard.tpl" */ ?>
<?php /*%%SmartyHeaderCode:377352784d90c10a93-94640392%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'f8212013c526b525a2c8bedc08ff95706f676c82' => 
    array (
      0 => 'application\\views\\templates\\pages\\reports_dashboard.tpl',
      1 => 1383619703,
      2 => 'file',
    ),
    'fb6522124597e48deded4844e19e0b1509241492' => 
    array (
      0 => 'application\\views\\templates\\layouts\\default_layout.tpl',
      1 => 1382977438,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '377352784d90c10a93-94640392',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.13',
  'unifunc' => 'content_52784d90e946e8_15582529',
  'variables' => 
  array (
    'layout' => 0,
    'base_url' => 0,
    'controller' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_52784d90e946e8_15582529')) {function content_52784d90e946e8_15582529($_smarty_tpl) {?><!DOCTYPE html> 
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
				<div class="span3">
					<?php echo $_smarty_tpl->getSubTemplate ("segments/sidebar.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

				</div>
				<div class="span9">
					
	<div class="row-fluid">
		<div class="span4">
			<div id="sales-container"></div>
		</div>
		<div class="span8">
			<div id="item-reordering-container"></div>
		</div>
	</div>

				</div>
			</div>
		</div>
		<!-- <?php echo $_smarty_tpl->getSubTemplate ("segments/footer.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>
 -->
        <?php echo $_smarty_tpl->getSubTemplate ("segments/scripts.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

	</body>
</html><?php }} ?>