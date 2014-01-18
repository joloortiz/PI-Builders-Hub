Ext.onReady(function() {
	/*
	 * INITIALIZE
	 */

	// Set Store
	var store = new Ext.data.Store({
	    fields: ['rn_id', 'rn_return_number', 'rn_date', 'rn_status', 'rn_returned_by', 'returned_name', 'total_cost', 's_id', 's_name'],
	    pageSize: global_page_size,
	    autoLoad: true,
	    proxy: {
	        type: 'ajax',
	        url: global_controller_url + 'get_returns',
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

	var return_store = new Ext.data.Store({
	    fields: ['i_id', 'i_name', 'i_attribute', 'i_purchase_price', 'u_slug_name', 'c_name', 'qty', 'cost']
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
	    		Ext.getCmp('frm_sel_category').setValue('all');
	    	}
	    }
	});

	var supplier_store = new Ext.data.Store({
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

	// Set Top Bar
	var top_bar = [
		{
			xtype: 'button',
			text: 'New Return',
			id: 'btn_receive',
			iconCls: 'extjs-icon-add',
			iconAlign: 'left',
			handler: function() {
				New_return();
			}
		},
		{
			xtype: 'button',
			text: 'Void Return',
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
			text: 'View Return',
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
				change: function(checkbox, new_value, old_value) {
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

	var return_top_bar = [
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
            width: '40%',
            labelWidth: 60,
            forceSelection: true,
            value: 'All',
            listeners: {
            	select: function() {
            		if(Ext.getCmp('frm_sel_supplier').getValue() != null) {
            			Get_item_store_data();
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
			width: '60%',
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
		}
	];

	// Set Bottom Bar
	var return_bottom_bar = [
		'->',
		{
			xtype: 'text',
            text: 'Return Total Cost:',
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
	    title: '<span class="lead">Return Items</span>',
	    width: '100%',
	    height: 500,
	    columnLines: true,
	    iconCls: 'extjs-icon-return-items',
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
	            text: 'Return #',
	            width: 100,
	            dataIndex: 'rn_return_number',
	            tdCls: 'extjs-bold-text'
	        },
	        {
	            text: 'Status',
	            width: 120,
	            dataIndex: 'rn_status',
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
	            text: 'Returned By',
	            width: 150,
	            dataIndex: 'returned_name'
	        },
	        {
	            text: 'Return Date',
	            width: 170,
	            dataIndex: 'rn_date',
	            renderer: renderer_datetime
	        },
	        {
	            text: 'Supplier',
	            width: 150,
	            dataIndex: 's_name'
	        }
	    ],
	    listeners: {
	    	selectionchange: function(grid, selected) {
	    		if(selected.length > 0) {
	    			selected = selected[0];
		    		var data = selected.getData();
		    		if(data.rn_status == 'P') {
		    			Ext.getCmp('btn_void').enable();
		    		} else {
		    			Ext.getCmp('btn_void').disable();
		    		}
	    		}
	    	}
	    }
	});

	var return_grid = new Ext.grid.Panel({
		title: 'Select Items to Return',
	    store: return_store,
	    width: '100%',
	    height: 500,
	    columnLines: true,
	    tbar: return_top_bar,
	    bbar: return_bottom_bar,
	    dockedItems: [{
		    xtype: 'toolbar',
		    dock: 'top',
		    items: [
				{
	                xtype: 'combobox',
	                fieldLabel: 'Supplier',
	                afterLabelTextTpl: global_required,
	                id: 'frm_sel_supplier',
	                name: 'frm_sel_supplier',
	                store: supplier_store,
	                width: '40%',
	                labelWidth: 60,
	                valueField: 's_id',
	                displayField: 's_name',
	                triggerAction: 'all',
	                queryMode: 'local',
	                emptyText: 'Select Supplier',
	                allowBlank: false,
	                forceSelection: true,
		            listeners: {
		            	select: function() {
		            		return_grid.getStore().removeAll();
		            		Get_item_store_data();
		            	}
		            }
	            }
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
						handler: function () {
							Ext.getCmp('qty_purchase_price_form').getForm().reset();

							var rec = return_grid.getSelectionModel().getSelection();
							var data = rec[0].getData();
							Ext.getCmp('frm_qty').setValue(data.qty);
							Ext.getCmp('frm_purchase_price').setValue(data.i_purchase_price);

							qty_purchase_price_window_panel.show();
							qty_purchase_price_window_panel.center();
						}
					},
					{
						iconCls: 'extjs-icon-delete pull-right',
						tooltip: 'Remove',
						handler: function () {
							return_grid.getStore().remove(return_grid.getSelectionModel().getSelection());
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
            }
        ],
    	buttons: [
	    	{
	    		text: 'Cancel',
	    		iconCls: 'extjs-icon-cancel',
	    		handler: function() {
	    			qty_purchase_price_window_panel.close();
	    		}
	    	},
	    	{
	    		text: 'Update',
	    		formBind: true,
	    		iconCls: 'extjs-icon-save',
	    		handler: function() {
	    			Update_qty_purchase_price();
	    			qty_purchase_price_window_panel.close();
	    		}
	    	}
	    ]
    });

	// Set Tab Panel
	var view_return_tab_panel = new Ext.tab.Panel({
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
	    items: [return_grid],
		bbar: [
			{
				xtype: 'button',
				text: 'Cancel',
				iconCls: 'extjs-icon-cancel-large',
				scale: 'large',
				handler: function() {
					window_panel.close();
				}
			},
			'->',
			{
				xtype: 'button',
				text: 'Return Only',
				iconCls: 'extjs-icon-receive-items-large',
				scale: 'large',
				handler: function() {
					Return(false);
				}
			},
			{
				xtype: 'button',
				text: 'Print & Return',
				iconCls: 'extjs-icon-print-large',
				scale: 'large',
				handler: function() {
					Return(true);
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
		height: 150,
		width: 250,
		iconCls: 'extjs-icon-edit ',
		layout: 'fit',
		closeAction: 'hide',
		modal: true,
		closable: false,
		resizable: false,
		items: [qty_purchase_price_form_panel]
	});

	var view_return_window_panel = new Ext.window.Window({
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
		items: [view_return_tab_panel],
		bbar: [
			{
				xtype: 'button',
				text: 'Close',
				iconCls: 'extjs-icon-cancel-large',
				scale: 'large',
				handler: function() {
					view_return_window_panel.close();
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


	/*
	 * FUNCTIONS
	 */

	// New Return
	function New_return() {
		return_grid.getStore().removeAll();
		window_panel.setTitle('New Return');
		window_panel.restore();
		window_panel.show();
		window_panel.center();

		Ext.getCmp('frm_sel_supplier').reset();
		Ext.getCmp('frm_sel_supplier').focus();
		Update_total_cost();
	}

	// Void
	function Void() {
		var rn_id = '';
		var selected = grid.getSelectionModel().getSelection();
		var data = selected[0].getData();
		rn_id = data.rn_id

		Ext.MessageBox.show({
			title:'Confirmation',
			msg: 'Are you sure to <strong class="text-error">Void</strong> Return # <strong>' + data.rn_return_number + '</strong>? This cannot be undone',
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
			                rn_id: rn_id
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
		// Check if there is a Supplier selected
		if(Ext.getCmp('frm_sel_supplier').getValue() == null) {
			Ext.Msg.show({
				title:'Information',
				msg: 'Please select a Supplier',
				buttons: Ext.Msg.OK,
				icon: Ext.Msg.WARNING,
				closable: false
			});
			return false;
		}

		// Check if there are entered Return Items
		if(return_grid.getStore().count() == 0) {
			Ext.Msg.show({
				title:'Information',
				msg: 'Please select Return Items',
				buttons: Ext.Msg.OK,
				icon: Ext.Msg.WARNING,
				closable: false
			});
			return false;
		}

		return true;
	}

	// Return
	function Return(print) {
		if(Validate() == true) {
			Ext.Msg.wait('Returning Items...', 'Please wait');
			var items = [];
			return_grid.getStore().each(function(record) {
				var data = record.getData();
				var items_details = {
					id: data.i_id,
					name: data.i_name,
					attribute: data.i_attribute,
					purchase_price: data.i_purchase_price,
					u_slug_name: data.u_slug_name,
					qty: data.qty,
					cost: data.cost
				};
				items.push(items_details);
			});

			Ext.Ajax.request({
				url: global_controller_url + 'save',
				method: 'POST',
				params: {
					items: Ext.JSON.encode(items),
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
						var return_ = decode.return_;

						// Print
						if(print == true) {
							Ext.Msg.wait('Initializing...', 'Please wait');

							Ext.Ajax.request({
								url: global_controller_url + 'get_store_information',
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
										var store_information = decode.data;
										Ext.Msg.wait('Creating Return Voucher...', 'Please wait');

										// All Items HTML
										var return_html = '';
										var return_html_items = ''
										var return_total_cost = 0;
										Ext.Array.each(items, function(item_data, index) {
											return_html_items += '\
												<tr>\
													<td style="padding: 3px;">' + item_data.qty + '</td>\
													<td style="padding: 3px;">' + item_data.u_slug_name + '</td>\
													<td style="padding: 3px;">' + item_data.name + (item_data.attribute != '' ? '-' + item_data.attribute : '') + '</td>\
													<td style="text-align: right; padding: 3px;">' + renderer_currency_no_sign(item_data.purchase_price) + '</td>\
													<td style="text-align: right; padding: 3px;">' + renderer_currency_no_sign(item_data.cost) + '</td>\
												</tr>\
											';
											return_total_cost += item_data.cost;
										});
										return_html = '\
											<div class="extjs-align-center">\
												' + store_information.si_name + '<br>\
												' + store_information.si_address + '<br>\
												' + store_information.si_telephone_no + '\
											</div>\
											<br>\
											<table class="table" style="margin-bottom: 0; font-size: 13px;">\
												<tr>\
													<td style="width: 60%; border-top: none; padding: 3px;">\
														<strong>Return Voucher #:</strong> ' + return_.rn_return_number + '<br>\
														Date: ' + renderer_datetime(return_.rn_date) + '\
													</td>\
													<td style="width: 40%; border-top: none; padding: 3px;">\
														Returned by: ' + return_.returned_name + '\
													</td>\
												</tr>\
											</table>\
											<table class="table table-bordered" style="margin-bottom: 0; font-size: 13px;">\
												<thead>\
													<th style="width: 7%; padding: 3px;">Qty</th>\
													<th style="width: 10%; padding: 3px;">Unit</th>\
													<th style="width: 53%; padding: 3px;">Item</th>\
													<th style="width: 15%; padding: 3px; text-align: right;">Price</th>\
													<th style="width: 15%; padding: 3px; text-align: right;">Cost</th>\
												</thead>\
												<tbody>\
													' + return_html_items + '\
											</table>\
											<table class="table" style="margin-bottom: 0; font-size: 13px;">\
												<tr>\
													<td style="width: 70%; border-top: none; padding: 3px;"></td>\
													<td style="width: 15%; border-top: none; padding: 3px;"><strong>Total Cost</strong></td>\
													<td style="width: 15%; border-top: none; text-align: right; padding: 3px;">\
														<strong>' + renderer_currency(return_total_cost) + '</strong>\
													</td>\
												</tr>\
											</table>\
											<table class="table" style="margin-bottom: 0; font-size: 13px;">\
												<tr>\
													<td style="width: 50%; border-top: none; padding: 3px;"></td>\
													<td style="width: 50%; border-top: none; padding: 3px;">\
														<strong>Checked & Received by:</strong>\
													</td>\
												</tr>\
											</table>\
										';

										// Print HTML
										Print_html(return_html);
										Ext.Msg.close();
										window_panel.close();
										grid.getStore().reload();
									}
								}
							});
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
		for(var i = 0; i < return_grid.getStore().count(); i++) {
			if(return_grid.getStore().getAt(i).getData().i_id == item_id) {
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
				c_name: data.category_name,
				qty: 1,
				cost: (1 * data.item_purchase_price)
			};

			// Add item
			var rec = return_grid.getStore().add(item_data);
			return_grid.getSelectionModel().select(rec);
		}

		Update_total_cost();
	}

	// Get Total
	function Get_total() {
		var total = 0;
		for(var i = 0; i < return_grid.getStore().count(); i++) {
			var data = return_grid.getStore().getAt(i).getData();
			total += data.cost;	
		}

		return total;
	}

	// Get Item Store Data
	function Get_item_store_data() {
		return_grid.setLoading(true);
		item_store.removeAll();
		item_store.reload();
		Ext.Ajax.request({
			url: global_controller_url + 'get_items',
            method: 'POST',
            params: {
            	s_id: Ext.getCmp('frm_sel_supplier').getValue(),
            	c_id: Ext.getCmp('frm_sel_category').getValue()
            },
            success: function (response) {
            	var decode = Ext.JSON.decode(response.responseText);

            	if(decode.success == false) {
            		return_grid.setLoading(false);
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
                	item_store.reload();
                	Ext.getCmp('frm_sel_item').expand();
                	return_grid.setLoading(false);
                }
            }
		});
	}

	// Update Qty/Purchase Price
	function Update_qty_purchase_price() {
		var record = return_grid.getSelectionModel().getSelection();
		var record = record[0];
		var qty = Ext.getCmp('frm_qty').getValue();
		var purchase_price = Ext.getCmp('frm_purchase_price').getValue();
		
		// Set Data
		record.set('qty', qty);
		record.set('i_purchase_price', purchase_price);
		record.set('cost', (purchase_price * qty));
		return_grid.getStore().commitChanges();

		Update_total_cost();
	}

	// Update Total Cost
	function Update_total_cost() {
		var get_total = Get_total();
		var total = renderer_currency_no_sign(get_total);
		Ext.getCmp('text_total').setText(total);
	}

	// View
	function View() {
		var rn_id = '';
		var selected = grid.getSelectionModel().getSelection();
		var data = selected[0].getData();
		rn_id = data.rn_id

		Ext.Msg.wait('Generating Return Preview...', 'Please wait');
		Ext.Ajax.request({
			url: global_controller_url + 'get_return_items',
			method: 'POST',
			params: {
                rn_id: rn_id
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
                	var return_items = decode.return_items;
                	var store_information = decode.store_information;

                	// Get Items from rows
					var all_items = new Array();
					Ext.Array.each(return_items, function(data) {
						item_details = {
							id: data.i_id,
							name: data.i_name,
							attribute: data.i_attribute,
							purchase_price: data.rnd_purchase_price,
							u_slug_name: data.u_slug_name,
							qty: data.rnd_qty,
							cost: (parseFloat(data.rnd_purchase_price) * parseFloat(data.rnd_qty))
						};

						all_items.push(item_details);
					});

					// Initialize Tab Items
					var tab_items = [];

					// All Items HTML
					var return_html = '';
					var return_html_items = ''
					var return_total_cost = 0;
					Ext.Array.each(all_items, function(item_data, index) {
						return_html_items += '\
							<tr>\
								<td style="padding: 3px;">' + item_data.qty + '</td>\
								<td style="padding: 3px;">' + item_data.u_slug_name + '</td>\
								<td style="padding: 3px;">' + item_data.name + (item_data.attribute != '' ? '-' + item_data.attribute : '') + '</td>\
								<td style="text-align: right; padding: 3px;">' + renderer_currency_no_sign(item_data.purchase_price) + '</td>\
								<td style="text-align: right; padding: 3px;">' + renderer_currency_no_sign(item_data.cost) + '</td>\
							</tr>\
						';
						return_total_cost += item_data.cost;
					});
					return_html = '\
						<div class="extjs-align-center">\
							' + store_information.si_name + '<br>\
							' + store_information.si_address + '<br>\
							' + store_information.si_telephone_no + '\
						</div>\
						<br>\
						<table class="table" style="margin-bottom: 0; font-size: 13px;">\
							<tr>\
								<td style="width: 60%; border-top: none; padding: 3px;">\
									<strong>Return Voucher #:</strong> ' + data.rn_return_number + '<br>\
									Date: ' + renderer_datetime(data.rn_date) + '\
								</td>\
								<td style="width: 40%; border-top: none; padding: 3px;">\
									Returned by: ' + data.returned_name + '\
								</td>\
							</tr>\
						</table>\
						<table class="table table-bordered" style="margin-bottom: 0; font-size: 13px;">\
							<thead>\
								<th style="width: 7%; padding: 3px;">Qty</th>\
								<th style="width: 10%; padding: 3px;">Unit</th>\
								<th style="width: 53%; padding: 3px;">Item</th>\
								<th style="width: 15%; padding: 3px; text-align: right;">Price</th>\
								<th style="width: 15%; padding: 3px; text-align: right;">Cost</th>\
							</thead>\
							<tbody>\
								' + return_html_items + '\
						</table>\
						<table class="table" style="margin-bottom: 0; font-size: 13px;">\
							<tr>\
								<td style="width: 70%; border-top: none; padding: 3px;"></td>\
								<td style="width: 15%; border-top: none; padding: 3px;"><strong>Total Cost</strong></td>\
								<td style="width: 15%; border-top: none; text-align: right; padding: 3px;">\
									<strong>' + renderer_currency(return_total_cost) + '</strong>\
								</td>\
							</tr>\
						</table>\
						<table class="table" style="margin-bottom: 0; font-size: 13px;">\
							<tr>\
								<td style="width: 50%; border-top: none; padding: 3px;"></td>\
								<td style="width: 50%; border-top: none; padding: 3px;">\
									<strong>Checked & Received by:</strong>\
								</td>\
							</tr>\
						</table>\
					';
					tab_items.push({
						title: 'Return Items',
						id: 'returns_tab',
            			html: return_html,
            			bodyPadding: 5,
            			autoScroll: true
					});

					// Reset View Order Window
					view_return_tab_panel.removeAll();
					view_return_tab_panel.add(tab_items);
					view_return_tab_panel.setActiveTab(0);
					Ext.Msg.close();
					view_return_window_panel.setTitle('View Return # ' + data.rn_return_number);
					view_return_window_panel.restore();
					view_return_window_panel.show();
					view_return_window_panel.center();
                }
			}
		});
	}

	// Print Contents
	function Print_contents() {
		Print_element(Ext.getCmp('returns_tab'));
	}
});
