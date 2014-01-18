<?php /* Smarty version Smarty-3.1.13, created on 2013-10-15 08:21:07
         compiled from "application\views\templates\segments\sidebar.tpl" */ ?>
<?php /*%%SmartyHeaderCode:162225257b922cc9225-53865938%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '9d3d37cf1932de3965985f1266fea8eacf1781fa' => 
    array (
      0 => 'application\\views\\templates\\segments\\sidebar.tpl',
      1 => 1381825266,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '162225257b922cc9225-53865938',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.13',
  'unifunc' => 'content_5257b922ccdc72_77110065',
  'variables' => 
  array (
    'module_group_menu_items' => 0,
    'v' => 0,
    'current_mmi_link' => 0,
    'base_url' => 0,
    'current_mmg_link' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_5257b922ccdc72_77110065')) {function content_5257b922ccdc72_77110065($_smarty_tpl) {?><div id="sidebar-container" class="row-fluid">
	<ul class="nav nav-tabs nav-stacked">
		<?php  $_smarty_tpl->tpl_vars['v'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['v']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['module_group_menu_items']->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['v']->key => $_smarty_tpl->tpl_vars['v']->value){
$_smarty_tpl->tpl_vars['v']->_loop = true;
?>
		<li class="<?php if ($_smarty_tpl->tpl_vars['v']->value['mmi_link']==$_smarty_tpl->tpl_vars['current_mmi_link']->value){?>active<?php }?>"><a href="<?php echo $_smarty_tpl->tpl_vars['base_url']->value;?>
<?php echo $_smarty_tpl->tpl_vars['current_mmg_link']->value;?>
/<?php echo $_smarty_tpl->tpl_vars['v']->value['mmi_link'];?>
"><strong><?php echo $_smarty_tpl->tpl_vars['v']->value['mmi_name'];?>
</strong></a></li>
		<?php } ?>
	</ul>
</div><?php }} ?>