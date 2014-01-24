Ext.onReady(function() {
	/*
	 * INITIALIZE
	 */

	// Set Store
	var store = new Ext.data.Store({
	    fields: ['i_id', 'i_name', 'i_attribute', 'i_selling_price', 'i_purchase_price', 'i_vat', 'i_reorder_level', 'c_id', 'c_name', 'u_id', 'u_name', 'u_slug_name', 's_id', 's_name', 'qty_on_hand'],
	    pageSize: global_page_size,
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
		    	store.getProxy().extraParams.c_id = Ext.getCmp('frm_sel_category').getValue();
		    	store.getProxy().extraParams.s_id = Ext.getCmp('frm_sel_supplier').getValue();
		    }
	    }
	});

	var category_store = new Ext.data.Store({
		fields: ['c_id', 'c_name'],
		autoLoad: true,
		proxy: {
	        type: 'ajax',
	        url: global_controller_url + 'get_categories',
	        reader: {
	            type: 'json',
	            root: 'data'
	        }
	    },
	    listeners: {
	    	load: function() {
	    		Ext.getCmp('frm_sel_category').setValue('all');
	    		Ext.getCmp('frm_sel_supplier').getStore().reload();
	    	}
	    }
	});

	var supplier_store = new Ext.data.Store({
		fields: ['s_id', 's_name'],
		proxy: {
	        type: 'ajax',
	        url: global_controller_url + 'get_suppliers',
	        reader: {
	            type: 'json',
	            root: 'data'
	        }
	    },
	    listeners: {
	    	load: function() {
	    		Ext.getCmp('frm_sel_supplier').setValue('all');
	    		// store.reload();
	    	}
	    }
	});

	// Set Top Bar
	var top_bar = [
		{
            xtype: 'combobox',
            fieldLabel: 'Category',
            id: 'frm_sel_category',
            name: 'frm_sel_category',
            store: category_store,
            valueField: 'c_id',
            displayField: 'c_name',
            triggerAction: 'all',
            queryMode: 'local',
            emptyText: 'Select Category',
            width: 300,
            labelWidth: 60,
            forceSelection: true,
            value: 'All',
            listeners: {
            	select: function() {
            		// store.reload();
            	}
            }
        },
        '-',
        {
            xtype: 'combobox',
            fieldLabel: 'Supplier',
            id: 'frm_sel_supplier',
            name: 'frm_sel_supplier',
            store: supplier_store,
            width: 300,
            labelWidth: 50,
            valueField: 's_id',
            displayField: 's_name',
            triggerAction: 'all',
            queryMode: 'local',
            emptyText: 'Select Supplier',
            forceSelection: true,
            listeners: {
            	select: function() {
            		// store.reload();
            	}
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
						store.reload();
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
					store.reload();
				}
			}
		}
	];

	// Set Grid
	var grid = new Ext.grid.Panel({
	    renderTo: 'grid-container',
	    store: store,
	    title: '<span class="lead">Items for Reordering</span>',
	    width: '100%',
	    height: 500,
	    columnLines: true,
	    iconCls: 'extjs-icon-items',
	    tbar: top_bar,
	    dockedItems: [
	    	{
			    xtype: 'toolbar',
			    dock: 'top',
			    items: [
			    	{
						xtype: 'button',
						text: 'Refresh',
						iconCls: 'extjs-icon-restore',
						iconAlign: 'left',
						handler: function() {
							store.reload();
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
					}
			    ]
			},
		    {
		        xtype: 'pagingtoolbar',
		        store: store,
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


	/*
	 * FUNCTIONS
	 */

	// Export Items for Reordering
	function Export_items_reordering() {
		Ext.Msg.wait('Exporting...', 'Please wait');
		Ext.Ajax.request({
			url: global_controller_url + 'export_items_reordering',
            method: 'POST',
            params: {
            	c_id: Ext.getCmp('frm_sel_category').getValue(),
            	s_id: Ext.getCmp('frm_sel_supplier').getValue()
            },
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
