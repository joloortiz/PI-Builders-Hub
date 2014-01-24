Ext.onReady(function() {
	/*
	 * INITIALIZE
	 */

	// Set Store
	var store = new Ext.data.Store({
	    fields: ['o_id', 'o_order_number', 'o_date', 'o_amount_tendered', 'o_attended_by', 'attended_name', 'total', 'change', 'changed_order'],
	    pageSize: global_page_size,
	    autoLoad: true,
	    proxy: {
	        type: 'ajax',
	        url: global_controller_url + 'get_orders',
	        reader: {
	            type: 'json',
	            root: 'data',
	            totalProperty: 'total'
	        }
	    },
	    listeners: {
	    	beforeload: function(store) {
		    	store.getProxy().extraParams.query = Ext.getCmp('search-text').getValue().trim();
		    	store.getProxy().extraParams.show_changed = Ext.getCmp('show-changed').getValue();
		    }
	    }
	});

	var ordered_items_store = new Ext.data.Store({
	    fields: ['i_id', 'item_display_name', 'od_id', 'od_qty', 'od_selling_price', 'od_purchase_price', 'od_discount', 'od_vat', 'subtotal', 'change_qty'],
		proxy: {
	        type: 'ajax',
	        url: global_controller_url + 'get_ordered_items',
	        reader: {
	            type: 'json',
	            root: 'data'
	        }
	    },
	    listeners: {
	    	beforeload: function(item_store) {
	    		var selected = grid.getSelectionModel().getSelection();
				var data = selected[0].getData();
		    	ordered_items_store.getProxy().extraParams.o_id = data.o_id;
		    }
	    }
	});

	var order_taking_store = new Ext.data.Store({
	    fields: ['i_id', 'i_name', 'i_attribute', 'i_selling_price', 'i_purchase_price', 'i_vat', 'u_slug_name', 'c_name', 'qty', 'discount', 'subtotal']
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
		// ,
		// pageSize: global_page_size
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
	    		// Ext.getCmp('frm_sel_category').setValue('all');
	    		// Ext.getCmp('frm_sel_item').getStore().reload();
	    		// Get_item_store_data();
	    	}
	    }
	});

	// Set Selection Model
	var ordered_items_sel_model = new Ext.selection.CheckboxModel({
		checkOnly: true,
		listeners: {
			beforeselect: function(sel_model, record) {
				// Cancel select if column is Change Qty
				if(ordered_items_editor_plugin.activeColumn) {
					if(ordered_items_editor_plugin.activeColumn.dataIndex == 'change_qty') {
						return false;
					}
				}
			},
			beforedeselect: function(sel_model, record) {
				// Cancel deselect if record is selected and if column is Change Qty
				if(ordered_items_editor_plugin.activeColumn) {
					if(ordered_items_editor_plugin.activeColumn.dataIndex == 'change_qty' && sel_model.isSelected(record) == true) {
						return false;
					}
				}
			},
			deselect: function(sel_model, record) {
				// Remove Change Qty value is record is deselected
				record.set('change_qty', '');
				ordered_items_grid.getStore().commitChanges();
			}
		}
	});

	// Set Top Bar
	var top_bar = [
		{
			xtype: 'button',
			text: 'Change Order',
			id: 'btn_change',
			iconCls: 'extjs-icon-edit',
			iconAlign: 'left',
			handler: function() {
				if(grid.getSelectionModel().hasSelection()) {
					Change_order_initialize();
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
			text: 'View Change Order',
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
			xtype: 'checkbox',
			boxLabel: 'Show Changed Orders',
			id: 'show-changed',
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

	var order_taking_top_bar = [
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
			// pageSize: global_page_size,
			listConfig: {
				emptyText: 'No Items found.',
				maxHeight: 400,
				getInnerTpl: function() {
					return '<table class="table table-bordered" style="margin-bottom: 0;">' +
								'<tr>' +
									'<td style="padding: 0px;" colspan="2">' + 
										'<strong>{item_display_name}</strong>' +
										'<span class="pull-right">' +
											'Qty on Hand: ' +
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
			// ,
			// doQuery: function(queryString, forceAll) {
			// 	// this.expand();
			// 	// this.store.clearFilter(!forceAll);

			// 	// if(this.queryMode == 'local') {
			// 	// 	this.store.reload({
			// 	// 		params: this.getParams(queryString)
			// 	// 	});
			// 	// }
			// 	// if (!forceAll) {
			// 	// 	this.store.filter(this.displayField, new RegExp(Ext.String.escapeRegex(queryString), 'i'));
			// 	// }

			// 	this.store.clearFilter(true);
			// 	this.store.reload({
			// 		params: this.getParams(queryString)
			// 	});
			// 	this.store.filter(this.displayField, new RegExp(Ext.String.escapeRegex(queryString), 'i'));
			// 	console.log(this.store.count(), queryString);
			// }
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
	var panel_bottom_bar = [
		{
			xtype: 'text',
            text: 'Amount Tendered:',
            cls: 'lead'
		},
		{
			xtype: 'numberfield',
			id: 'frm_amount_tendered',
			fieldCls: 'lead lead-no-mb extjs-align-right',
			maxLength: 10,
			minValue: 0,
			value: 0,
			enforceMaxLength: true
		},
		'->',
		{
			xtype: 'text',
            text: 'Total:',
            cls: 'lead'
		},
		{
			xtype: 'text',
			id: 'text_total',
            cls: 'lead extjs-bold-text'
		}
	];

	// Set Editor Plugin
	var ordered_items_editor_plugin = new Ext.grid.plugin.CellEditing({
		clicksToEdit: 1,
		listeners: {
			beforeedit: function(editor, e) {
				// Cancel edit if row is not selected
				var record = e.record;
				var grid = e.grid;
				if(grid.getSelectionModel().isSelected(record) == false) {
					return false;
				}
			},
			validateedit: function(editor, e) {
				var data = e.record.getData();
				var qty = parseFloat(data.od_qty);
				if(e.value > qty) {
					e.cancel = true;
					e.record.data[e.field] = qty;
					e.record.commit();
				}
			},
			edit: function(editor, e) {
				e.record.commit();
				Update_total();	
			}
		}
	});

	// Set Grid
	var grid = new Ext.grid.Panel({
	    renderTo: 'grid-container',
	    store: store,
	    title: '<span class="lead">Change Order</span>',
	    width: '100%',
	    height: 500,
	    columnLines: true,
	    iconCls: 'extjs-icon-change-order',
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
	            text: 'Order #',
	            width: 60,
	            dataIndex: 'o_order_number',
	            tdCls: 'extjs-bold-text',
	            align: 'center'
	        },
	        {
	            text: 'Total',
	            width: 150,
	            dataIndex: 'total',
	            tdCls: 'extjs-bold-text text-info',
	            align: 'right',
	            renderer: renderer_currency
	        },
	        {
	            text: 'Amount Tendered',
	            width: 150,
	            dataIndex: 'o_amount_tendered',
	            tdCls: 'extjs-bold-text text-success',
	            align: 'right',
	            renderer: renderer_currency
	        },
	        {
	            text: 'Change/Credit',
	            width: 150,
	            dataIndex: 'change',
	            tdCls: 'extjs-bold-text',
	            align: 'right',
	            renderer: renderer_change_credit
	        },
	        {
	            text: 'Attended By',
	            width: 150,
	            dataIndex: 'attended_name'
	        },
	        {
	            text: 'Order Date',
	            width: 170,
	            dataIndex: 'o_date',
	            renderer: renderer_datetime
	        },
	        {
	            text: 'Changed Order',
	            width: 120,
	            dataIndex: 'changed_order',
	            align: 'center',
	            hidden: true,
	            hideable: false,
	            renderer: renderer_yes_no_negative
	        }
	    ],
	    listeners: {
	    	selectionchange: function(grid, selected) {
	    		if(selected.length > 0) {
	    			selected = selected[0];
		    		var data = selected.getData();
		    		if(data.changed_order == '0') {
		    			Ext.getCmp('btn_change').enable();
		    			Ext.getCmp('btn_view').disable();
		    			
		    			if(parseFloat(data.o_amount_tendered) < parseFloat(data.total)) {
		    				Ext.getCmp('btn_change').disable();
		    			}
		    		} else {
		    			Ext.getCmp('btn_change').disable();
		    			Ext.getCmp('btn_view').enable();
		    		}
	    		}
	    	}
	    }
	});

	var ordered_items_grid = new Ext.grid.Panel({
	    store: ordered_items_store,
	    width: '100%',
	    columnLines: true,
	    selModel: ordered_items_sel_model,
	    plugins: [ordered_items_editor_plugin],
	    columns: [
	        {
	        	text: 'Qty Change',
	        	width: 90,
	        	dataIndex: 'change_qty',
	        	tdCls: 'extjs-td-success',
	        	editor: {
	        		xtype: 'numberfield',
	        		id: 'frm_change_qty',
	        		minValue: 0.01,
	        		listeners: {
	        			change: function(field, new_value) {

	        			}
	        		}
	        	}
	        },
	        {
	            text: 'Item',
	            width: 200,
	            dataIndex: 'item_display_name'
	        },
	        {
	            text: 'Qty',
	            width: 50,
	            dataIndex: 'od_qty',
	            renderer: renderer_number
	        },
	        {
	            text: 'Price',
	            width: 100,
	            dataIndex: 'od_selling_price',
	            align: 'right',
	            tdCls: 'extjs-bold-text text-success',
	            renderer: renderer_currency
	        },
	        {
	            text: 'Subtotal',
	            width: 100,
	            dataIndex: 'subtotal',
	            align: 'right',
	            tdCls: 'extjs-bold-text text-info',
	            renderer: renderer_currency
	        }
	    ],
	    viewConfig: {
	        stripeRows: false
	    }
	});

	var order_taking_grid = new Ext.grid.Panel({
	    store: order_taking_store,
	    width: '100%',
	    columnLines: true,
	    tbar: order_taking_top_bar,
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
						tooltip: 'Update Qty/Discount',
						handler: function () {
							Ext.getCmp('qty_discount_form').getForm().reset();

					    	var rec = order_taking_grid.getSelectionModel().getSelection();
					    	var data = rec[0].getData();
					    	Ext.getCmp('frm_qty').setValue(data.qty);
					    	Ext.getCmp('frm_discount').setValue(data.discount);
					    	Ext.getCmp('frm_discount').setMaxValue(data.i_purchase_price);

					    	qty_discount_window_panel.show();
							qty_discount_window_panel.center();
						}
					},
					{
						iconCls: 'extjs-icon-delete pull-right',
						tooltip: 'Remove',
						handler: function () {
							order_taking_grid.getStore().remove(order_taking_grid.getSelectionModel().getSelection());
					    	Update_total();
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
	            draggable: false
	        },
	        {
	            text: 'Category',
	            width: 120,
	            dataIndex: 'c_name',
	            sortable: false,
	            draggable: false
	        },
	        {
	            text: 'Subtotal',
	            width: 100,
	            dataIndex: 'subtotal',
	            align: 'right',
	            tdCls: 'extjs-bold-text text-info',
	            renderer: renderer_currency,
	            sortable: false,
	            draggable: false
	        },
	        {
	            text: 'Qty',
	            width: 75,
	            dataIndex: 'qty',
	            align: 'center',
	            renderer: renderer_number,
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
	            text: 'Selling Price',
	            width: 120,
	            dataIndex: 'i_selling_price',
	            align: 'right',
	            tdCls: 'extjs-bold-text text-success',
	            renderer: renderer_currency,
	            sortable: false,
	            draggable: false
	        },
	        {
	            text: 'Purchase Price',
	            width: 120,
	            dataIndex: 'i_purchase_price',
	            align: 'right',
	            renderer: renderer_currency,
	            sortable: false,
	            draggable: false
	        },
	        {
	            text: 'VAT',
	            width: 60,
	            dataIndex: 'i_vat',
	            align: 'center',
	            renderer: renderer_yes_no_negative,
	            sortable: false,
	            draggable: false
	        },
	        {
	            text: 'Discount',
	            width: 100,
	            dataIndex: 'discount',
	            align: 'right',
	            renderer: renderer_currency,
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
	var qty_discount_form_panel = new Ext.form.Panel({
        id: 'qty_discount_form',
    	bodyPadding: 10,
    	defaults: {
            anchor: '100%'
        },
        fieldDefaults: {
            msgTarget: 'side',
            labelWidth: 60
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
                fieldLabel: 'Discount',
                id: 'frm_discount',
                name: 'frm_discount',
                fieldCls: 'extjs-align-right',
                maxLength: 10,
                minValue: 0
            }
        ],
    	buttons: [
	    	{
	    		text: 'Cancel',
	    		iconCls: 'extjs-icon-cancel',
	    		handler: function() {
	    			qty_discount_window_panel.close();
	    		}
	    	},
	    	{
	    		text: 'Update',
	    		formBind: true,
	    		iconCls: 'extjs-icon-save',
	    		handler: function() {
	    			Update_qty_discount();
	    			qty_discount_window_panel.close();
	    		}
	    	}
	    ]
    });

	// Set Tab Panel
	var view_change_order_tab_panel = new Ext.tab.Panel({
		width: '100%',
		activeTab: 0,
		plain: true,
		deferredRender: false
	});

	// Set Window panel
	var window_panel = new Ext.window.Window({
		height: 500,
		width: 1000,
		iconCls: 'extjs-icon-edit',
		closeAction: 'hide',
		layout: 'fit',
		closeAction: 'hide',
		modal: true,
		resizable: false,
		closable: false,
		maximizable: true,
		bodyPadding: 5,
	    items: [
	    	{
	    		xtype: 'panel',
	    		bbar: panel_bottom_bar,
	    		layout: {
					type: 'hbox',
					pack: 'start',
					align: 'stretch'
				},
				items: [
					{
						title: 'Ordered Items',
						width: 400,
						layout: 'fit',
						padding: '0 5 0 0',
						items: [ordered_items_grid]
			    	},
			    	{
						title: 'Items to Change to Ordered Items',
						flex: 1,
						layout: 'fit',
						items: [order_taking_grid]
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
					window_panel.close();
					Ext.getCmp('frm_sel_item').getStore().removeAll();
				}
			},
			'->',
			{
				xtype: 'button',
				text: 'Change',
				iconCls: 'extjs-icon-edit-large',
				scale: 'large',
				handler: function() {
					Change(false);
				}
			},
			{
				xtype: 'button',
				text: 'Print & Change',
				iconCls: 'extjs-icon-print-large',
				scale: 'large',
				handler: function() {
					Change(true);
				}
			}
		],
	    listeners: {
	    	show: function() {
	    		ordered_items_grid.getStore().reload();
	    		Ext.getCmp('frm_sel_category').getStore().reload();
	    		Update_total();
	    	}
	    }
	});

	var view_change_order_window_panel = new Ext.window.Window({
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
		items: [view_change_order_tab_panel],
		bbar: [
			{
				xtype: 'button',
				text: 'Close',
				iconCls: 'extjs-icon-cancel-large',
				scale: 'large',
				handler: function() {
					view_change_order_window_panel.close();
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

	var qty_discount_window_panel = new Ext.window.Window({
		title: 'Qty/Discount',
		height: 150,
		width: 200,
		iconCls: 'extjs-icon-edit ',
		layout: 'fit',
		closeAction: 'hide',
		modal: true,
		closable: false,
		resizable: false,
		items: [qty_discount_form_panel]
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

	// Change Order Initialize
	function Change_order_initialize() {
		var selected = grid.getSelectionModel().getSelection();
		var data = selected[0].getData();

		Ext.getCmp('frm_amount_tendered').setValue(0);
		ordered_items_grid.getStore().removeAll();
		order_taking_grid.getStore().removeAll();
		Ext.getCmp('frm_sel_category').reset();

		window_panel.setTitle('Change Order - Order # ' + data.o_order_number);
		window_panel.restore();
		window_panel.show();
		window_panel.center();

		Ext.getCmp('frm_sel_category').focus();
	}

	// Validate
	function Validate() {
		// Check if there are selected Ordered Items
		if(ordered_items_grid.getSelectionModel().hasSelection() == false) {
			Ext.Msg.show({
				title:'Information',
				msg: 'Please select Ordered Items to be changed',
				buttons: Ext.Msg.OK,
				icon: Ext.Msg.WARNING,
				closable: false
			});
			return false;
		}

		// Check if selected Ordered Items has Qty Changed value
		var empty = false;
		Ext.Array.each(ordered_items_grid.getSelectionModel().getSelection(), function(record) {
			var data = record.getData();
			if(data.change_qty == '') {
				empty = true;
			}
		});
		if(empty == true) {
			Ext.Msg.show({
				title:'Information',
				msg: 'Please enter Qty to be Changed on selected Ordered Items',
				buttons: Ext.Msg.OK,
				icon: Ext.Msg.WARNING,
				closable: false
			});
			return false;
		}

		// Check if there are Items in the Order Taking
		if(order_taking_grid.getStore().count() == 0) {
			Ext.Msg.show({
				title:'Information',
				msg: 'Please select Items in Items to Change to Ordered Items',
				buttons: Ext.Msg.OK,
				icon: Ext.Msg.WARNING,
				closable: false
			});
			return false;
		}

		// Check Amount Tendered
		var amount_tendered = Ext.getCmp('frm_amount_tendered').getValue();
		var total = Get_total();
		if(amount_tendered < total) {
			Ext.Msg.show({
				title:'Information',
				msg: 'Amount Tendered is less than Total Amount',
				buttons: Ext.Msg.OK,
				icon: Ext.Msg.WARNING,
				closable: false
			});
			return;
		}

		return true;
	}

	// Change
	function Change(print) {
		if(Validate() == true) {
			Ext.Msg.wait('Changing Order...', 'Please wait');
			var total = Get_total();
			var amount_tendered = Ext.getCmp('frm_amount_tendered').getValue();

			// Get Order Id
			var selected = grid.getSelectionModel().getSelection();
			var data = selected[0].getData();
			var o_id = data.o_id;

			// Initialize Ordered Items
			var ordered_items = [];
			Ext.Array.each(ordered_items_grid.getSelectionModel().getSelection(), function(record) {
				var data = record.getData();
				var ordered_items_details = {
					od_id: data.od_id,
					id: data.i_id,
					selling_price: data.od_selling_price,
					purchase_price: data.od_purchase_price,
					discount: data.od_discount,
					qty: data.qty,
					change_qty: data.change_qty,
					vat: data.od_vat
				};
				ordered_items.push(ordered_items_details);
			});

			// Initialize Order Taking Items
			var order_taking_items = [];
			order_taking_grid.getStore().each(function(record) {
				var data = record.getData();
				order_taking_items_details = {
					id: data.i_id,
					selling_price: data.i_selling_price,
					purchase_price: data.i_purchase_price,
					discount: data.discount,
					qty: data.qty,
					vat: data.i_vat
				};
				order_taking_items.push(order_taking_items_details);
			});

			Ext.Ajax.request({
				url: global_controller_url + 'save',
				method: 'POST',
				params: {
					ordered_items: Ext.JSON.encode(ordered_items),
					order_taking_items: Ext.JSON.encode(order_taking_items),
					amount_tendered: Ext.getCmp('frm_amount_tendered').getValue(),
					total: total,
					o_id: o_id
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
						var change = 0;
						if(total < 0) {
							change = total * -1;
						} else {
							change = amount_tendered - total;
						}

						var change_order = decode.change_order;
						var change_order_items = decode.change_order_items;
						var store_information = decode.store_information;

						// Print
						if(print == true) {
							Ext.Msg.wait('Creating Change Order Voucher...', 'Please wait');

							// Get Items
							var items_returned = [],
							items_replaced = [];
							Ext.Array.each(change_order_items, function(data) {
								item_details = {
									id: data.i_id,
									name: data.i_name,
									attribute: data.i_attribute,
									selling_price: data.cod_selling_price,
									purchase_price: data.cod_purchase_price,
									u_slug_name: data.u_slug_name,
									qty: data.cod_qty,
									discount: data.cod_discount,
									subtotal: (parseFloat(data.cod_selling_price) * parseFloat(data.cod_qty)) - (parseFloat(data.cod_discount) * parseFloat(data.cod_qty))
								};
								if(data.cod_type == 'O') {
									items_returned.push(item_details);
								} else if(data.cod_type == 'N') {
									items_replaced.push(item_details);
								}
							});

							// Items Returned HTML
							var items_returned_html = '';
							var items_returned_html_items = ''
							var items_returned_total = 0;
							Ext.Array.each(items_returned, function(item_data, index) {
								items_returned_html_items += '\
									<tr>\
										<td style="padding: 0px; line-height: 15px;">' + renderer_number(item_data.qty) + '</td>\
										<td style="padding: 0px; line-height: 15px;">' + item_data.u_slug_name + '</td>\
										<td style="padding: 0px; line-height: 15px;">' + item_data.name + '</td>\
										<td style="text-align: right; padding: 0px; line-height: 15px;">' + renderer_currency_no_sign(item_data.selling_price) + '</td>\
										<td style="text-align: right; padding: 0px; line-height: 15px;">' + renderer_currency_no_sign(item_data.subtotal) + '</td>\
									</tr>\
								';
								items_returned_total += item_data.subtotal;
							});

							// Items Replaced HTML
							var items_replaced_html = '';
							var items_replaced_html_items = ''
							var items_replaced_total = 0;
							Ext.Array.each(items_replaced, function(item_data, index) {
								items_replaced_html_items += '\
									<tr>\
										<td style="padding: 0px; line-height: 15px;">' + renderer_number(item_data.qty) + '</td>\
										<td style="padding: 0px; line-height: 15px;">' + item_data.u_slug_name + '</td>\
										<td style="padding: 0px; line-height: 15px;">' + item_data.name + '</td>\
										<td style="text-align: right; padding: 0px; line-height: 15px;">' + renderer_currency_no_sign(item_data.selling_price) + '</td>\
										<td style="text-align: right; padding: 0px; line-height: 15px;">' + renderer_currency_no_sign(item_data.subtotal) + '</td>\
									</tr>\
								';
								items_replaced_total += item_data.subtotal;
							});

							// Change Order HTML
							var change_order_html = '';
							change_order_html = '\
								<div style="font-size: 12px; line-height: 15px; margin-top: 10px; text-align: center;">\
									<span style="font-size: 13px;"><strong>' + store_information.si_name + '</strong></span><br>\
									' + store_information.si_address + '<br>\
									' + store_information.si_telephone_no + '\
								</div>\
								<table class="table" style="margin-bottom: 0; font-size: 12px;">\
									<tr>\
										<td style="width: 70%; border-top: none; padding: 0px; line-height: 15px;">\
											<strong>Change Order</strong><br>\
											PO #: ' + data.o_order_number + '<br>\
										</td>\
										<td style="width: 30%; border-top: none; padding: 0px; line-height: 15px;">\
											Date: ' + renderer_datetime(change_order.co_date) + '\
										</td>\
									</tr>\
								</table>\
								<span style="font-size: 12px;"><strong>Items Returned</strong></span>\
								<table class="table table-bordered" style="margin-bottom: 0; font-size: 12px;">\
									<thead>\
										<td style="width: 7%; padding: 0px; text-align: center; line-height: 15px;">Qty</td>\
										<td style="width: 10%; padding: 0px; text-align: center; line-height: 15px;">Unit</td>\
										<td style="width: 53%; padding: 0px; text-align: center; line-height: 15px;">Item</td>\
										<td style="width: 15%; padding: 0px; text-align: center; line-height: 15px;">Price</td>\
										<td style="width: 15%; padding: 0px; text-align: center; line-height: 15px;">Subtotal</td>\
									</thead>\
									<tbody>\
										' + items_returned_html_items + '\
									</tbody>\
								</table>\
								<span style="font-size: 12px;"><strong>Items Replaced</strong></span>\
								<table class="table table-bordered" style="margin-bottom: 0; font-size: 12px;">\
									<thead>\
										<td style="width: 7%; padding: 0px; text-align: center; line-height: 15px;">Qty</td>\
										<td style="width: 10%; padding: 0px; text-align: center; line-height: 15px;">Unit</td>\
										<td style="width: 53%; padding: 0px; text-align: center; line-height: 15px;">Item</td>\
										<td style="width: 15%; padding: 0px; text-align: center; line-height: 15px;">Price</td>\
										<td style="width: 15%; padding: 0px; text-align: center; line-height: 15px;">Subtotal</td>\
									</thead>\
									<tbody>\
										' + items_replaced_html_items + '\
									</tbody>\
								</table>\
								<table class="table" style="margin-bottom: 0; font-size: 12px;">\
									<tr>\
										<td style="width: 15%; border-top: none; padding: 0px; line-height: 15px;">Cash</td>\
										<td style="width: 15%; border-top: none; text-align: right; padding: 0px;">\
											' + renderer_currency(change_order.co_amount_tendered) + '\
										</td>\
										<td style="width: 40%; border-top: none; padding: 0px; line-height: 15px;"></td>\
										<td style="width: 15%; border-top: none; padding: 0px; line-height: 15px;">Total</td>\
										<td style="width: 15%; border-top: none; text-align: right; padding: 0px; line-height: 15px;">\
											' + (total < 0 ? '(' + (renderer_currency(total * -1)) + ')' : renderer_currency(total)) + '\
										</td>\
									</tr>\
									<tr>\
										<td style="width: 15%; border-top: none; padding: 0px; line-height: 15px;">Change</td>\
										<td style="width: 15%; border-top: none; text-align: right; padding: 0px; line-height: 15px;">\
											' + renderer_currency(change) + '\
										</td>\
										<td style="width: 40%; border-top: none; padding: 0px; line-height: 15px;"></td>\
										<td style="width: 15%; border-top: none; padding: 0px; line-height: 15px;"></td>\
										<td style="width: 15%; border-top: none; padding: 0px; line-height: 15px;"></td>\
									</tr>\
								</table>\
								<table class="table" style="margin-bottom: 0; font-size: 12px;">\
									<tr>\
										<td style="width: 30%; border-top: none; padding: 0px; line-height: 15px;">Received items in good condition</td>\
										<td style="width: 70%; border-top: none; padding: 0px; line-height: 15px;"></td>\
									</tr>\
								</table>\
								<table class="table" style="margin-bottom: 0; font-size: 12px;">\
									<tr>\
										<td style="width: 30%; border-top: none; padding: 0px; line-height: 15px;">Received by:</td>\
										<td style="width: 40%; border-top: none; padding: 0px; line-height: 15px;"></td>\
										<td style="width: 30%; border-top: none; padding: 0px; line-height: 15px;">Attended By:</td>\
									</tr>\
									<tr>\
										<td style="width: 30%; border-top: none; padding: 0px; line-height: 15px;">___________________</td>\
										<td style="width: 40%; border-top: none; padding: 0px; line-height: 15px;"></td>\
										<td style="width: 30%; border-top: none; padding: 0px; line-height: 15px;">\
											' + change_order.attended_name + '<br>___________________\
										</td>\
									</tr>\
								</table>\
							';

							// Print HTML
							Print_html(change_order_html);
							Ext.Msg.close();
							window_panel.close();
							grid.getStore().reload();
						} else {
							Ext.Msg.close();
							window_panel.close();
							grid.getStore().reload();
						}
					}
				}
			});
		}
	}

	// Add Item
	function Add_item(record) {
		var data = record.getData();

		// Check if Item is already added
		var is_existing = false;
		var item_id = data.item_id;
		for(var i = 0; i < order_taking_grid.getStore().count(); i++) {
			if(order_taking_grid.getStore().getAt(i).getData().i_id == item_id) {
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
				i_selling_price: data.item_selling_price,
				i_purchase_price: data.item_purchase_price,
				i_vat: data.item_vat,
				u_slug_name: data.unit_slug_name,
				c_name: data.category_name,
				qty: 1,
				discount: 0,
				subtotal: (1 * data.item_selling_price)
			};

			// Add item
			var rec = order_taking_grid.getStore().add(item_data);
			order_taking_grid.getSelectionModel().select(rec);
		}

		Update_total();
	}

	// Get Total
	function Get_total() {
		var total = 0;

		// Get Order Taking Total
		var order_taking_total = 0;
		for(var i = 0; i < order_taking_grid.getStore().count(); i++) {
			var data = order_taking_grid.getStore().getAt(i).getData();
			order_taking_total += data.subtotal;
		}

		// Get Ordered Items Total
		var ordered_items_total = 0;
		Ext.Array.each(ordered_items_grid.getSelectionModel().getSelection(), function(record) {
			var data = record.getData();
			if(data.change_qty != null && data.change_qty != '') {
				ordered_items_total += (parseFloat(data.change_qty) * parseFloat(data.od_selling_price)) - (parseFloat(data.change_qty) * parseFloat(data.od_discount));
			}
		});
		

		// Set Total, Order Taking Total - Ordered Items Total
		total = order_taking_total - ordered_items_total;

		return total;
	}

	// Update Qty/Discount
	function Update_qty_discount() {
		var record = order_taking_grid.getSelectionModel().getSelection();
		var record = record[0];
		var qty = Ext.getCmp('frm_qty').getValue();
		var discount = Ext.getCmp('frm_discount').getValue();
		var selling_price = record.getData().i_selling_price;
		
		// Set Data
		record.set('qty', qty);
		record.set('discount', discount);
		record.set('subtotal', ((selling_price * qty) - (discount * qty)));
		order_taking_grid.getStore().commitChanges();

		Update_total();
	}

	// Update Total
	function Update_total() {
		var get_total = Get_total();
		var total = renderer_currency_no_sign(get_total);
		Ext.getCmp('text_total').setText(total);
		if(get_total < 1) {
			Ext.getCmp('frm_amount_tendered').disable();
		} else {
			Ext.getCmp('frm_amount_tendered').enable();
		}
	}

	// Get Item Store Data
	function Get_item_store_data() {
		order_taking_grid.setLoading(true);
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
            		grid.setLoading(false);
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
					}
                	item_store.setProxy(proxy);
                	Ext.getCmp('frm_sel_item').expand();
                	item_store.reload();
                	order_taking_grid.setLoading(false);
                }
            }
		});
	}

	// View
	function View() {
		var o_id = '';
		var selected = grid.getSelectionModel().getSelection();
		var data = selected[0].getData();
		o_id = data.o_id

		Ext.Msg.wait('Generating Change Order Preview...', 'Please wait');
		Ext.Ajax.request({
			url: global_controller_url + 'get_change_order_items',
			method: 'POST',
			params: {
                o_id: o_id
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
                	var change_order = decode.change_order;
					var change_order_items = decode.change_order_items;
					var store_information = decode.store_information;

                	// Get Items
					var items_returned = [],
					items_replaced = [];
					Ext.Array.each(change_order_items, function(data) {
						item_details = {
							id: data.i_id,
							name: data.i_name,
							attribute: data.i_attribute,
							selling_price: data.cod_selling_price,
							purchase_price: data.cod_purchase_price,
							u_slug_name: data.u_slug_name,
							qty: data.cod_qty,
							discount: data.cod_discount,
							subtotal: (parseFloat(data.cod_selling_price) * parseFloat(data.cod_qty)) - (parseFloat(data.cod_discount) * parseFloat(data.cod_qty))
						};
						if(data.cod_type == 'O') {
							items_returned.push(item_details);
						} else if(data.cod_type == 'N') {
							items_replaced.push(item_details);
						}
					});

					// Items Returned HTML
					var items_returned_html = '';
					var items_returned_html_items = ''
					var items_returned_total = 0;
					Ext.Array.each(items_returned, function(item_data, index) {
						items_returned_html_items += '\
							<tr>\
								<td style="padding: 0px; line-height: 15px;">' + renderer_number(item_data.qty) + '</td>\
								<td style="padding: 0px; line-height: 15px;">' + item_data.u_slug_name + '</td>\
								<td style="padding: 0px; line-height: 15px;">' + item_data.name + '</td>\
								<td style="text-align: right; padding: 0px; line-height: 15px;">' + renderer_currency_no_sign(item_data.selling_price) + '</td>\
								<td style="text-align: right; padding: 0px; line-height: 15px;">' + renderer_currency_no_sign(item_data.subtotal) + '</td>\
							</tr>\
						';
						items_returned_total += item_data.subtotal;
					});

					// Items Replaced HTML
					var items_replaced_html = '';
					var items_replaced_html_items = ''
					var items_replaced_total = 0;
					Ext.Array.each(items_replaced, function(item_data, index) {
						items_replaced_html_items += '\
							<tr>\
								<td style="padding: 0px; line-height: 15px;">' + renderer_number(item_data.qty) + '</td>\
								<td style="padding: 0px; line-height: 15px;">' + item_data.u_slug_name + '</td>\
								<td style="padding: 0px; line-height: 15px;">' + item_data.name + '</td>\
								<td style="text-align: right; padding: 0px; line-height: 15px;">' + renderer_currency_no_sign(item_data.selling_price) + '</td>\
								<td style="text-align: right; padding: 0px; line-height: 15px;">' + renderer_currency_no_sign(item_data.subtotal) + '</td>\
							</tr>\
						';
						items_replaced_total += item_data.subtotal;
					});

					// Set Change
					var change = 0;
					if(change_order.co_amount_total < 0) {
						change = change_order.co_amount_total * -1;
					} else {
						change = change_order.co_amount_tendered - change_order.co_amount_total;
					}

					// Initialize Tab Items
					var tab_items = [];

					// Change Order HTML
					var change_order_html = '';
					change_order_html = '\
						<div style="font-size: 12px; line-height: 15px; margin-top: 10px; text-align: center;">\
							<span style="font-size: 13px;"><strong>' + store_information.si_name + '</strong></span><br>\
							' + store_information.si_address + '<br>\
							' + store_information.si_telephone_no + '\
						</div>\
						<table class="table" style="margin-bottom: 0; font-size: 12px;">\
							<tr>\
								<td style="width: 70%; border-top: none; padding: 0px; line-height: 15px;">\
									<strong>Change Order</strong><br>\
									PO #: ' + data.o_order_number + '<br>\
								</td>\
								<td style="width: 30%; border-top: none; padding: 0px; line-height: 15px;">\
									Date: ' + renderer_datetime(change_order.co_date) + '\
								</td>\
							</tr>\
						</table>\
						<span style="font-size: 12px;"><strong>Items Returned</strong></span>\
						<table class="table table-bordered" style="margin-bottom: 0; font-size: 12px;">\
							<thead>\
								<td style="width: 7%; padding: 0px; text-align: center; line-height: 15px;">Qty</td>\
								<td style="width: 10%; padding: 0px; text-align: center; line-height: 15px;">Unit</td>\
								<td style="width: 53%; padding: 0px; text-align: center; line-height: 15px;">Item</td>\
								<td style="width: 15%; padding: 0px; text-align: center; line-height: 15px;">Price</td>\
								<td style="width: 15%; padding: 0px; text-align: center; line-height: 15px;">Subtotal</td>\
							</thead>\
							<tbody>\
								' + items_returned_html_items + '\
							</tbody>\
						</table>\
						<span style="font-size: 12px;"><strong>Items Replaced</strong></span>\
						<table class="table table-bordered" style="margin-bottom: 0; font-size: 12px;">\
							<thead>\
								<td style="width: 7%; padding: 0px; text-align: center; line-height: 15px;">Qty</td>\
								<td style="width: 10%; padding: 0px; text-align: center; line-height: 15px;">Unit</td>\
								<td style="width: 53%; padding: 0px; text-align: center; line-height: 15px;">Item</td>\
								<td style="width: 15%; padding: 0px; text-align: center; line-height: 15px;">Price</td>\
								<td style="width: 15%; padding: 0px; text-align: center; line-height: 15px;">Subtotal</td>\
							</thead>\
							<tbody>\
								' + items_replaced_html_items + '\
							</tbody>\
						</table>\
						<table class="table" style="margin-bottom: 0; font-size: 12px;">\
							<tr>\
								<td style="width: 15%; border-top: none; padding: 0px; line-height: 15px;">Cash</td>\
								<td style="width: 15%; border-top: none; text-align: right; padding: 0px;">\
									' + renderer_currency(change_order.co_amount_tendered) + '\
								</td>\
								<td style="width: 40%; border-top: none; padding: 0px; line-height: 15px;"></td>\
								<td style="width: 15%; border-top: none; padding: 0px; line-height: 15px;">Total</td>\
								<td style="width: 15%; border-top: none; text-align: right; padding: 0px; line-height: 15px;">\
									' + (change_order.co_amount_total < 0 ? '(' + (renderer_currency(change_order.co_amount_total * -1)) + ')' : renderer_currency(change_order.co_amount_total)) + '\
								</td>\
							</tr>\
							<tr>\
								<td style="width: 15%; border-top: none; padding: 0px; line-height: 15px;">Change</td>\
								<td style="width: 15%; border-top: none; text-align: right; padding: 0px; line-height: 15px;">\
									' + renderer_currency(change) + '\
								</td>\
								<td style="width: 40%; border-top: none; padding: 0px; line-height: 15px;"></td>\
								<td style="width: 15%; border-top: none; padding: 0px; line-height: 15px;"></td>\
								<td style="width: 15%; border-top: none; padding: 0px; line-height: 15px;"></td>\
							</tr>\
						</table>\
						<table class="table" style="margin-bottom: 0; font-size: 12px;">\
							<tr>\
								<td style="width: 30%; border-top: none; padding: 0px; line-height: 15px;">Received items in good condition</td>\
								<td style="width: 70%; border-top: none; padding: 0px; line-height: 15px;"></td>\
							</tr>\
						</table>\
						<table class="table" style="margin-bottom: 0; font-size: 12px;">\
							<tr>\
								<td style="width: 30%; border-top: none; padding: 0px; line-height: 15px;">Received by:</td>\
								<td style="width: 40%; border-top: none; padding: 0px; line-height: 15px;"></td>\
								<td style="width: 30%; border-top: none; padding: 0px; line-height: 15px;">Attended By:</td>\
							</tr>\
							<tr>\
								<td style="width: 30%; border-top: none; padding: 0px; line-height: 15px;">___________________</td>\
								<td style="width: 40%; border-top: none; padding: 0px; line-height: 15px;"></td>\
								<td style="width: 30%; border-top: none; padding: 0px; line-height: 15px;">\
									' + change_order.attended_name + '<br>___________________\
								</td>\
							</tr>\
						</table>\
					';
					tab_items.push({
						title: 'Change Order Items',
						id: 'change_order_tab',
            			html: change_order_html,
            			bodyPadding: 5,
            			autoScroll: true
					});

					// Reset View Order Window
					view_change_order_tab_panel.removeAll();
					view_change_order_tab_panel.add(tab_items);
					view_change_order_tab_panel.setActiveTab(0);
					Ext.Msg.close();
					view_change_order_window_panel.setTitle('View Change Order of PO# ' + data.o_order_number);
					view_change_order_window_panel.restore();
					view_change_order_window_panel.show();
					view_change_order_window_panel.center();
                }
			}
		});
	}

	// Print Contents
	function Print_contents() {
		Print_element(Ext.getCmp('change_order_tab'));
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
