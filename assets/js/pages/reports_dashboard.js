Ext.onReady(function() {
	/*
	 * INITIALIZE
	 */

	// Set Store
	var items_reordering_store = new Ext.data.Store({
	    fields: ['i_id', 'i_name', 'i_attribute', 'i_selling_price', 'i_purchase_price', 'i_vat', 'i_reorder_level', 'c_id', 'c_name', 'u_id', 'u_name', 'u_slug_name', 's_id', 's_name', 'qty_on_hand'],
	    pageSize: global_page_size,
	    autoLoad: true,
	    proxy: {
	        type: 'ajax',
	        url: global_controller_url + 'get_items_reordering',
	        reader: {
	            type: 'json',
	            root: 'data',
	            totalProperty: 'total'
	        }
	    },
	    listeners: {
	    	beforeload: function(store) {
		    	store.getProxy().extraParams.query = Ext.getCmp('search-text').getValue().trim();
		    }
	    }
	});

	// Set Top Bar
	var top_bar = [
		{
			xtype: 'button',
			text: 'Refresh',
			iconCls: 'extjs-icon-restore',
			iconAlign: 'left',
			handler: function() {
				items_reordering_store.reload();
			}
		},
		{
			xtype: 'button',
			text: 'Export',
			iconCls: 'extjs-icon-export-excel',
			iconAlign: 'left',
			handler: function() {
				Export_items_reordering();
			}
		},
		'->',
		{
			xtype: 'textfield',
			id: 'search-text',
			emptyText: 'Enter search key',
			enableKeyEvents: true,
			listeners: {
				specialkey: function (textfield, event) {
					// If Enter key is pressed
					if(event.keyCode == 13) {
						items_reordering_store.reload();
					}
				}
			}
		},
		{
			xtype: 'button',
			text: 'Search',
			iconCls: 'extjs-icon-search',
			iconAlign: 'left',
			listeners: {
				click: function () {
					items_reordering_store.reload();
				}
			}
		}
	];

	// Set Grid
	var item_reordering_grid = new Ext.grid.Panel({
	    renderTo: 'item-reordering-container',
	    store: items_reordering_store,
	    title: '<span class="lead">Items for Reordering</span>',
	    width: '100%',
	    height: 400,
	    columnLines: true,
	    iconCls: 'extjs-icon-items',
	    tbar: top_bar,
	    dockedItems: [
		    {
		        xtype: 'pagingtoolbar',
		        store: items_reordering_store,
		        dock: 'bottom',
		        displayInfo: true
		    }
	    ],
	    columns: [
	        {
	            text: 'Item Name',
	            width: 300,
	            dataIndex: 'i_name',
	            tdCls: 'extjs-bold-text',
	            renderer: renderer_to_upper,
	            locked: true
	        },
	        {
	            text: 'Reorder Level',
	            width: 100,
	            dataIndex: 'i_reorder_level',
	            tdCls: 'extjs-bold-text',
	            align: 'center',
	            renderer: renderer_number,
	            locked: true
	        },
	        {
	            text: 'Qty on Hand',
	            width: 100,
	            dataIndex: 'qty_on_hand',
	            tdCls: 'extjs-bold-text',
	            align: 'center',
	            renderer: renderer_qty_on_hand,
	            locked: true
	        },
	        {
	            text: 'Attribute',
	            width: 150,
	            dataIndex: 'i_attribute'
	        },
	        {
	            text: 'Selling Price',
	            width: 120,
	            dataIndex: 'i_selling_price',
	            align: 'right',
	            tdCls: 'extjs-bold-text text-success',
	            renderer: renderer_currency
	        },
	        {
	            text: 'Purchase Price',
	            width: 120,
	            dataIndex: 'i_purchase_price',
	            align: 'right',
	            renderer: renderer_currency
	        },
	        {
	            text: 'VAT',
	            width: 75,
	            dataIndex: 'i_vat',
	            align: 'center',
	            renderer: renderer_yes_no_negative
	        },
	        {
	            text: 'Category',
	            width: 150,
	            dataIndex: 'c_name'
	        },
	        {
	            text: 'Unit',
	            width: 100,
	            dataIndex: 'u_name'
	        },
	        {
	            text: 'Supplier',
	            width: 150,
	            dataIndex: 's_name'
	        }
	    ]
	});

	// Set Panels
	var sales_panel = new Ext.panel.Panel({
		renderTo: 'sales-container',
		title: '<span class="lead">Sales</span>',
		width: '100%',
		height: 250,
		iconCls: 'extjs-icon-money',
		bodyPadding: 10,
		defaults: {
			labelWidth: 150,
		    labelCls: 'lead-small',
			fieldCls: 'lead-small extjs-bold-text extjs-align-right',
		},
		items: [
			{
				xtype: 'displayfield',
				fieldLabel: 'Today',
				id: 'sales_today'
			},
			{
				xtype: 'displayfield',
				fieldLabel: 'Week to Date',
				id: 'sales_week_to_date'
			},
			{
				xtype: 'displayfield',
				fieldLabel: 'Month to Date',
				id: 'sales_month_to_date'
			},
			{
				xtype: 'displayfield',
				fieldLabel: 'Year to Date',
				id: 'sales_year_to_date'
			}
		],
		buttons: [
			{
				text: 'Refresh',
				iconCls: 'extjs-icon-restore',
				iconAlign: 'left',
				handler: function() {
					Update_sales();
				}
			}
		]
	});

	Update_sales();


	/*
	 * FUNCTIONS
	 */

	// Update Sales
	function Update_sales() {
		sales_panel.setLoading(true);

		Ext.getCmp('sales_today').setValue('');
		Ext.getCmp('sales_week_to_date').setValue('');
		Ext.getCmp('sales_month_to_date').setValue('');
		Ext.getCmp('sales_year_to_date').setValue('');

		Ext.Ajax.request({
			url: global_controller_url + 'get_sales',
            method: 'POST',
            success: function (response) {
            	var decode = Ext.JSON.decode(response.responseText);

            	if(decode.success == false) {
                	Ext.Msg.show({
                		title: 'Failed',
                		msg: decode.msg,
                		buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR,
                        closable: false
                	});
                } else {
                	Ext.getCmp('sales_today').setValue(renderer_currency_no_sign(decode.sales_today));
                	Ext.getCmp('sales_week_to_date').setValue(renderer_currency_no_sign(decode.sales_week_to_date));
                	Ext.getCmp('sales_month_to_date').setValue(renderer_currency_no_sign(decode.sales_month_to_date));
                	Ext.getCmp('sales_year_to_date').setValue(renderer_currency_no_sign(decode.sales_year_to_date));

                	sales_panel.setLoading(false);
                }
            }
		});
	}

	// Export Items for Reordering
	function Export_items_reordering() {
		Ext.Msg.wait('Exporting...', 'Please wait');
		Ext.Ajax.request({
			url: global_controller_url + 'export_items_reordering',
            method: 'POST',
            success: function (response) {
            	var decode = Ext.JSON.decode(response.responseText);

            	if(decode.success == false) {
                	Ext.Msg.show({
                		title: 'Failed',
                		msg: decode.msg,
                		buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR,
                        closable: false
                	});
                } else {
                	Ext.Msg.wait('Downloading File...', 'Please wait');
                	window.location = global_controller_url + 'download_export_items_reordering?filename=' + decode.filename;
                	Ext.Msg.close();
                }
            }
		});
	}
});
