<div class="navbar navbar-fixed-top navbar-inverse">
    <div class="navbar-inner">
        <div class="container-fluid">
            <button class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            
			<div class="nav-collapse collapse">
				<a class="brand" href="{$base_url}" style="padding: 5px 20px 5px;">
					<img src="{$base_url}{$smarty.const.IMAGES_DIR}builders-hub-nav.png" style="height: 30px;">
				</a>
				<ul class="nav">
                    {foreach $modules as $v}
                    <li class="{if $v['mmg_link'] eq $current_mmg_link}active{/if}"><a href="{$base_url}{$v['mmg_link']}"><strong>{$v['mmg_name']}</strong></a></li>
                    {/foreach}
				</ul>
                <ul class="nav pull-right">
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="icon-user icon-white"></i> Account <b class="caret"></b></a>
                        <ul class="dropdown-menu">
                            <li><a style="cursor: pointer;" onclick="Change_account_settings()"><i class="icon-cog"></i> Change Account Settings</a></li>
                            <li class="divider"></li>
                            <li><a href="{$base_url}logout"><i class="icon-remove"></i> Log Out</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
            <!--/.nav-collapse -->
        </div>
    </div>
</div>