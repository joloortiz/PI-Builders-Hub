<div id="scripts">
    <!-- <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script> -->
    <!-- <script src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/js/bootstrap.min.js"></script> -->

	<!-- Scripts -->
	{foreach from=$default_js item=v}
		<script type="text/javascript" src="{$base_url}{$smarty.const.SCRIPTS_DIR}{$v}"></script>
	{/foreach}
    
    {if isset($page_js)}
        {foreach from=$page_js item=v}
            <script type="text/javascript" src="{$base_url}{$smarty.const.SCRIPTS_DIR}{$v}"></script>
        {/foreach}
    {/if}
<div>