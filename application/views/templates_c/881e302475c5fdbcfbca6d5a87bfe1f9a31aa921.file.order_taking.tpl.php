<?php /* Smarty version Smarty-3.1.13, created on 2013-10-21 05:52:00
         compiled from "application\views\templates\pages\order_taking.tpl" */ ?>
<?php /*%%SmartyHeaderCode:2514525fc8b0068ea7-51359371%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '881e302475c5fdbcfbca6d5a87bfe1f9a31aa921' => 
    array (
      0 => 'application\\views\\templates\\pages\\order_taking.tpl',
      1 => 1382005928,
      2 => 'file',
    ),
    '6051eab57f1ed72dc7865d52ca638ca04f281d56' => 
    array (
      0 => 'application\\views\\templates\\layouts\\home_layout.tpl',
      1 => 1382334697,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '2514525fc8b0068ea7-51359371',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.13',
  'unifunc' => 'content_525fc8b01da057_05728357',
  'variables' => 
  array (
    'layout' => 0,
    'base_url' => 0,
    'controller' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_525fc8b01da057_05728357')) {function content_525fc8b01da057_05728357($_smarty_tpl) {?><!DOCTYPE html> 
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
					
	<div class="row-fluid">
		<div id="grid-container"></div>
	</div>

				</div>
			</div>
		</div>
		<!-- <?php echo $_smarty_tpl->getSubTemplate ("segments/footer.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>
 -->
        <?php echo $_smarty_tpl->getSubTemplate ("segments/scripts.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

	</body>
</html><?php }} ?>