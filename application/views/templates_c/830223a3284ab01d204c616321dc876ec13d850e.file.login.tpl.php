<?php /* Smarty version Smarty-3.1.13, created on 2013-10-15 03:12:42
         compiled from "application\views\templates\pages\login.tpl" */ ?>
<?php /*%%SmartyHeaderCode:4833525ca3aba1eee0-08399622%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '830223a3284ab01d204c616321dc876ec13d850e' => 
    array (
      0 => 'application\\views\\templates\\pages\\login.tpl',
      1 => 1381806753,
      2 => 'file',
    ),
    '03165d5a3348cfc07fa5b39e20575fc5b1e89f47' => 
    array (
      0 => 'application\\views\\templates\\layouts\\plain_layout.tpl',
      1 => 1381802732,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '4833525ca3aba1eee0-08399622',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.13',
  'unifunc' => 'content_525ca3abbd1734_06587131',
  'variables' => 
  array (
    'layout' => 0,
    'base_url' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_525ca3abbd1734_06587131')) {function content_525ca3abbd1734_06587131($_smarty_tpl) {?><!DOCTYPE html> 
<html lang="en">
    <?php echo $_smarty_tpl->getSubTemplate ("segments/head.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

	<body base-url="<?php echo $_smarty_tpl->tpl_vars['base_url']->value;?>
">
		
	<!-- CONSTANTS -->
	<input type="hidden" id="base_url" value="<?php echo $_smarty_tpl->tpl_vars['base_url']->value;?>
">
	<input type="hidden" id="controller" value="<?php echo $_smarty_tpl->tpl_vars['controller']->value;?>
">

        <?php echo $_smarty_tpl->getSubTemplate ("segments/scripts.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

	</body>
</html><?php }} ?>