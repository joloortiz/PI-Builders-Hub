<?php /* Smarty version Smarty-3.1.13, created on 2013-10-28 03:37:41
         compiled from "application/views/templates/pages/login.tpl" */ ?>
<?php /*%%SmartyHeaderCode:840205928526dcdf5b02ee7-63834808%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'ad70b9aa531d438033f8dac87790fc340b33b41b' => 
    array (
      0 => 'application/views/templates/pages/login.tpl',
      1 => 1381806752,
      2 => 'file',
    ),
    'be8854748fda0a2947ed761dab1ebc58fd152a88' => 
    array (
      0 => 'application/views/templates/layouts/plain_layout.tpl',
      1 => 1381802732,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '840205928526dcdf5b02ee7-63834808',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'layout' => 0,
    'base_url' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.13',
  'unifunc' => 'content_526dcdf5b65765_98255831',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_526dcdf5b65765_98255831')) {function content_526dcdf5b65765_98255831($_smarty_tpl) {?><!DOCTYPE html> 
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