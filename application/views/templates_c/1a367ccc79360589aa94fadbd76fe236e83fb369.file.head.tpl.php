<?php /* Smarty version Smarty-3.1.13, created on 2013-10-28 03:37:41
         compiled from "application/views/templates/segments/head.tpl" */ ?>
<?php /*%%SmartyHeaderCode:837121320526dcdf5b69236-09566145%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '1a367ccc79360589aa94fadbd76fe236e83fb369' => 
    array (
      0 => 'application/views/templates/segments/head.tpl',
      1 => 1381824792,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '837121320526dcdf5b69236-09566145',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'page' => 0,
    'base_url' => 0,
    'default_css' => 0,
    'v' => 0,
    'page_css' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.13',
  'unifunc' => 'content_526dcdf5ba4ed8_38055756',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_526dcdf5ba4ed8_38055756')) {function content_526dcdf5ba4ed8_38055756($_smarty_tpl) {?><head>
	<meta charset="utf-8">
	<title>POS | <?php echo $_smarty_tpl->tpl_vars['page']->value;?>
</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<link rel="stylesheet" type="text/css" href="<?php echo $_smarty_tpl->tpl_vars['base_url']->value;?>
<?php echo @constant('SCRIPTS_DIR');?>
extjs/resources/css/ext-all-neptune.css">
    <script type="text/javascript" src="<?php echo $_smarty_tpl->tpl_vars['base_url']->value;?>
<?php echo @constant('SCRIPTS_DIR');?>
extjs/ext-all.js"></script>

	<!-- Style Sheets -->
	<?php  $_smarty_tpl->tpl_vars['v'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['v']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['default_css']->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['v']->key => $_smarty_tpl->tpl_vars['v']->value){
$_smarty_tpl->tpl_vars['v']->_loop = true;
?>
		<link type="text/css" rel="stylesheet" href="<?php echo $_smarty_tpl->tpl_vars['base_url']->value;?>
<?php echo @constant('STYLESHEETS_DIR');?>
<?php echo $_smarty_tpl->tpl_vars['v']->value;?>
">
	<?php } ?>
    
    <?php if (isset($_smarty_tpl->tpl_vars['page_css']->value)){?>
        <?php  $_smarty_tpl->tpl_vars['v'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['v']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['page_css']->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['v']->key => $_smarty_tpl->tpl_vars['v']->value){
$_smarty_tpl->tpl_vars['v']->_loop = true;
?>
            <link type="text/css" rel="stylesheet" href="<?php echo $_smarty_tpl->tpl_vars['base_url']->value;?>
<?php echo @constant('STYLESHEETS_DIR');?>
<?php echo $_smarty_tpl->tpl_vars['v']->value;?>
">
        <?php } ?>
    <?php }?>
</head><?php }} ?>