<?php /* Smarty version Smarty-3.1.13, created on 2013-10-28 03:37:41
         compiled from "application/views/templates/segments/scripts.tpl" */ ?>
<?php /*%%SmartyHeaderCode:2132390815526dcdf5ba81a0-62736809%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'b319b2b81ca34ff6e1963df9bbe58b61a8f767f2' => 
    array (
      0 => 'application/views/templates/segments/scripts.tpl',
      1 => 1381305638,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '2132390815526dcdf5ba81a0-62736809',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'default_js' => 0,
    'base_url' => 0,
    'v' => 0,
    'page_js' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.13',
  'unifunc' => 'content_526dcdf5bcd297_73229289',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_526dcdf5bcd297_73229289')) {function content_526dcdf5bcd297_73229289($_smarty_tpl) {?><div id="scripts">
    <!-- <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script> -->
    <!-- <script src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/js/bootstrap.min.js"></script> -->

	<!-- Scripts -->
	<?php  $_smarty_tpl->tpl_vars['v'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['v']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['default_js']->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['v']->key => $_smarty_tpl->tpl_vars['v']->value){
$_smarty_tpl->tpl_vars['v']->_loop = true;
?>
		<script type="text/javascript" src="<?php echo $_smarty_tpl->tpl_vars['base_url']->value;?>
<?php echo @constant('SCRIPTS_DIR');?>
<?php echo $_smarty_tpl->tpl_vars['v']->value;?>
"></script>
	<?php } ?>
    
    <?php if (isset($_smarty_tpl->tpl_vars['page_js']->value)){?>
        <?php  $_smarty_tpl->tpl_vars['v'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['v']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['page_js']->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['v']->key => $_smarty_tpl->tpl_vars['v']->value){
$_smarty_tpl->tpl_vars['v']->_loop = true;
?>
            <script type="text/javascript" src="<?php echo $_smarty_tpl->tpl_vars['base_url']->value;?>
<?php echo @constant('SCRIPTS_DIR');?>
<?php echo $_smarty_tpl->tpl_vars['v']->value;?>
"></script>
        <?php } ?>
    <?php }?>
<div><?php }} ?>