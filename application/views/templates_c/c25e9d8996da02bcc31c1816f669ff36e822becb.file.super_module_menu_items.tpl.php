<?php /* Smarty version Smarty-3.1.13, created on 2013-10-15 08:50:07
         compiled from "application\views\templates\pages\super_module_menu_items.tpl" */ ?>
<?php /*%%SmartyHeaderCode:31633525d01bfedf041-10455719%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'c25e9d8996da02bcc31c1816f669ff36e822becb' => 
    array (
      0 => 'application\\views\\templates\\pages\\super_module_menu_items.tpl',
      1 => 1381826229,
      2 => 'file',
    ),
    'fb6522124597e48deded4844e19e0b1509241492' => 
    array (
      0 => 'application\\views\\templates\\layouts\\default_layout.tpl',
      1 => 1381815043,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '31633525d01bfedf041-10455719',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'layout' => 0,
    'base_url' => 0,
    'controller' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.13',
  'unifunc' => 'content_525d01c011d030_82967059',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_525d01c011d030_82967059')) {function content_525d01c011d030_82967059($_smarty_tpl) {?><!DOCTYPE html> 
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