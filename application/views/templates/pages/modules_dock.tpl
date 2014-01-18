{extends file="layouts/"|cat:$layout}
{block name=body}
	<h2><span class="text-info">{$page}</span> Modules</h2>
	<div class="row-fluid" style="margin-top: 40px;">
		<div class="span12">
			{foreach $module_menu_items as $k => $v}
				{if $k eq 0 || $k mod 3 eq 0}
				<div class="row-fluid" style="margin-bottom: 20px;">
				{/if}
					<div class="span4">
						<i class="icon-chevron-right lead"></i> <a href="{$base_url}{$v['mmg_link']}/{$v['mmi_link']}" class="lead text-info">{$v['mmi_name']}</a><br>
						<em>{$v['mmi_description']}</em>
					</div>
				{if ($k + 1) mod 3 eq 0 || $k eq (count($module_menu_items) - 1)}
				</div>
				{/if}
			{/foreach}
		</div>
	</div>
{/block}