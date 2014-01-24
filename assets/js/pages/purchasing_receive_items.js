Ext.onReady(function() {
	/*
	 * INITIALIZE
	 */

	var cur_row_index_update = -1;
	var po_id = '';
	var s_id = '';

	// Set Store
	var store = new Ext.data.Store({
	    fields: ['r_id', 'r_receiving_number', 'r_date', 'r_status', 'r_received_by', 'received_name', 'total_cost', 'po_id', 'po_purchase_order_number', 's_id', 's_name'],
	    pageSize: global_page_size,
	    autoLoad: true,
	    proxy: {
	        type: 'ajax',
	        url: global_controller_url + 'get_receivings',
	        reader: {
	            type: 'json',
	            root: 'data',
	            totalProperty: 'total'
	        }
	    },
	    listeners: {
	    	beforeload: function(store) {
		    	store.getProxy().extraParams.query = Ext.getCmp('search-text').getValue().trim();
		    	store.getProxy().extraParams.status = Ext.getCmp('frm_sel_status').getValue();
		    }
	    }
	});

	var status_store =  new Ext.data.Store({
	    fields: ['value', 'display'],
		data : [
			{value: 'all', display: 'All'},
			{value: 'P', display: 'Processed'},
			{value: 'V', display: 'Void'}
		]
	});

	var receiving_store = new Ext.data.Store({
	    fields: ['i_id', 'i_name', 'i_attribute', 'i_purchase_price', 'u_slug_name', 'c_id', 'c_name', 'qty', 'cost', 'pod_id', 's_id', 's_name']
	});

	var item_store =  new Ext.data.Store({
	    fields: [
	    	{name: 'item_id', mapping: 'i_id'},
	    	{name: 'item_name', mapping: 'i_name'},
	    	{name: 'item_display_name', mapping: 'display_name'},
	    	{name: 'item_attribute', mapping: 'i_attribute'},
	    	{name: 'item_selling_price', mapping: 'i_selling_price'},
	    	{name: 'item_purchase_price', mapping: 'i_purchase_price'},
	    	{name: 'item_vat', mapping: 'i_vat'},
	    	{name: 'category_id', mapping: 'c_id'},
	    	{name: 'category_name', mapping: 'c_name'},
	    	{name: 'unit_id', mapping: 'u_id'},
	    	{name: 'unit_name', mapping: 'u_name'},
    		{name: 'unit_slug_name', mapping: 'u_slug_name'},
	    	{name: 'supplier_id', mapping: 's_id'},
	    	{name: 'supplier_name', mapping: 's_name'},
	    	{name: 'item_reorder_level', mapping: 'i_reorder_level', type: data_types.FLOAT},
	    	{name: 'qty_on_hand', mapping: 'qty_on_hand', type: data_types.FLOAT}
	    ]
	});

	var item_search_store = new Ext.data.Store({
		fields: [
			{name: 'item_id', mapping: 'i_id'},
			{name: 'item_name', mapping: 'i_name'},
			{name: 'item_display_name', mapping: 'display_name'},
			{name: 'item_attribute', mapping: 'i_attribute'},
			{name: 'item_selling_price', mapping: 'i_selling_price'},
			{name: 'item_purchase_price', mapping: 'i_purchase_price'},
			{name: 'item_vat', mapping: 'i_vat'},
			{name: 'category_id', mapping: 'c_id'},
			{name: 'category_name', mapping: 'c_name'},
			{name: 'unit_id', mapping: 'u_id'},
			{name: 'unit_name', mapping: 'u_name'},
			{name: 'unit_slug_name', mapping: 'u_slug_name'},
			{name: 'supplier_id', mapping: 's_id'},
			{name: 'supplier_name', mapping: 's_name'},
			{name: 'item_reorder_level', mapping: 'i_reorder_level', type: data_types.FLOAT},
			{name: 'qty_on_hand', mapping: 'qty_on_hand', type: data_types.FLOAT}
		],
		proxy: {
			type: 'ajax',
			url: global_controller_url + 'get_items',
			reader: {
				type: 'json',
				root: 'data'
			}
		},
		listeners: {
			beforeload: function(me) {
				me.getProxy().extraParams.query = Ext.getCmp('frm_item_search').getValue().trim();
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
	    }
	});

	var change_category_store = new Ext.data.Store({
		fields: ['c_id', 'c_name'],
		autoLoad: true,
		proxy: {
	        type: 'ajax',
	        url: global_controller_url + 'get_categories',
	        reader: {
	            type: 'json',
	            root: 'data'
	        }
	    }
	});

	var batch_category_store = new Ext.data.Store({
		fields: ['c_id', 'c_name'],
		autoLoad: true,
		proxy: {
	        type: 'ajax',
	        url: global_controller_url + 'get_categories',
	        reader: {
	            type: 'json',
	            root: 'data'
	        }
	    }
	});

	var change_supplier_store = new Ext.data.Store({
		fields: ['s_id', 's_name'],
		autoLoad: true,
		proxy: {
	        type: 'ajax',
	        url: global_controller_url + 'get_suppliers',
	        reader: {
	            type: 'json',
	            root: 'data'
	        }
	    }
	});

	var batch_supplier_store = new Ext.data.Store({
		fields: ['s_id', 's_name'],
		autoLoad: true,
		proxy: {
	        type: 'ajax',
	        url: global_controller_url + 'get_suppliers',
	        reader: {
	            type: 'json',
	            root: 'data'
	        }
	    }
	});

	var po_list_store = new Ext.data.Store({
		fields: ['po_id', 'po_purchase_order_number', 'po_date', 'po_status', 'po_created_by', 'created_name', 's_id', 's_name', 'total_cost'],
		proxy: {
	        type: 'ajax',
	        url: global_controller_url + 'get_purchase_orders',
	        reader: {
	            type: 'json',
	            root: 'data'
	        }
	    }
	});

	var po_items_store = new Ext.data.Store({
		fields: ['pod_id', 'i_id', 'i_name', 'i_attribute', 'pod_purchase_price', 'pod_qty', 'pod_received', 'po_id', 'u_slug_name', 'c_name', 'cost'],
		proxy: {
	        type: 'ajax',
	        url: global_controller_url + 'get_purchase_order_items',
	        reader: {
	            type: 'json',
	            root: 'data'
	        }
	    },
	    listeners: {
	    	beforeload: function() {
	    		var selected = po_list_grid.getSelectionModel().getSelection();
				var data = selected[0].getData();
	    		po_items_store.getProxy().extraParams.po_id = data.po_id;
	    	}
	    }
	});

	// Set Selection Model
	var po_items_sel_model = new Ext.selection.CheckboxModel({
		checkOnly: true
	});

	var receiving_grid_sel_model = new Ext.selection.CheckboxModel({
		checkOnly: true
	});

	// Set Top Bar
	var top_bar = [
		{
			xtype: 'button',
			text: 'New Receiving',
			id: 'btn_receive',
			iconCls: 'extjs-icon-add',
			iconAlign: 'left',
			handler: function() {
				New_receiving();
			}
		},
		{
			xtype: 'button',
			text: 'Void Receiving',
			id: 'btn_void',
			iconCls: 'extjs-icon-cancel',
			iconAlign: 'left',
			handler: function() {
				if(grid.getSelectionModel().hasSelection()) {
					Void();
				} else {
					Ext.Msg.show({
						title:'Information',
						msg: 'Please a record first',
						buttons: Ext.Msg.OK,
						icon: Ext.Msg.WARNING,
						closable: false
					});
				}
			}
		},
		'-',
		{
			xtype: 'button',
			text: 'View Receiving',
			id: 'btn_view',
			iconCls: 'extjs-icon-view',
			iconAlign: 'left',
			handler: function() {
				if(grid.getSelectionModel().hasSelection()) {
					View();
				} else {
					Ext.Msg.show({
						title:'Information',
						msg: 'Please a record first',
						buttons: Ext.Msg.OK,
						icon: Ext.Msg.WARNING,
						closable: false
					});
				}
			}
		},
		'->',
		{
            xtype: 'combobox',
            fieldLabel: 'Status',
            id: 'frm_sel_status',
            name: 'frm_sel_status',
            store: status_store,
            valueField: 'value',
            displayField: 'display',
            triggerAction: 'all',
            queryMode: 'local',
            emptyText: 'Select Status',
            editable: false,
            width: 170,
            labelWidth: 50,
            value: 'P',
			listeners: {
				select: function() {
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

	var receiving_top_bar = [
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
            		Get_item_store_data();
            	},
            	change: function(me) {
            		if(me.getValue() == null) {
            			me.reset();
            			item_store.removeAll();
            		}
            	}
            }
        },
		{
			xtype: 'combobox',
			id: 'frm_sel_item',
			name: 'frm_sel_item',
			store: item_store,
			valueField: 'item_id',
			displayField: 'item_display_name',
			queryMode: 'local',
			emptyText: 'Select Item',
			hideLabel: true,
			forceSelection: true,
			width: '50%',
			listConfig: {
				emptyText: 'No Items found.',
				maxHeight: 400,
				getInnerTpl: function() {
					return '<table class="table table-bordered" style="margin-bottom: 0;">' +
								'<tr>' +
									'<td style="padding: 0px;" colspan="2">' + 
										'<strong>{item_display_name}</strong>' +
										'<span class="pull-right">' +
											'QOH: ' +
											'<strong>' +
												'<tpl if="qty_on_hand &gt; item_reorder_level">' +
													'<span class="text-success">{[Ext.util.Format.number(values.qty_on_hand, \'0.00\')]}</span>' +
												'</tpl>' +
												'<tpl if="qty_on_hand &lt; item_reorder_level || qty_on_hand == item_reorder_level">' +
													'<span class="text-error">{[Ext.util.Format.number(values.qty_on_hand, \'0.00\')]}</span>' +
												'</tpl>' +
											'</strong>' +
										'</span>' +
									'</td>' +
									'<td style="width: 20%; padding: 0px; text-align: right;"><strong class="text-success">{[Ext.util.Format.currency(values.item_selling_price, \'₱&emsp;\')]}</strong></td>' +
								'</tr>' +
								'<tr>' +
									'<td style="width: 40%; padding: 0px;"><small>{category_name}</small></td>' +
									'<td style="width: 40%; padding: 0px;"><small>{supplier_name}</small></td>' +
									'<td style="width: 20%; padding: 0px; text-align: right;"><strong>{[Ext.util.Format.currency(values.item_purchase_price, \'₱&emsp;\')]}</strong></td>' +
								'</tr>' +
							'</table>';
				}
			},
			listeners: {
				select: function(combo, records) {
					Add_item(records[0]);
					combo.reset();
				}
			}
		},
		'->',
		{
			xtype: 'button',
			text: 'Item Search',
			iconCls: 'extjs-icon-search',
			handler: function() {
				Item_search();
			}
		}
	];

	var item_search_top_bar = [
		{
			xtype: 'textfield',
			id: 'frm_item_search',
			name: 'frm_item_search',
			emptyText: 'Search Item then Press Enter',
			hideLabel: true,
			width: '100%',
			listeners: {
				specialkey: function(me, e) {
					if(e.keyCode == 13) { // Enter
						// Trim
						me.setValue(me.getValue().trim());

						if(me.getValue() != '') {
							item_search_grid.getStore().reload();
						}
					}

					if(e.keyCode == 40) { // Down Arrow
						if(item_search_grid.getStore().count() > 0) {
							item_search_grid.getSelectionModel().select(0);
							item_search_grid.getView().getEl().scrollTo('top', 0, true);
						}
					}
				}
			}
		}
	];

	// Set Bottom Bar
	var receiving_bottom_bar = [
		'->',
		{
			xtype: 'text',
            text: 'Total Cost:',
            cls: 'lead'
		},
		{
			xtype: 'text',
			id: 'text_total',
            cls: 'lead extjs-bold-text'
		}
	];

	// Set Grid
	var grid = new Ext.grid.Panel({
	    renderTo: 'grid-container',
	    store: store,
	    title: '<span class="lead">Receive Items</span>',
	    width: '100%',
	    height: 500,
	    columnLines: true,
	    iconCls: 'extjs-icon-receive-items',
	    tbar: top_bar,
	    dockedItems: [
		    {
		        xtype: 'pagingtoolbar',
		        store: store,
		        dock: 'bottom',
		        displayInfo: true
		    }
	    ],
	    columns: [
	        {
	            text: 'Receiving #',
	            width: 100,
	            dataIndex: 'r_receiving_number',
	            tdCls: 'extjs-bold-text'
	        },
	        {
	            text: 'Status',
	            width: 120,
	            dataIndex: 'r_status',
	            tdCls: 'extjs-bold-text',
	            renderer: renderer_status
	        },
	        {
	            text: 'Total Cost',
	            width: 120,
	            dataIndex: 'total_cost',
	            tdCls: 'extjs-bold-text text-info',
	            align: 'right',
	            renderer: renderer_currency
	        },
	        {
	            text: 'Received By',
	            width: 150,
	            dataIndex: 'received_name'
	        },
	        {
	            text: 'Receiving Date',
	            width: 170,
	            dataIndex: 'r_date',
	            renderer: renderer_datetime
	        },
	        {
	            text: 'Supplier',
	            width: 150,
	            dataIndex: 's_name'
	        },
	        {
	            text: 'PO #',
	            width: 50,
	            dataIndex: 'po_purchase_order_number',
	            tdCls: 'extjs-bold-text'
	        }
	    ],
	    listeners: {
	    	selectionchange: function(grid, selected) {
	    		if(selected.length > 0) {
	    			selected = selected[0];
		    		var data = selected.getData();
		    		if(data.r_status == 'P') {
		    			Ext.getCmp('btn_void').enable();
		    		} else {
		    			Ext.getCmp('btn_void').disable();
		    		}
	    		}
	    	}
	    }
	});

	var receiving_grid = new Ext.grid.Panel({
		title: 'Select Items to Receive',
	    store: receiving_store,
	    width: '100%',
	    height: 500,
	    columnLines: true,
	    selModel: receiving_grid_sel_model,
	    tbar: receiving_top_bar,
	    bbar: receiving_bottom_bar,
	    dockedItems: [{
		    xtype: 'toolbar',
		    dock: 'top',
		    items: [
		        {
					xtype: 'button',
					id: 'btn_receive_from_po',
					text: 'Receive from PO',
					iconCls: 'extjs-icon-purchase-order',
					handler: function() {
						po_list_window_panel.center();
						po_list_window_panel.show();
					}
				},
				{
					xtype: 'button',
					id: 'btn_cancel_receive_from_po',
					text: 'Cancel Receive from PO',
					iconCls: 'extjs-icon-cancel',
					hidden: true,
					handler: function() {
						Cancel_receive_from_PO();
					}
				},
				'-',
				{
					xtype: 'button',
					text: 'Batch Update',
					id: 'btn_batch_update',
					iconCls: 'extjs-icon-batch-edit',
					iconAlign: 'left',
					handler: function() {
						if(receiving_grid.getSelectionModel().hasSelection()) {
							Ext.getCmp('frm_batch_qty').setValue('');
							Ext.getCmp('frm_purchase_price').setValue('');
							Ext.getCmp('frm_sel_change_supplier').reset();
							Ext.getCmp('frm_sel_change_category').reset();

							batch_update_form_panel.getForm().reset();
							batch_update_window_panel.show();
							batch_update_window_panel.center();
						} else {
							Ext.Msg.show({
								title:'Information',
								msg: 'Please select records first',
								buttons: Ext.Msg.OK,
								icon: Ext.Msg.WARNING,
								closable: false
							});
						}				
					}
				}
				// ,
				// '->',
				// {
	   //              xtype: 'combobox',
	   //              fieldLabel: 'Supplier',
	   //              afterLabelTextTpl: global_required,
	   //              id: 'frm_sel_supplier',
	   //              name: 'frm_sel_supplier',
	   //              store: supplier_store,
	   //              width: 250,
	   //              labelWidth: 60,
	   //              valueField: 's_id',
	   //              displayField: 's_name',
	   //              triggerAction: 'all',
	   //              queryMode: 'local',
	   //              emptyText: 'Select Supplier',
	   //              allowBlank: false,
	   //              forceSelection: true,
		  //           anyMatch: true,
		  //           listeners: {
		  //           	select: function() {
		  //           		receiving_grid.getStore().removeAll();
		  //           		Ext.getCmp('frm_sel_item').getStore().reload();
		  //           	}
		  //           }
	   //          }
		    ]
		}],
	    columns: [
	    	{
				xtype: 'actioncolumn',
				text: 'Action',
				width: 60,
				locked: true,
				stopSelection: false,
				items: [
					{
						iconCls: 'extjs-icon-edit',
						tooltip: 'Update Qty/Purchase Price',
						handler: function (grid, row, col) {
							Ext.getCmp('qty_purchase_price_form').getForm().reset();

							// var rec = receiving_grid.getSelectionModel().getSelection();
							// var data = rec[0].getData();
							// Ext.getCmp('frm_qty').setValue(data.qty);
							// Ext.getCmp('frm_purchase_price').setValue(data.i_purchase_price);
							// Ext.getCmp('frm_sel_supplier').setValue(data.s_id);

							var rec = receiving_grid.getStore().getAt(row);
							var data = rec.getData();
							Ext.getCmp('frm_qty').setValue(data.qty);
							Ext.getCmp('frm_purchase_price').setValue(data.i_purchase_price);
							Ext.getCmp('frm_sel_change_supplier').setValue(data.s_id);
							Ext.getCmp('frm_sel_change_category').setValue(data.c_id);
							cur_row_index_update = row;

							qty_purchase_price_window_panel.show();
							qty_purchase_price_window_panel.center();
						}
					},
					{
						iconCls: 'extjs-icon-delete pull-right',
						tooltip: 'Remove',
						handler: function (grid, row, col) {
							var rec = receiving_grid.getStore().getAt(row);
							receiving_grid.getStore().remove(rec);
							// receiving_grid.getStore().remove(receiving_grid.getSelectionModel().getSelection());
							Update_total_cost();
						}
					}
				]
	    	},
	        {
	            text: 'Item Name',
	            width: 200,
	            dataIndex: 'i_name',
	            tdCls: 'extjs-bold-text',
	            renderer: renderer_to_upper,
	            sortable: false,
	            draggable: false,
	            locked: true
	        },
	        {
	            text: 'Purchase Price',
	            width: 120,
	            dataIndex: 'i_purchase_price',
	            align: 'right',
	            renderer: renderer_currency,
	            sortable: false,
	            draggable: false,
	            locked: true
	        },
	        {
	            text: 'Qty',
	            width: 75,
	            dataIndex: 'qty',
	            align: 'center',
	            renderer: renderer_number,
	            sortable: false,
	            draggable: false,
	            locked: true
	        },
	        {
	            text: 'Cost',
	            width: 100,
	            dataIndex: 'cost',
	            align: 'right',
	            tdCls: 'extjs-bold-text text-info',
	            renderer: renderer_currency,
	            sortable: false,
	            draggable: false,
	            locked: true
	        },
	        {
	            text: 'Supplier',
	            width: 120,
	            dataIndex: 's_name'
	        },
	        {
	            text: 'Category',
	            width: 120,
	            dataIndex: 'c_name'
	        },
	        {
	            text: 'Attribute',
	            width: 100,
	            dataIndex: 'i_attribute'
	        }
	    ]
	});

	var po_list_grid = new Ext.grid.Panel({
		store: po_list_store,
		columnLines: true,
		columns: [
	        {
	            text: 'PO #',
	            width: 100,
	            dataIndex: 'po_purchase_order_number',
	            tdCls: 'extjs-bold-text',
	            renderer: renderer_to_upper
	        },
	        {
	            text: 'Status',
	            width: 120,
	            dataIndex: 'po_status',
	            tdCls: 'extjs-bold-text',
	            renderer: renderer_po_status
	        },
	        {
	            text: 'Total Cost',
	            width: 120,
	            dataIndex: 'total_cost',
	            tdCls: 'extjs-bold-text text-info',
	            align: 'right',
	            renderer: renderer_currency
	        }
	    ],
	    listeners: {
	    	select: function() {
	    		po_items_grid.getStore().reload();
	    	}
	    }
	});

	var po_items_grid = new Ext.grid.Panel({
		store: po_items_store,
		columnLines: true,
		selModel: po_items_sel_model,
		columns: [
	        {
	            text: 'Item Name',
	            width: 200,
	            dataIndex: 'i_name',
	            tdCls: 'extjs-bold-text',
	            renderer: renderer_to_upper,
	            sortable: false,
	            draggable: false,
	            locked: true
	        },
	        {
	            text: 'Purchase Price',
	            width: 120,
	            dataIndex: 'pod_purchase_price',
	            align: 'right',
	            renderer: renderer_currency,
	            sortable: false,
	            draggable: false,
	            locked: true
	        },
	        {
	            text: 'Qty',
	            width: 75,
	            dataIndex: 'pod_qty',
	            align: 'center',
	            renderer: renderer_number,
	            sortable: false,
	            draggable: false,
	            locked: true
	        },
	        {
	            text: 'Cost',
	            width: 100,
	            dataIndex: 'cost',
	            align: 'right',
	            tdCls: 'extjs-bold-text text-info',
	            renderer: renderer_currency,
	            sortable: false,
	            draggable: false,
	            locked: true
	        },
	        {
	            text: 'Received',
	            width: 75,
	            dataIndex: 'pod_received',
	            sortable: false,
	            draggable: false
	        },
	        {
	            text: 'Attribute',
	            width: 100,
	            dataIndex: 'i_attribute',
	            sortable: false,
	            draggable: false
	        },
	        {
	            text: 'Category',
	            width: 120,
	            dataIndex: 'c_name',
	            sortable: false,
	            draggable: false
	        }
	    ]
	});

	var item_search_grid = new Ext.grid.Panel({
		store: item_search_store,
		columnLines: true,
		tbar: item_search_top_bar,
		columns: [
			{
	            text: 'Item Name',
	            width: 300,
	            dataIndex: 'item_name',
	            tdCls: 'extjs-bold-text',
	            renderer: renderer_to_upper,
	            sortable: false,
	            draggable: false,
	            locked: true
	        },
	        {
	            text: 'Attribute',
	            width: 100,
	            dataIndex: 'item_attribute',
	            sortable: false,
	            draggable: false
	        },
	        {
	            text: 'Selling Price',
	            width: 120,
	            dataIndex: 'item_selling_price',
	            align: 'right',
	            tdCls: 'extjs-bold-text text-success',
	            renderer: renderer_currency,
	            sortable: false,
	            draggable: false
	        },
	        {
	            text: 'Purchase Price',
	            width: 120,
	            dataIndex: 'item_purchase_price',
	            align: 'right',
	            renderer: renderer_currency,
	            sortable: false,
	            draggable: false
	        },
	        {
	            text: 'VAT',
	            width: 60,
	            dataIndex: 'item_vat',
	            align: 'center',
	            renderer: renderer_yes_no_negative
	        },
	        {
	            text: 'Category',
	            width: 120,
	            dataIndex: 'category_name'
	        },
	        {
	            text: 'Supplier',
	            width: 120,
	            dataIndex: 'supplier_name'
	        }
		],
		listeners:{
			cellkeydown: function(me, td, cell_index, record, tr, row, e){
				if(e.keyCode == 13) { // Enter
					Add_item(record);
					me.focus();
				}
			},
			itemdblclick: function(me, record) {
				Add_item(record);
				me.focus();
			}
		}
	});

	// Set Form Panel
	var qty_purchase_price_form_panel = new Ext.form.Panel({
        id: 'qty_purchase_price_form',
    	bodyPadding: 10,
    	defaults: {
            anchor: '100%'
        },
        fieldDefaults: {
            msgTarget: 'side',
            labelWidth: 110
        },
        items: [
            {
                xtype: 'numberfield',
                fieldLabel: 'Qty',
                id: 'frm_qty',
                name: 'frm_qty',
                fieldCls: 'extjs-align-center',
                maxLength: 10,
                minValue: 0.01,
                maxValue: 9999,
                listeners: {
                	blur: function(me) {
                		if(me.getValue() == null || me.getValue() == 0) {
                			me.setValue(1);
                		}
                	}
                }
            },
            {
                xtype: 'numberfield',
                fieldLabel: 'Purchase Price',
                id: 'frm_purchase_price',
                name: 'frm_purchase_price',
                fieldCls: 'extjs-align-right',
                maxLength: 10,
                minValue: 0.01
            },
			{
				xtype: 'combobox',
				fieldLabel: 'Supplier',
				id: 'frm_sel_change_supplier',
				name: 'frm_sel_change_supplier',
				store: change_supplier_store,
				valueField: 's_id',
				displayField: 's_name',
				triggerAction: 'all',
				queryMode: 'local',
				emptyText: 'Select Supplier',
				enableKeyEvents: true,
				forceSelection: true,
				listeners: {
					change: function(me) {
						if(me.getValue() == null) {
							me.reset();
						}
					}
				}
			},
			{
				xtype: 'combobox',
				fieldLabel: 'Category',
				id: 'frm_sel_change_category',
				name: 'frm_sel_change_category',
				store: change_category_store,
				valueField: 'c_id',
				displayField: 'c_name',
				triggerAction: 'all',
				queryMode: 'local',
				emptyText: 'Select Category',
				enableKeyEvents: true,
				forceSelection: true,
				listeners: {
					change: function(me) {
						if(me.getValue() == null) {
							me.reset();
						}
					}
				}
			}
        ],
    	buttons: [
	    	{
	    		text: 'Cancel',
	    		iconCls: 'extjs-icon-cancel',
	    		handler: function() {
	    			qty_purchase_price_window_panel.close();
	    			cur_row_index_update = -1;
	    		}
	    	},
	    	{
	    		text: 'Update',
	    		formBind: true,
	    		iconCls: 'extjs-icon-save',
	    		handler: function() {
	    			Update_qty_purchase_price();
	    			qty_purchase_price_window_panel.close();
	    			cur_row_index_update = -1;
	    		}
	    	}
	    ]
    });

	var batch_update_form_panel = new Ext.form.Panel({
		id: 'batch_update_form',
    	bodyPadding: 10,
    	defaults: {
            anchor: '100%'
        },
        fieldDefaults: {
            msgTarget: 'side',
            labelWidth: 110
        },
        items: [
            {
                xtype: 'numberfield',
                fieldLabel: 'Qty',
                id: 'frm_batch_qty',
                name: 'frm_batch_qty',
                fieldCls: 'extjs-align-center',
                maxLength: 10,
                minValue: 0.01,
                maxValue: 9999
            },
            {
                xtype: 'numberfield',
                fieldLabel: 'Purchase Price',
                id: 'frm_batch_purchase_price',
                name: 'frm_batch_purchase_price',
                fieldCls: 'extjs-align-right',
                maxLength: 10,
                minValue: 0.01
            },
			{
				xtype: 'combobox',
				fieldLabel: 'Supplier',
				id: 'frm_batch_sel_supplier',
				name: 'frm_batch_sel_supplier',
				store: batch_supplier_store,
				valueField: 's_id',
				displayField: 's_name',
				triggerAction: 'all',
				queryMode: 'local',
				emptyText: 'Select Supplier',
				enableKeyEvents: true,
				forceSelection: true,
				listeners: {
					change: function(me) {
						if(me.getValue() == null) {
							me.reset();
						}
					}
				}
			},
			{
				xtype: 'combobox',
				fieldLabel: 'Category',
				id: 'frm_batch_sel_category',
				name: 'frm_batch_sel_category',
				store: batch_category_store,
				valueField: 'c_id',
				displayField: 'c_name',
				triggerAction: 'all',
				queryMode: 'local',
				emptyText: 'Select Category',
				enableKeyEvents: true,
				forceSelection: true,
				listeners: {
					change: function(me) {
						if(me.getValue() == null) {
							me.reset();
						}
					}
				}
			}
        ],
    	buttons: [
	    	{
	    		text: 'Cancel',
	    		iconCls: 'extjs-icon-cancel',
	    		handler: function() {
	    			batch_update_window_panel.close();
	    		}
	    	},
	    	{
	    		text: 'Update',
	    		formBind: true,
	    		iconCls: 'extjs-icon-save',
	    		handler: function() {
	    			Update_batch();
	    			batch_update_window_panel.close();
	    		}
	    	}
	    ]
	});

	// Set Tab Panel
	var view_receiving_tab_panel = new Ext.tab.Panel({
		width: '100%',
		activeTab: 0,
		plain: true,
		deferredRender: false
	});

	// Set Window panel
	var window_panel = new Ext.window.Window({
	    height: 500,
		width: 800,
		iconCls: 'extjs-icon-add',
		layout: 'fit',
	    closeAction: 'hide',
	    modal: true,
	    closable: false,
	    resizable: false,
	    maximizable: true,
	    bodyPadding: 5,
	    items: [receiving_grid],
		bbar: [
			{
				xtype: 'button',
				text: 'Cancel',
				iconCls: 'extjs-icon-cancel-large',
				scale: 'large',
				handler: function() {
					window_panel.close();
					Cancel_receive_from_PO();
				}
			},
			'->',
			{
				xtype: 'button',
				text: 'Receive Only',
				iconCls: 'extjs-icon-receive-items-large',
				scale: 'large',
				handler: function() {
					Receive(false);
				}
			},
			{
				xtype: 'button',
				text: 'Print & Receive',
				iconCls: 'extjs-icon-print-large',
				scale: 'large',
				handler: function() {
					Receive(true);
				}
			}
		],
	    listeners: {
	    	show: function() {
	    		Ext.getCmp('frm_sel_category').getStore().reload();
	    	}
	    }
	});

	var qty_purchase_price_window_panel = new Ext.window.Window({
		title: 'Qty/Purchase Price',
		height: 210,
		width: 350,
		iconCls: 'extjs-icon-edit ',
		layout: 'fit',
		closeAction: 'hide',
		modal: true,
		closable: false,
		resizable: false,
		items: [qty_purchase_price_form_panel]
	});

	var po_list_window_panel = new Ext.window.Window({
		title: 'Receive From Purchase Order',
		height: 500,
		width: 1000,
		iconCls: 'extjs-icon-purchase-order',
		layout: 'fit',
		closeAction: 'hide',
		modal: true,
		closable: false,
		resizable: false,
		bodyPadding: 5,
		items: [
			{
				xtype: 'panel',
	    		layout: {
					type: 'hbox',
					pack: 'start',
					align: 'stretch'
				},
				items: [
					{
						title: 'Purchase Orders',
						width: 350,
						layout: 'fit',
						padding: '0 5 0 0',
						items: [po_list_grid]
			    	},
			    	{
						title: 'Purchase Order Items',
						flex: 1,
						layout: 'fit',
						items: [po_items_grid]
			    	}
				]
			}
		],
		bbar: [
			{
				xtype: 'button',
				text: 'Cancel',
				iconCls: 'extjs-icon-cancel-large',
				scale: 'large',
				handler: function() {
					po_id = '';
					po_list_window_panel.close();
				}
			},
			'->',
			{
				xtype: 'button',
				text: 'Receive From PO',
				iconCls: 'extjs-icon-receive-items-large',
				scale: 'large',
				handler: function() {
					Receive_from_PO();
				}
			}
		],
		listeners: {
			show: function() {
				po_items_grid.getStore().removeAll();
				po_list_grid.getStore().removeAll();
				po_list_grid.getStore().reload();
			}
		}
	});

	var view_receiving_window_panel = new Ext.window.Window({
		height: 500,
		width: 750,
		bodyPadding: 5,
		iconCls: 'extjs-icon-view',
		layout: 'fit',
		closeAction: 'hide',
		modal: true,
		resizable: false,
		closable: false,
		maximizable: true,
		items: [view_receiving_tab_panel],
		bbar: [
			{
				xtype: 'button',
				text: 'Close',
				iconCls: 'extjs-icon-cancel-large',
				scale: 'large',
				handler: function() {
					view_receiving_window_panel.close();
				}
			},
			'->',
			{
				xtype: 'button',
				id: 'btn_print',
				text: 'Print',
				iconCls: 'extjs-icon-print-large',
				scale: 'large',
				handler: function() {
					Print_contents()
				}
			}
		]
	});

	var batch_update_window_panel = new Ext.window.Window({
		title: 'Batch Update',
		height: 210,
		width: 350,
		iconCls: 'extjs-icon-edit ',
		layout: 'fit',
		closeAction: 'hide',
		modal: true,
		closable: false,
		resizable: false,
		items: [batch_update_form_panel]
	});

	var item_search_window_panel = new Ext.window.Window({
		title: 'Item Search',
		height: 500,
		width: 750,
		bodyPadding: 5,
		iconCls: 'extjs-icon-search',
		layout: 'fit',
		closeAction: 'hide',
		modal: true,
		resizable: false,
		closable: false,
		dockedItems: [
			{
				xtype: 'toolbar',
				dock: 'bottom',
				items: [
					{
						xtype: 'button',
						text: 'Close',
						iconCls: 'extjs-icon-cancel-large',
						scale: 'large',
						handler: function() {
							item_search_window_panel.close();
						}
					}
				]
			}
		],
		items: [item_search_grid]
	});


	/*
	 * FUNCTIONS
	 */

	// New Receiving
	function New_receiving() {
		receiving_grid.getStore().removeAll();
		window_panel.setTitle('New Receiving');
		window_panel.restore();
		window_panel.show();
		window_panel.center();

		// Ext.getCmp('frm_sel_supplier').setValue('');
		// Ext.getCmp('frm_sel_supplier').focus();
		Ext.getCmp('frm_sel_category').reset();
		Ext.getCmp('frm_sel_category').focus();
		Update_total_cost();
	}

	// Void
	function Void() {
		var r_id = '';
		var selected = grid.getSelectionModel().getSelection();
		var data = selected[0].getData();
		r_id = data.r_id

		Ext.MessageBox.show({
			title:'Confirmation',
			msg: 'Are you sure to <strong class="text-error">Void</strong> Receiving # <strong>' + data.r_receiving_number + '</strong>? This cannot be undone',
			buttons: Ext.MessageBox.YESNO,
			icon: Ext.MessageBox.QUESTION,
			closable: false,
			fn: function(btn) {
				if(btn == 'yes') {
					Ext.Msg.wait('Saving...', 'Please wait');
					Ext.Ajax.request({
						url: global_controller_url + 'void',
			            method: 'POST',
			            params: {
			                r_id: r_id
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
			                	Ext.Msg.close();
					        	grid.getStore().reload();
			                }
			            }
					});
				}
			}
		});
	}
	
	// Validate
	function Validate() {
		// // Check if there is a Supplier selected
		// if(Ext.getCmp('frm_sel_supplier').getValue() == null && po_id == '') {
		// 	Ext.Msg.show({
		// 		title:'Information',
		// 		msg: 'Please select a Supplier',
		// 		buttons: Ext.Msg.OK,
		// 		icon: Ext.Msg.WARNING,
		// 		closable: false
		// 	});
		// 	return false;
		// }

		// Check if there are entered Receiving Items
		if(receiving_grid.getStore().count() == 0) {
			Ext.Msg.show({
				title:'Information',
				msg: 'Please select Receiving Items',
				buttons: Ext.Msg.OK,
				icon: Ext.Msg.WARNING,
				closable: false
			});
			return false;
		}

		return true;
	}

	// Receive
	function Receive(print) {
		if(Validate() == true) {
			Ext.Msg.wait('Receiving Items...', 'Please wait');
			var items = [];
			receiving_grid.getStore().each(function(record) {
				var data = record.getData();
				var items_details = {
					id: data.i_id,
					name: data.i_name,
					attribute: data.i_attribute,
					purchase_price: data.i_purchase_price,
					u_slug_name: data.u_slug_name,
					qty: data.qty,
					cost: data.cost,
					pod_id: data.pod_id,
					s_id: data.s_id,
					c_id: data.c_id
				};
				items.push(items_details);
			});
			
			Ext.Ajax.request({
				url: global_controller_url + 'save',
				method: 'POST',
				params: {
					items: Ext.JSON.encode(items),
					// s_id: po_id == '' ? Ext.getCmp('frm_sel_supplier').getValue() : s_id,
					po_id: po_id
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
						var receiving = decode.receiving;
						var store_information = decode.store_information;

						// Print
						if(print == true) {
							Ext.Msg.wait('Creating Receiving Voucher...', 'Please wait');

							// All Items HTML
							var receiving_html = '';
							var receiving_html_items = ''
							var receiving_total_cost = 0;
							Ext.Array.each(items, function(item_data, index) {
								receiving_html_items += '\
									<tr>\
										<td style="padding: 0px; line-height: 15px;">' + renderer_number(item_data.qty) + '</td>\
										<td style="padding: 0px; line-height: 15px;">' + item_data.u_slug_name + '</td>\
										<td style="padding: 0px; line-height: 15px;">' + item_data.name + '</td>\
										<td style="text-align: right; padding: 0px; line-height: 15px;">' + renderer_currency_no_sign(item_data.purchase_price) + '</td>\
										<td style="text-align: right; padding: 0px; line-height: 15px;">' + renderer_currency_no_sign(item_data.cost) + '</td>\
									</tr>\
								';
								receiving_total_cost += item_data.cost;
							});
							receiving_html = '\
								<div style="font-size: 12px; line-height: 15px; margin-top: 10px; text-align: center;">\
									<span style="font-size: 13px;"><strong>' + store_information.si_name + '</strong></span><br>\
									' + store_information.si_address + '<br>\
									' + store_information.si_telephone_no + '\
								</div>\
								<table class="table" style="margin-bottom: 0; font-size: 12px;">\
									<tr>\
										<td style="width: 60%; border-top: none; padding: 0px; line-height: 15px;">\
											Receiving Voucher #: ' + receiving.r_receiving_number + '<br>\
											Date: ' + renderer_datetime(receiving.r_date) + '\
										</td>\
										<td style="width: 40%; border-top: none; padding: 0px; line-height: 15px;">\
											Received by: ' + receiving.received_name + '<br>\
											PO #: ' + (receiving.po_purchase_order_number != null ? receiving.po_purchase_order_number : '') + '\
										</td>\
									</tr>\
								</table>\
								<table class="table table-bordered" style="margin-bottom: 0; font-size: 12px;">\
									<thead>\
										<td style="width: 7%; padding: 0px; text-align: center; line-height: 15px;">Qty</td>\
										<td style="width: 10%; padding: 0px; text-align: center; line-height: 15px;">Unit</td>\
										<td style="width: 53%; padding: 0px; text-align: center; line-height: 15px;">Item</td>\
										<td style="width: 15%; padding: 0px; text-align: center; line-height: 15px;">Price</td>\
										<td style="width: 15%; padding: 0px; text-align: center; line-height: 15px;">Cost</td>\
									</thead>\
									<tbody>\
										' + receiving_html_items + '\
									</tbody>\
								</table>\
								<table class="table" style="margin-bottom: 0; font-size: 12px;">\
									<tr>\
										<td style="width: 70%; border-top: none; padding: 0px; line-height: 15px;"></td>\
										<td style="width: 15%; border-top: none; padding: 0px; line-height: 15px;">Total Cost</td>\
										<td style="width: 15%; border-top: none; text-align: right; padding: 0px; line-height: 15px;">\
											' + renderer_currency(receiving_total_cost) + '\
										</td>\
									</tr>\
								</table>\
							';

							// Print HTML
							Print_html(receiving_html);
							Cancel_receive_from_PO();
							Ext.Msg.close();
							window_panel.close();
							grid.getStore().reload();
						} else {
							Cancel_receive_from_PO();
							Ext.Msg.close();
							window_panel.close();
							grid.getStore().reload();
						}
					}
				}
			});
		}
	}

	// Validate Receive from PO
	function Validate_receive_from_PO() {
		// Check if there are selected Items from Purchase Order Items
		if(po_items_grid.getSelectionModel().hasSelection() == false) {
			Ext.Msg.show({
				title:'Information',
				msg: 'Please Items from Purchase Order Items',
				buttons: Ext.Msg.OK,
				icon: Ext.Msg.WARNING,
				closable: false
			});
			return false;
		}

		return true;
	}

	// Receive from PO
	function Receive_from_PO() {
		if(Validate_receive_from_PO() == true) {
			var selected = po_list_grid.getSelectionModel().getSelection();
			var data = selected[0].getData();
			po_id = data.po_id;
			s_id = data.s_id;

			// Add Items to Receiving
			receiving_grid.getStore().removeAll();
			Ext.Array.each(po_items_grid.getSelectionModel().getSelection(), function(record) {
				var data = record.getData();
				
				// Initialize Item Data
				var item_data = {
					i_id: data.i_id,
					i_name: data.i_name,
					i_attribute: data.i_attribute,
					i_purchase_price: data.pod_purchase_price,
					u_slug_name: data.u_slug_name,
					c_name: data.c_name,
					qty: data.pod_qty,
					cost: parseFloat(data.cost),
					pod_id: data.pod_id
				};

				// Add item
				var rec = receiving_grid.getStore().add(item_data);
				receiving_grid.getSelectionModel().select(rec);
			});
			Update_total_cost();

			// Ext.getCmp('frm_sel_supplier').disable();
			Ext.getCmp('frm_sel_category').disable();
			Ext.getCmp('frm_sel_item').disable();
			Ext.getCmp('btn_receive_from_po').hide();
			Ext.getCmp('btn_cancel_receive_from_po').show();
			po_list_window_panel.close();
		}
	}

	// Cancel Receive from PO
	function Cancel_receive_from_PO() {
		po_id = '';
		s_id = '';
		receiving_grid.getStore().removeAll();
		Update_total_cost();

		// Ext.getCmp('frm_sel_supplier').enable();
		if(Ext.getCmp('frm_sel_category').isDisabled()) {
			Ext.getCmp('frm_sel_category').enable();
		}
		if(Ext.getCmp('frm_sel_item').isDisabled()) {
			Ext.getCmp('frm_sel_item').enable();
		}
		Ext.getCmp('btn_cancel_receive_from_po').hide();
		Ext.getCmp('btn_receive_from_po').show();
	}

	// Add Item
	function Add_item(record) {
		var data = record.getData();

		// Check if Item is already added
		var is_existing = false;
		var item_id = data.item_id;
		for(var i = 0; i < receiving_grid.getStore().count(); i++) {
			if(receiving_grid.getStore().getAt(i).getData().i_id == item_id) {
				is_existing = true;
				break;
			}
		}
		
		if(is_existing == false) {
			// Initialize Item Data
			var item_data = {
				i_id: data.item_id,
				i_name: data.item_name,
				i_attribute: data.item_attribute,
				i_purchase_price: data.item_purchase_price,
				u_slug_name: data.unit_slug_name,
				c_id: data.category_id,
				c_name: data.category_name,
				qty: 1,
				cost: (1 * data.item_purchase_price),
				s_id: data.supplier_id,
				s_name: data.supplier_name,
			};

			// Add item
			var rec = receiving_grid.getStore().add(item_data);
			// receiving_grid.getSelectionModel().select(rec);
		}

		Update_total_cost();
	}

	// Get Total
	function Get_total() {
		var total = 0;
		for(var i = 0; i < receiving_grid.getStore().count(); i++) {
			var data = receiving_grid.getStore().getAt(i).getData();
			total += data.cost;	
		}

		return total;
	}

	// Get Item Store Data
	function Get_item_store_data() {
		receiving_grid.setLoading(true);
		item_store.removeAll();
		Ext.Ajax.request({
			url: global_controller_url + 'get_items',
            method: 'POST',
            params: {
            	c_id: Ext.getCmp('frm_sel_category').getValue()
            },
            success: function (response) {
            	var decode = Ext.JSON.decode(response.responseText);

            	if(decode.success == false) {
            		receiving_grid.setLoading(false);
                	Ext.Msg.show({
                		title: 'Failed',
                		msg: decode.msg,
                		buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR,
                        closable: false
                	});
                } else {
                	var proxy = {
						type: 'memory',
						data: decode.data,
						// enablePaging: true,
						reader: {
							type: 'json'
						}
					};
                	item_store.setProxy(proxy);
                	Ext.getCmp('frm_sel_item').expand();
                	item_store.reload();
                	receiving_grid.setLoading(false);
                }
            }
		});
	}

	// Update Qty/Purchase Price
	function Update_qty_purchase_price() {
		// var record = receiving_grid.getSelectionModel().getSelection();
		// var record = record[0];
		var record = receiving_grid.getStore().getAt(cur_row_index_update);
		var qty = Ext.getCmp('frm_qty').getValue();
		var purchase_price = Ext.getCmp('frm_purchase_price').getValue();
		var supplier_id = Ext.getCmp('frm_sel_change_supplier').getValue();
		var supplier_name = Ext.getCmp('frm_sel_change_supplier').getRawValue();
		var category_id = Ext.getCmp('frm_sel_change_category').getValue();
		var category_name = Ext.getCmp('frm_sel_change_category').getRawValue();
		
		// Set Data
		record.set('qty', qty);
		record.set('i_purchase_price', purchase_price);
		record.set('cost', (purchase_price * qty));
		record.set('s_id', supplier_id);
		record.set('s_name', supplier_name);
		record.set('c_id', category_id);
		record.set('c_name', category_name);
		receiving_grid.getStore().commitChanges();

		Update_total_cost();
	}

	// Update Batch
	function Update_batch() {
		var records = receiving_grid.getSelectionModel().getSelection();
		var qty = Ext.getCmp('frm_batch_qty').getValue();
		var purchase_price = Ext.getCmp('frm_batch_purchase_price').getValue();
		var supplier_id = Ext.getCmp('frm_batch_sel_supplier').getValue();
		var supplier_name = Ext.getCmp('frm_batch_sel_supplier').getRawValue();
		var category_id = Ext.getCmp('frm_batch_sel_category').getValue();
		var category_name = Ext.getCmp('frm_batch_sel_category').getRawValue();

		if(qty != null || purchase_price != null || supplier_id != null || category_id != null) {
			Ext.each(records, function(rec) {
				if(qty != null) {
					rec.set('qty', qty);
				}
				if(purchase_price != null) {
					rec.set('i_purchase_price', purchase_price);
				}
				if(qty != null || purchase_price != null) {
					if(qty != null && purchase_price == null) {
						rec.set('cost', (rec.getData().i_purchase_price * qty));
					}
					if(qty == null && purchase_price != null) {
						rec.set('cost', (purchase_price * rec.getData().qty));
					}
					if(qty != null && purchase_price != null) {
						rec.set('cost', (purchase_price * qty));
					}
				}
				if(supplier_id != null) {
					rec.set('s_id', supplier_id);
					rec.set('s_name', supplier_name);
				}
				if(category_id != null) {
					rec.set('c_id', category_id);
					rec.set('c_name', category_name);
				}
			});
			receiving_grid.getStore().commitChanges();
			Update_total_cost();
		}
	}

	// Update Total Cost
	function Update_total_cost() {
		var get_total = Get_total();
		var total = renderer_currency_no_sign(get_total);
		Ext.getCmp('text_total').setText(total);
	}

	// View
	function View() {
		var r_id = '';
		var selected = grid.getSelectionModel().getSelection();
		var data = selected[0].getData();
		r_id = data.r_id

		Ext.Msg.wait('Generating Receiving Preview...', 'Please wait');
		Ext.Ajax.request({
			url: global_controller_url + 'get_receiving_items',
			method: 'POST',
			params: {
                r_id: r_id
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
                	var receiving_items = decode.receiving_items;
                	var store_information = decode.store_information;

                	// Get Items from rows
					var all_items = new Array();
					Ext.Array.each(receiving_items, function(data) {
						item_details = {
							id: data.i_id,
							name: data.i_name,
							attribute: data.i_attribute,
							purchase_price: data.rd_purchase_price,
							u_slug_name: data.u_slug_name,
							qty: data.rd_qty,
							cost: (parseFloat(data.rd_purchase_price) * parseFloat(data.rd_qty)),
							pod_id: data.pod_id
						};

						all_items.push(item_details);
					});

					// Initialize Tab Items
					var tab_items = [];

					// All Items HTML
					var receiving_html = '';
					var receiving_html_items = ''
					var receiving_total_cost = 0;
					Ext.Array.each(all_items, function(item_data, index) {
						receiving_html_items += '\
							<tr>\
								<td style="padding: 0px; line-height: 15px;">' + renderer_number(item_data.qty) + '</td>\
								<td style="padding: 0px; line-height: 15px;">' + item_data.u_slug_name + '</td>\
								<td style="padding: 0px; line-height: 15px;">' + item_data.name + '</td>\
								<td style="text-align: right; padding: 0px; line-height: 15px;">' + renderer_currency_no_sign(item_data.purchase_price) + '</td>\
								<td style="text-align: right; padding: 0px; line-height: 15px;">' + renderer_currency_no_sign(item_data.cost) + '</td>\
							</tr>\
						';
						receiving_total_cost += item_data.cost;
					});
					receiving_html = '\
						<div style="font-size: 12px; line-height: 15px; margin-top: 10px; text-align: center;">\
							<span style="font-size: 13px;"><strong>' + store_information.si_name + '</strong></span><br>\
							' + store_information.si_address + '<br>\
							' + store_information.si_telephone_no + '\
						</div>\
						<table class="table" style="margin-bottom: 0; font-size: 12px;">\
							<tr>\
								<td style="width: 70%; border-top: none; padding: 0px; line-height: 15px;">\
									Receiving Voucher #: ' + data.r_receiving_number + '<br>\
									Date: ' + renderer_datetime(data.r_date) + '\
								</td>\
								<td style="width: 30%; border-top: none; padding: 0px; line-height: 15px;">\
									Received by: ' + data.received_name + '<br>\
									PO #: ' + (data.po_purchase_order_number != null ? data.po_purchase_order_number : '') + '\
								</td>\
							</tr>\
						</table>\
						<table class="table table-bordered" style="margin-bottom: 0; font-size: 12px;">\
							<thead>\
								<td style="width: 7%; padding: 0px; text-align: center; line-height: 15px;">Qty</td>\
								<td style="width: 10%; padding: 0px; text-align: center; line-height: 15px;">Unit</td>\
								<td style="width: 53%; padding: 0px; text-align: center; line-height: 15px;">Item</td>\
								<td style="width: 15%; padding: 0px; text-align: center; line-height: 15px;">Price</td>\
								<td style="width: 15%; padding: 0px; text-align: center; line-height: 15px;">Cost</td>\
							</thead>\
							<tbody>\
								' + receiving_html_items + '\
							</tbody>\
						</table>\
						<table class="table" style="margin-bottom: 0; font-size: 12px;">\
							<tr>\
								<td style="width: 70%; border-top: none; padding: 0px; line-height: 15px;"></td>\
								<td style="width: 15%; border-top: none; padding: 0px; line-height: 15px;">Total Cost</td>\
								<td style="width: 15%; border-top: none; text-align: right; padding: 0px; line-height: 15px;">\
									' + renderer_currency(receiving_total_cost) + '\
								</td>\
							</tr>\
						</table>\
					';
					tab_items.push({
						title: 'Receiving Items',
						id: 'receivings_tab',
            			html: receiving_html,
            			bodyPadding: 5,
            			autoScroll: true
					});

					// Reset View Order Window
					view_receiving_tab_panel.removeAll();
					view_receiving_tab_panel.add(tab_items);
					view_receiving_tab_panel.setActiveTab(0);
					Ext.Msg.close();
					view_receiving_window_panel.setTitle('View Receiving # ' + data.r_receiving_number);
					view_receiving_window_panel.restore();
					view_receiving_window_panel.show();
					view_receiving_window_panel.center();
                }
			}
		});
	}

	// Print Contents
	function Print_contents() {
		Print_element(Ext.getCmp('receivings_tab'));
	}

	// Item Search
	function Item_search() {
		Ext.getCmp('frm_item_search').reset();
		item_search_grid.getStore().removeAll();
		item_search_window_panel.show();
		item_search_window_panel.center();
		Ext.getCmp('frm_item_search').focus();
	}
});