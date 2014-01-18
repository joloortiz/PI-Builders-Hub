Ext.onReady(function() {
	/*
	 * INITIALIZE
	 */

	// Set Store
	var non_moving_store = new Ext.data.Store({
	    fields: ['i_id', 'i_name', 'i_attribute', 'i_selling_price', 'i_purchase_price', 'i_vat', 'i_reorder_level', 'c_id', 'c_name', 'u_id', 'u_name', 'u_slug_name', 's_id', 's_name', 'item_movement'],
	    pageSize: global_page_size,
	    proxy: {
	        type: 'ajax',
	        url: global_controller_url + 'get_items_movement',
	        reader: {
	            type: 'json',
	            root: 'data',
	            totalProperty: 'total'
	        }
	    },
	    listeners: {
	    	beforeload: function(store) {
		    	store.getProxy().extraParams.movement_type = 'non';
		    	store.getProxy().extraParams.datefrom = Ext.getCmp('frm_datefrom').getValue();
		    	store.getProxy().extraParams.dateto = Ext.getCmp('frm_dateto').getValue();
		    	store.getProxy().extraParams.slow_moving_limit = Ext.getCmp('frm_slow_moving_limit').getValue();
		    }
	    }
	});

	var slow_moving_store = new Ext.data.Store({
	    fields: ['i_id', 'i_name', 'i_attribute', 'i_selling_price', 'i_purchase_price', 'i_vat', 'i_reorder_level', 'c_id', 'c_name', 'u_id', 'u_name', 'u_slug_name', 's_id', 's_name', 'item_movement'],
	    pageSize: global_page_size,
	    proxy: {
	        type: 'ajax',
	        url: global_controller_url + 'get_items_movement',
	        reader: {
	            type: 'json',
	            root: 'data',
	            totalProperty: 'total'
	        }
	    },
	    listeners: {
	    	beforeload: function(store) {
	    		store.getProxy().extraParams.movement_type = 'slow';
		    	store.getProxy().extraParams.datefrom = Ext.getCmp('frm_datefrom').getValue();
		    	store.getProxy().extraParams.dateto = Ext.getCmp('frm_dateto').getValue();
		    	store.getProxy().extraParams.slow_moving_limit = Ext.getCmp('frm_slow_moving_limit').getValue();
		    }
	    }
	});

	var fast_moving_store = new Ext.data.Store({
	    fields: ['i_id', 'i_name', 'i_attribute', 'i_selling_price', 'i_purchase_price', 'i_vat', 'i_reorder_level', 'c_id', 'c_name', 'u_id', 'u_name', 'u_slug_name', 's_id', 's_name', 'item_movement'],
	    pageSize: global_page_size,
	    proxy: {
	        type: 'ajax',
	        url: global_controller_url + 'get_items_movement',
	        reader: {
	            type: 'json',
	            root: 'data',
	            totalProperty: 'total'
	        }
	    },
	    listeners: {
	    	beforeload: function(store) {
	    		store.getProxy().extraParams.movement_type = 'fast';
		    	store.getProxy().extraParams.datefrom = Ext.getCmp('frm_datefrom').getValue();
		    	store.getProxy().extraParams.dateto = Ext.getCmp('frm_dateto').getValue();
		    	store.getProxy().extraParams.slow_moving_limit = Ext.getCmp('frm_slow_moving_limit').getValue();
		    }
	    }
	});

	// Set Top Bar
	var top_bar = [
		{
            xtype: 'datefield',
            fieldLabel: 'Date From',
            id: 'frm_datefrom',
            name: 'frm_datefrom',
            editable: false,
            format: 'M j, Y',
            labelWidth: 70,
            width: 200,
            maxValue: new Date(),
            listeners: {
            	select: function(me) {
            		var datefrom = Ext.getCmp('frm_datefrom').getValue();
            		var dateto = Ext.getCmp('frm_dateto').getValue();
            		if(datefrom != null && dateto != null) {
            			if(dateto < datefrom) {
            				me.setValue('');
            				Ext.Msg.show({
								title:'Information',
								msg: 'Date From should be less than or equal to Date To',
								buttons: Ext.Msg.OK,
								icon: Ext.Msg.WARNING,
								closable: false
							});
            			}
            		}
            	}
            }
        },
        '-',
        {
            xtype: 'datefield',
            fieldLabel: 'Date To',
            id: 'frm_dateto',
            name: 'frm_dateto',
            editable: false,
            format: 'M j, Y',
            labelWidth: 50,
            width: 180,
            maxValue: new Date(),
            listeners: {
            	select: function(me) {
            		var datefrom = Ext.getCmp('frm_datefrom').getValue();
            		var dateto = Ext.getCmp('frm_dateto').getValue();
            		if(datefrom != null && dateto != null) {
            			if(dateto < datefrom) {
            				me.setValue('');
            				Ext.Msg.show({
								title:'Information',
								msg: 'Date From should be less than or equal to Date To',
								buttons: Ext.Msg.OK,
								icon: Ext.Msg.WARNING,
								closable: false
							});
            			}
            		}
            	}
            }
        },
        '-',
        {
        	xtype: 'numberfield',
        	fieldLabel: 'Slow Moving Limit',
        	id: 'frm_slow_moving_limit',
            name: 'frm_slow_moving_limit',
            minValue: 1,
            value: 20,
            labelWidth: 110,
            width: 180,
            listeners: {
            	blur: function(me) {
            		if(me.getValue() == null || me.getValue() == 0) {
            			me.setValue(1);
            		}
            	}
            }
        }
	];

	// Set Grid
	var non_moving_grid = new Ext.grid.Panel({
	    store: non_moving_store,
	    width: '100%',
	    height: 500,
	    columnLines: true,
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
							non_moving_store.reload();
						}
					},
					'-',
					{
						xtype: 'button',
						text: 'Export',
						iconCls: 'extjs-icon-export-excel',
						iconAlign: 'left',
						handler: function() {
							Export_items_movement('non');
						}
					}
			    ]
			},
		    {
		        xtype: 'pagingtoolbar',
		        store: non_moving_store,
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
	            text: 'Movement',
	            width: 100,
	            dataIndex: 'item_movement',
	            tdCls: 'extjs-bold-text',
	            align: 'center',
	            renderer: renderer_number,
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

	var slow_moving_grid = new Ext.grid.Panel({
	    store: slow_moving_store,
	    width: '100%',
	    height: 500,
	    columnLines: true,
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
							slow_moving_store.reload();
						}
					},
					'-',
					{
						xtype: 'button',
						text: 'Export',
						iconCls: 'extjs-icon-export-excel',
						iconAlign: 'left',
						handler: function() {
							Export_items_movement('slow');
						}
					}
			    ]
			},
		    {
		        xtype: 'pagingtoolbar',
		        store: slow_moving_store,
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
	            text: 'Movement',
	            width: 100,
	            dataIndex: 'item_movement',
	            tdCls: 'extjs-bold-text',
	            align: 'center',
	            renderer: renderer_number,
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

	var fast_moving_grid = new Ext.grid.Panel({
	    store: fast_moving_store,
	    width: '100%',
	    height: 500,
	    columnLines: true,
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
							fast_moving_store.reload();
						}
					},
					'-',
					{
						xtype: 'button',
						text: 'Export',
						iconCls: 'extjs-icon-export-excel',
						iconAlign: 'left',
						handler: function() {
							Export_items_movement('fast');
						}
					}
			    ]
			},
		    {
		        xtype: 'pagingtoolbar',
		        store: fast_moving_store,
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
	            text: 'Movement',
	            width: 100,
	            dataIndex: 'item_movement',
	            tdCls: 'extjs-bold-text',
	            align: 'center',
	            renderer: renderer_number,
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

	// Set Tab Panel
	var items_movement_tab_panel = new Ext.tab.Panel({
		plain: true,
		items: [
			{
		        title: 'NON-Moving',
		        layout: 'fit',
		        items: [non_moving_grid]
		    },
		    {
		        title: 'SLOW-moving',
		        layout: 'fit',
		        items: [slow_moving_grid]
		    },
		    {
		        title: 'FAST-moving',
		        layout: 'fit',
		        items: [fast_moving_grid]
		    }
	    ],
	    listeners: {
	    	tabchange: function(tab_panel, tab) {
	    		var index = tab_panel.items.indexOf(tab);
	    		if(index == 0) {
	    			non_moving_store.reload();
	    		} else if(index == 1) {
	    			slow_moving_store.reload();
	    		} else if(index == 2) {
	    			fast_moving_store.reload();
	    		}
	    	}
	    }
	});

	// Set Panel
	var panel = new Ext.panel.Panel({
		renderTo: 'grid-container',
		title: '<span class="lead">Items Movement</span>',
		width: '100%',
		height: 500,
		layout: 'fit',
		iconCls: 'extjs-icon-movement',
		bodyPadding: '10 0 0 0',
		tbar: top_bar,
		items: [items_movement_tab_panel],
		listeners: {
			afterrender: function() {
				non_moving_store.reload();
			}
		}
	});


	/*
	 * FUNCTIONS
	 */

	// Export Items Movement
	function Export_items_movement(movement_type) {
		Ext.Msg.wait('Exporting...', 'Please wait');
		Ext.Ajax.request({
			url: global_controller_url + 'export_items_movement',
            method: 'POST',
            params: {
            	movement_type: movement_type,
            	datefrom: Ext.getCmp('frm_datefrom').getValue(),
            	dateto: Ext.getCmp('frm_dateto').getValue(),
            	slow_moving_limit: Ext.getCmp('frm_slow_moving_limit').getValue()
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
                	window.location = global_controller_url + 'download_export_items_movement?filename=' + decode.filename;
                	Ext.Msg.close();
                }
            }
		});
	}
});