<head>
	<meta charset="utf-8">
	<title>POS | {$page}</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<link rel="stylesheet" type="text/css" href="{$base_url}{$smarty.const.SCRIPTS_DIR}extjs/resources/css/ext-all-neptune.css">
    <script type="text/javascript" src="{$base_url}{$smarty.const.SCRIPTS_DIR}extjs/ext-all.js"></script>

	<!-- Style Sheets -->
	{foreach from=$default_css item=v}
		<link type="text/css" rel="stylesheet" href="{$base_url}{$smarty.const.STYLESHEETS_DIR}{$v}">
	{/foreach}
    
    {if isset($page_css)}
        {foreach from=$page_css item=v}
            <link type="text/css" rel="stylesheet" href="{$base_url}{$smarty.const.STYLESHEETS_DIR}{$v}">
        {/foreach}
    {/if}
</head>