<?php /* Smarty version Smarty-3.1.13, created on 2013-10-29 00:22:41
         compiled from "application\views\templates\segments\navbar.tpl" */ ?>
<?php /*%%SmartyHeaderCode:345552568cc7f166f3-39110011%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '03315c3817dd28f42554c237f8ca9f5d67d03aa5' => 
    array (
      0 => 'application\\views\\templates\\segments\\navbar.tpl',
      1 => 1382976286,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '345552568cc7f166f3-39110011',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.13',
  'unifunc' => 'content_52568cc7f1b049_81135217',
  'variables' => 
  array (
    'base_url' => 0,
    'modules' => 0,
    'v' => 0,
    'current_mmg_link' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_52568cc7f1b049_81135217')) {function content_52568cc7f1b049_81135217($_smarty_tpl) {?><div class="navbar navbar-fixed-top navbar-inverse">
    <div class="navbar-inner">
        <div class="container-fluid">
            <button class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            
			<div class="nav-collapse collapse">
				<a class="brand" href="<?php echo $_smarty_tpl->tpl_vars['base_url']->value;?>
" style="padding: 5px 20px 5px;">
					<img src="<?php echo $_smarty_tpl->tpl_vars['base_url']->value;?>
<?php echo @constant('IMAGES_DIR');?>
builders-hub-nav.png" style="height: 30px;">
				</a>
				<ul class="nav">
                    <?php  $_smarty_tpl->tpl_vars['v'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['v']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['modules']->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['v']->key => $_smarty_tpl->tpl_vars['v']->value){
$_smarty_tpl->tpl_vars['v']->_loop = true;
?>
                    <li class="<?php if ($_smarty_tpl->tpl_vars['v']->value['mmg_link']==$_smarty_tpl->tpl_vars['current_mmg_link']->value){?>active<?php }?>"><a href="<?php echo $_smarty_tpl->tpl_vars['base_url']->value;?>
<?php echo $_smarty_tpl->tpl_vars['v']->value['mmg_link'];?>
"><strong><?php echo $_smarty_tpl->tpl_vars['v']->value['mmg_name'];?>
</strong></a></li>
                    <?php } ?>
				</ul>
                <ul class="nav pull-right">
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="icon-user icon-white"></i> Account <b class="caret"></b></a>
                        <ul class="dropdown-menu">
                            <li><a style="cursor: pointer;" onclick="Change_account_settings()"><i class="icon-cog"></i> Change Account Settings</a></li>
                            <li class="divider"></li>
                            <li><a href="<?php echo $_smarty_tpl->tpl_vars['base_url']->value;?>
logout"><i class="icon-remove"></i> Log Out</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
            <!--/.nav-collapse -->
        </div>
    </div>
</div><?php }} ?>