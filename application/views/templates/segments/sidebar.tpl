<div id="sidebar-container" class="row-fluid">
	<ul class="nav nav-tabs nav-stacked">
		{foreach $module_group_menu_items as $v}
		<li class="{if $v['mmi_link'] eq $current_mmi_link}active{/if}"><a href="{$base_url}{$current_mmg_link}/{$v['mmi_link']}"><strong>{$v['mmi_name']}</strong></a></li>
		{/foreach}
	</ul>
</div>