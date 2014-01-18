Ext.onReady(function() {
	/*
	 * INITIALIZE
	 */

	// Set Store
	var store = new Ext.data.Store({
	    fields: ['a_id', 'a_adjustment_number', 'a_date', 'a_status', 'a_adjusted_by', 'adjusted_name'],
	    pageSize: global_page_size,
	    autoLoad: true,
	    proxy: {
	        type: 'ajax',
	        url: global_controller_url + 'get_adjustments',
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

	var adjust_store = new Ext.data.Store({
	    fields: ['i_id', 'i_name', 'i_attribute', 'u_slug_name', 'c_name', 'qty', 's_name']
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
		// pageSize: order_taking_page_size
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
	    },
	    listeners: {
	    	load: function() {
	    		Ext.getCmp('frm_sel_category').setValue('all');
	    	}
	    }
	});

	// Set Top Bar
	var top_bar = [
		{
			xtype: 'button',
			text: 'New Adjustment',
			id: 'btn_receive',
			iconCls: 'extjs-icon-add',
			iconAlign: 'left',
			handler: function() {
				New_adjust();
			}
		},
		{
			xtype: 'button',
			text: 'Void Adjustment',
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

	var adjust_top_bar = [
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
					combo.clearValue();
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

	// Set Grid
	var grid = new Ext.grid.Panel({
	    renderTo: 'grid-container',
	    store: store,
	    title: '<span class="lead">Adjustments</span>',
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
	            text: 'Adjustment #',
	            width: 100,
	            dataIndex: 'a_adjustment_number',
	            tdCls: 'extjs-bold-text'
	        },
	        {
	            text: 'Status',
	            width: 120,
	            dataIndex: 'a_status',
	            tdCls: 'extjs-bold-text',
	            renderer: renderer_status
	        },
	        {
	            text: 'Adjusted By',
	            width: 150,
	            dataIndex: 'adjusted_name'
	        },
	        {
	            text: 'Adjustment Date',
	            width: 170,
	            dataIndex: 'a_date',
	            renderer: renderer_datetime
	        }
	    ],
	    listeners: {
	    	selectionchange: function(grid, selected) {
	    		if(selected.length > 0) {
	    			selected = selected[0];
		    		var data = selected.getData();
		    		if(data.a_status == 'P') {
		    			Ext.getCmp('btn_void').enable();
		    		} else {
		    			Ext.getCmp('btn_void').disable();
		    		}
	    		}
	    	}
	    }
	});

	var adjust_grid = new Ext.grid.Panel({
		title: 'Select Items to Adjust',
	    store: adjust_store,
	    width: '100%',
	    height: 500,
	    columnLines: true,
	    tbar: adjust_top_bar,
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
						tooltip: 'Update Qty',
						handler: function () {
							Ext.getCmp('qty_form').getForm().reset();

							var rec = adjust_grid.getSelectionModel().getSelection();
							var data = rec[0].getData();
							Ext.getCmp('frm_qty').setValue(data.qty);

							qty_window_panel.show();
							qty_window_panel.center();
						}
					},
					{
						iconCls: 'extjs-icon-delete pull-right',
						tooltip: 'Remove',
						handler: function () {
							adjust_grid.getStore().remove(adjust_grid.getSelectionModel().getSelection());
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
	            text: 'Qty',
	            width: 75,
	            dataIndex: 'qty',
	            align: 'center',
	            tdCls: 'extjs-bold-text',
	            renderer: renderer_positive_negative_number,
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
	        },
	        {
	            text: 'Supplier',
	            width: 120,
	            dataIndex: 's_name',
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
	var qty_form_panel = new Ext.form.Panel({
        id: 'qty_form',
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
                maxValue: 9999,
                listeners: {
                	blur: function(me) {
                		if(me.getValue() == null) {
                			me.setValue(0);
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
	    			qty_window_panel.close();
	    		}
	    	},
	    	{
	    		text: 'Update',
	    		formBind: true,
	    		iconCls: 'extjs-icon-save',
	    		handler: function() {
	    			Update_qty();
	    		}
	    	}
	    ]
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
	    items: [adjust_grid],
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
				text: 'Adjust Only',
				iconCls: 'extjs-icon-receive-items-large',
				scale: 'large',
				handler: function() {
					Adjust(false);
				}
			},
			{
				xtype: 'button',
				text: 'Print & Adjust',
				iconCls: 'extjs-icon-print-large',
				scale: 'large',
				handler: function() {
					Adjust(true);
				}
			}
		],
	    listeners: {
	    	show: function() {
	    		Ext.getCmp('frm_sel_item').getStore().reload();
	    	}
	    }
	});

	var qty_window_panel = new Ext.window.Window({
		title: 'Qty',
		height: 150,
		width: 250,
		iconCls: 'extjs-icon-edit ',
		layout: 'fit',
		closeAction: 'hide',
		modal: true,
		closable: false,
		resizable: false,
		items: [qty_form_panel]
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

	// New Adjust
	function New_adjust() {
		adjust_grid.getStore().removeAll();
		window_panel.setTitle('New Adjustment');
		window_panel.restore();
		window_panel.show();
		window_panel.center();

		Ext.getCmp('frm_sel_category').reset();
		Ext.getCmp('frm_sel_category').focus();
	}

	// Void
	function Void() {
		var a_id = '';
		var selected = grid.getSelectionModel().getSelection();
		var data = selected[0].getData();
		a_id = data.a_id

		Ext.MessageBox.show({
			title:'Confirmation',
			msg: 'Are you sure to <strong class="text-error">Void</strong> Adjustment # <strong>' + data.a_adjustment_number + '</strong>? This cannot be undone',
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
			                a_id: a_id
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
		// if(Ext.getCmp('frm_sel_supplier').getValue() == null) {
		// 	Ext.Msg.show({
		// 		title:'Information',
		// 		msg: 'Please select a Supplier',
		// 		buttons: Ext.Msg.OK,
		// 		icon: Ext.Msg.WARNING,
		// 		closable: false
		// 	});
		// 	return false;
		// }

		// Check if there are entered Adjustment Items
		if(adjust_grid.getStore().count() == 0) {
			Ext.Msg.show({
				title:'Information',
				msg: 'Please select Adjustment Items',
				buttons: Ext.Msg.OK,
				icon: Ext.Msg.WARNING,
				closable: false
			});
			return false;
		}

		// Check if there are Adjustment Items whose Qty is Zero(0)
		var has_zero = false;
		adjust_grid.getStore().each(function(record) {
			var data = record.getData();

			if(data.qty == 0) {
				has_zero = true;
				return false;
			}
		});
		if(has_zero == true) {
			Ext.Msg.show({
				title:'Information',
				msg: 'Some Adjustment Items has Zero(0) Qty. Please enter non-zero Qty',
				buttons: Ext.Msg.OK,
				icon: Ext.Msg.WARNING,
				closable: false
			});
			return false;
		}

		return true;
	}

	// Adjust
	function Adjust(print) {
		if(Validate() == true) {
			Ext.Msg.wait('Adjusting Items...', 'Please wait');
			var items = [];
			adjust_grid.getStore().each(function(record) {
				var data = record.getData();
				var items_details = {
					id: data.i_id,
					name: data.i_name,
					attribute: data.i_attribute,
					u_slug_name: data.u_slug_name,
					qty: data.qty
				};
				items.push(items_details);
			});

			Ext.Ajax.request({
				url: global_controller_url + 'save',
				method: 'POST',
				params: {
					items: Ext.JSON.encode(items)
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
						var adjust = decode.adjust;

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
										Ext.Msg.wait('Creating Adjustment Voucher...', 'Please wait');

										// All Items HTML
										var adjust_html = '';
										var adjust_html_items = ''
										var adjust_total_cost = 0;
										Ext.Array.each(items, function(item_data, index) {
											adjust_html_items += '\
												<tr>\
													<td style="padding: 3px;">' + renderer_positive_negative_number_no_design(item_data.qty) + '</td>\
													<td style="padding: 3px;">' + item_data.u_slug_name + '</td>\
													<td style="padding: 3px;">' + item_data.name + (item_data.attribute != '' ? '-' + item_data.attribute : '') + '</td>\
												</tr>\
											';
											adjust_total_cost += item_data.cost;
										});
										adjust_html = '\
											<div class="extjs-align-center">\
												' + store_information.si_name + '<br>\
												' + store_information.si_address + '<br>\
												' + store_information.si_telephone_no + '\
											</div>\
											<br>\
											<table class="table" style="margin-bottom: 0; font-size: 13px;">\
												<tr>\
													<td style="width: 60%; border-top: none; padding: 3px;">\
														<strong>Adjustment Voucher #:</strong> ' + adjust.a_adjustment_number + '<br>\
														Date: ' + renderer_datetime(adjust.a_date) + '\
													</td>\
													<td style="width: 40%; border-top: none; padding: 3px;">\
														Adjusted by: ' + adjust.adjusted_name + '\
													</td>\
												</tr>\
											</table>\
											<table class="table table-bordered" style="margin-bottom: 0; font-size: 13px;">\
												<thead>\
													<th style="width: 15%; padding: 3px;">Qty</th>\
													<th style="width: 15%; padding: 3px;">Unit</th>\
													<th style="width: 70%; padding: 3px;">Item</th>\
												</thead>\
												<tbody>\
													' + adjust_html_items + '\
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
										Print_html(adjust_html);
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
		for(var i = 0; i < adjust_grid.getStore().count(); i++) {
			if(adjust_grid.getStore().getAt(i).getData().i_id == item_id) {
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
				u_slug_name: data.unit_slug_name,
				c_name: data.category_name,
				s_name: data.supplier_name,
				qty: 0
			};

			// Add item
			var rec = adjust_grid.getStore().add(item_data);
			adjust_grid.getSelectionModel().select(rec);
		}
	}

	// Update Qty
	function Update_qty() {
		var record = adjust_grid.getSelectionModel().getSelection();
		var record = record[0];
		var qty = Ext.getCmp('frm_qty').getValue();
		
		if(qty == 0) {
			Ext.Msg.show({
				title:'Information',
				msg: 'Zero is not allowed. Please enter a non-zero number',
				buttons: Ext.Msg.OK,
				icon: Ext.Msg.WARNING,
				closable: false
			});
			return;
		}

		// Set Data
		record.set('qty', qty);
		adjust_grid.getStore().commitChanges();
		qty_window_panel.close();
	}

	// Get Item Store Data
	function Get_item_store_data() {
		adjust_grid.setLoading(true);
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
            		adjust_grid.setLoading(false);
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
                	adjust_grid.setLoading(false);
                }
            }
		});
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
