<!DOCTYPE html> 
<html lang="en">
    {include file="segments/head.tpl"}
	<body>
		<!-- CONSTANTS -->
		<input type="hidden" id="base_url" value="{$base_url}">
		<input type="hidden" id="controller" value="{$controller}">

		{include file="segments/navbar.tpl"}
		<div id="main-container" class="container-fluid">
			<div class="row-fluid">
				<div class="span12">
					{block name=body}{/block}
				</div>
			</div>
		</div>
		<!-- {include file="segments/footer.tpl"} -->
        {include file="segments/scripts.tpl"}
	</body>
</html>