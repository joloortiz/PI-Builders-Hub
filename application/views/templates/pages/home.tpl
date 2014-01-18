{extends file="layouts/"|cat:$layout}
{block name=body}
	<div class="hero-unit" style="text-align: center;">
		<img src="{$base_url}{$smarty.const.IMAGES_DIR}builders-hub.png" style="height: 200px;">
		<h1 class="text-info">Welcome to {$store_information['si_name']}</h1>
		<h2 class="text-info">POS & Inventory System</h2>
	</div>
	<div class="row-fluid">
		<div id="charts-container1" class="span6"></div>
		<div id="charts-container2" class="span6"></div>
	</div>
{/block}