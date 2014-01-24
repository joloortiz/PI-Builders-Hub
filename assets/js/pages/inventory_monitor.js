Ext.onReady(function() {
	/*
	 * INITIALIZE
	 */

	var opt = '';

	// Set Store
	var store = new Ext.data.Store({
	    fields: ['i_id', 'i_name', 'i_attribute', 'i_selling_price', 'i_purchase_price', 'i_vat', 'i_reorder_level', 'c_id', 'c_name', 'u_id', 'u_name', 'u_slug_name', 's_id', 's_name', 'is_deleted', 'qty_on_hand'],
	    pageSize: global_page_size,
	    proxy: {
	        type: 'ajax',
	        url: global_controller_url + 'get_items',
	        reader: {
	            type: 'json',
	            root: 'data',
	            totalProperty: 'total'
	        }
	    },
	    listeners: {
	    	beforeload: function(store) {
		    	store.getProxy().extraParams.query = Ext.getCmp('search-text').getValue().trim();
		    	store.getProxy().extraParams.show_deleted = Ext.getCmp('show-deleted').getValue();
		    	store.getProxy().extraParams.c_id = Ext.getCmp('frm_sel_category').getValue();
		    	store.getProxy().extraParams.s_id = Ext.getCmp('frm_sel_supplier').getValue();
		    	store.getProxy().extraParams.order_qty_on_hand = Ext.getCmp('frm_sel_order_qty_on_hand').getValue();
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

	var order_qty_on_hand_store =  new Ext.data.Store({
	    fields: ['value', 'display'],
		data : [
			{value: 'asc', display: 'Low to High'},
			{value: 'desc', display: 'Hight to Low'}
		]
	});

	// Set Top Bar
	var top_bar = [
		'->',
		{
			xtype: 'checkbox',
			boxLabel: 'Show Deleted',
			id: 'show-deleted',
			listeners: {
				change: function(checkbox, new_value, old_value) {
					grid.columns[grid.columns.length - 1].setVisible(new_value);
					store.reload();
				}
			}
		},
		'-',
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
	    title: '<span class="lead">Inventory Monitor</span>',
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
			            width: '30%',
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
			            width: '30%',
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
			        '-',
					{
			            xtype: 'combobox',
			            fieldLabel: 'Order Qty on Hand',
			            id: 'frm_sel_order_qty_on_hand',
			            name: 'frm_sel_order_qty_on_hand',
			            store: order_qty_on_hand_store,
			            valueField: 'value',
			            displayField: 'display',
			            triggerAction: 'all',
			            queryMode: 'local',
			            emptyText: 'Select Status',
			            editable: false,
			            width: 230,
			            labelWidth: 120,
			            value: 'asc',
						listeners: {
							select: function() {
			            		// store.reload();
			            	}
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
	        },
	        {
	            text: 'Deleted',
	            width: 75,
	            dataIndex: 'is_deleted',
	            align: 'center',
	            hidden: true,
	            hideable: false,
	            renderer: renderer_yes_no_negative
	        }
	    ]
	});
});