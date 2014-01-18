<?php /* Smarty version Smarty-3.1.13, created on 2013-10-28 17:44:35
         compiled from "application/views/templates/pages/grid_container.tpl" */ ?>
<?php /*%%SmartyHeaderCode:1931361208526dce02a049d1-30142911%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '4da351065c3d723c8316e80bebe6ed4cbeb8c3e4' => 
    array (
      0 => 'application/views/templates/pages/grid_container.tpl',
      1 => 1382523550,
      2 => 'file',
    ),
    '3635f89073ca43229d9a857e4198a4b1a5396548' => 
    array (
      0 => 'application/views/templates/layouts/default_layout.tpl',
      1 => 1382977438,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '1931361208526dce02a049d1-30142911',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.13',
  'unifunc' => 'content_526dce02a69a01_41952358',
  'variables' => 
  array (
    'layout' => 0,
    'base_url' => 0,
    'controller' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_526dce02a69a01_41952358')) {function content_526dce02a69a01_41952358($_smarty_tpl) {?><!DOCTYPE html> 
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