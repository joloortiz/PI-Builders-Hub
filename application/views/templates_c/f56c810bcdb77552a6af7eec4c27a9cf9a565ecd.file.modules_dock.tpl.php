<?php /* Smarty version Smarty-3.1.13, created on 2013-10-28 17:45:29
         compiled from "application/views/templates/pages/modules_dock.tpl" */ ?>
<?php /*%%SmartyHeaderCode:718393118526dcdffa09082-39286248%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'f56c810bcdb77552a6af7eec4c27a9cf9a565ecd' => 
    array (
      0 => 'application/views/templates/pages/modules_dock.tpl',
      1 => 1382978728,
      2 => 'file',
    ),
    '35eb6a35466dc6efc64554dd500033d30334a634' => 
    array (
      0 => 'application/views/templates/layouts/home_layout.tpl',
      1 => 1382977446,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '718393118526dcdffa09082-39286248',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.13',
  'unifunc' => 'content_526dcdffa92d60_40898809',
  'variables' => 
  array (
    'layout' => 0,
    'base_url' => 0,
    'controller' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_526dcdffa92d60_40898809')) {function content_526dcdffa92d60_40898809($_smarty_tpl) {?><!DOCTYPE html> 
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
					
	<h2><span class="text-info"><?php echo $_smarty_tpl->tpl_vars['page']->value;?>
</span> Modules</h2>
	<div class="row-fluid" style="margin-top: 40px;">
		<div class="span8">
			<?php  $_smarty_tpl->tpl_vars['v'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['v']->_loop = false;
 $_smarty_tpl->tpl_vars['k'] = new Smarty_Variable;
 $_from = $_smarty_tpl->tpl_vars['module_menu_items']->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['v']->key => $_smarty_tpl->tpl_vars['v']->value){
$_smarty_tpl->tpl_vars['v']->_loop = true;
 $_smarty_tpl->tpl_vars['k']->value = $_smarty_tpl->tpl_vars['v']->key;
?>
				<?php if ($_smarty_tpl->tpl_vars['k']->value==0||$_smarty_tpl->tpl_vars['k']->value%3==0){?>
				<div class="row-fluid" style="margin-bottom: 20px;">
				<?php }?>
					<div class="span4">
						<i class="icon-chevron-right lead"></i> <a href="<?php echo $_smarty_tpl->tpl_vars['base_url']->value;?>
<?php echo $_smarty_tpl->tpl_vars['v']->value['mmg_link'];?>
/<?php echo $_smarty_tpl->tpl_vars['v']->value['mmi_link'];?>
" class="lead text-info"><?php echo $_smarty_tpl->tpl_vars['v']->value['mmi_name'];?>
</a>
					</div>
				<?php if (($_smarty_tpl->tpl_vars['k']->value+1)%3==0||$_smarty_tpl->tpl_vars['k']->value==(count($_smarty_tpl->tpl_vars['module_menu_items']->value)-1)){?>
				</div>
				<?php }?>
			<?php } ?>
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