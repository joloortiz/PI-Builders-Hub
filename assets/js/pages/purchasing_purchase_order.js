Ext.onReady(function() {
	/*
	 * INITIALIZE
	 */

	var opt = '';
	 
	// Set Store
	var store = new Ext.data.Store({
	    fields: ['po_id', 'po_purchase_order_number', 'po_date', 'po_status', 'po_created_by', 'created_name', 's_id', 's_name', 'total_cost', 'has_receiving', 'is_deleted'],
	    pageSize: global_page_size,
	    autoLoad: true,
	    proxy: {
	        type: 'ajax',
	        url: global_controller_url + 'get_purchase_orders',
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
		    }
	    }
	});

	var status_store =  new Ext.data.Store({
	    fields: ['value', 'display'],
		data : [
			{value: 'all', display: 'All'},
			{value: 'O', display: 'Open'},
			{value: 'C', display: 'Closed'}
		]
	});

	var purchasing_store = new Ext.data.Store({
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
			text: 'Add',
			id: 'btn_add',
			iconCls: 'extjs-icon-add',
			iconAlign: 'left',
			handler: function() {
				Add();
			}
		},
		{
			xtype: 'button',
			text: 'Edit',
			id: 'btn_edit',
			iconCls: 'extjs-icon-edit',
			iconAlign: 'left',
			handler: function () {
				if(grid.getSelectionModel().hasSelection()) {
					Edit();
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
		{
			xtype: 'button',
			text: 'Delete',
			id: 'btn_delete',
			iconCls: 'extjs-icon-delete',
			iconAlign: 'left',
			handler: function () {
				if(grid.getSelectionModel().hasSelection()) {
					Delete();
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
		{
			xtype: 'button',
			text: 'Restore',
			id: 'btn_restore',
			iconCls: 'extjs-icon-restore',
			iconAlign: 'left',
			hidden: true,
			handler: function () {
				if(grid.getSelectionModel().hasSelection()) {
					Restore();
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

	var purchasing_top_bar = [
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
	var purchasing_bottom_bar = [
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
	    title: '<span class="lead">Purchase Order</span>',
	    width: '100%',
	    height: 500,
	    columnLines: true,
	    iconCls: 'extjs-icon-purchase-order',
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
	            text: 'PO #',
	            width: 50,
	            dataIndex: 'po_purchase_order_number',
	            tdCls: 'extjs-bold-text'
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
	        },
	        {
	            text: 'Created By',
	            width: 150,
	            dataIndex: 'created_name'
	        },
	        {
	            text: 'PO Date',
	            width: 170,
	            dataIndex: 'po_date',
	            renderer: renderer_datetime
	        },
	        {
	            text: 'Has Receivings',
	            width: 120,
	            dataIndex: 'has_receiving',
	            align: 'center',
	            renderer: renderer_yes_no_positive
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
	    ],
	    listeners: {
	    	selectionchange: function(grid, selected) {
	    		if(selected.length > 0) {
	    			selected = selected[0];
		    		var data = selected.getData();
		    		
		    		if(data.po_status == 'O' && data.has_receiving == '0') {
		    			Ext.getCmp('btn_edit').enable();
		    		} else {
		    			Ext.getCmp('btn_edit').disable();
		    		}

		    		if(data.is_deleted == '0') {
		    			Ext.getCmp('btn_delete').enable();
		    			Ext.getCmp('btn_restore').hide();
		    		} else {
		    			Ext.getCmp('btn_delete').disable();
		    			Ext.getCmp('btn_restore').show();
		    		}
	    		}
	    	}
	    }
	});

	var purchasing_grid = new Ext.grid.Panel({
		title: 'Select Items to Purchase',
	    store: purchasing_store,
	    width: '100%',
	    height: 500,
	    columnLines: true,
	    tbar: purchasing_top_bar,
	    bbar: purchasing_bottom_bar,
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
		            		purchasing_grid.getStore().removeAll();
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

							var rec = purchasing_grid.getSelectionModel().getSelection();
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
							purchasing_grid.getStore().remove(purchasing_grid.getSelectionModel().getSelection());
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

	// Set Window panel
	var window_panel = new Ext.window.Window({
	    height: 500,
		width: 800,
		layout: 'fit',
	    closeAction: 'hide',
	    modal: true,
	    closable: false,
	    resizable: false,
	    maximizable: true,
	    bodyPadding: 5,
	    items: [purchasing_grid],
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
				text: 'Save Only',
				iconCls: 'extjs-icon-save-large',
				scale: 'large',
				handler: function() {
					Save(false);
				}
			},
			{
				xtype: 'button',
				text: 'Print & Save',
				iconCls: 'extjs-icon-print-large',
				scale: 'large',
				handler: function() {
					Save(true);
				}
			}
		],
	    listeners: {
	    	show: function() {
	    		if(opt == 'add') {
	    			Ext.getCmp('frm_sel_category').getStore().reload();
	    		}
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


	/*
	 * FUNCTIONS
	 */

	// Add
	function Add() {
		opt = 'add';

		purchasing_grid.getStore().removeAll();
		window_panel.setTitle('Add Purchase Order');
		// window_panel.setIconCls('extjs-icon-add');
		window_panel.restore();
		window_panel.show();
		window_panel.center();

		Ext.getCmp('frm_sel_supplier').reset();
		Ext.getCmp('frm_sel_supplier').focus();
		Update_total_cost();
	}

	// Edit
	function Edit() {
		var selected = grid.getSelectionModel().getSelection();
		var data = selected[0].getData();
		opt = 'edit';

		window_panel.setTitle('Edit Purchase Order - ' + data.po_purchase_order_number);
		// window_panel.setIconCls('extjs-icon-edit');
		window_panel.restore();
		window_panel.show();
		window_panel.center();

		Ext.getCmp('frm_sel_supplier').setValue(data.s_id);
		Ext.getCmp('frm_sel_supplier').focus();
		Update_total_cost();

		Ext.Msg.wait('Getting Items...', 'Please wait');
		Ext.Ajax.request({
			url: global_controller_url + 'get_purchase_order_items',
			method: 'POST',
			params: {
				po_id: data.po_id
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
					var items = decode.data;
					
					purchasing_grid.getStore().removeAll();
					Ext.Array.each(items, function(data) {
						var item_data = {
							i_id: data.i_id,
							i_name: data.i_name,
							i_attribute: data.i_attribute,
							i_purchase_price: data.pod_purchase_price,
							u_slug_name: data.u_slug_name,
							c_name: data.c_name,
							qty: data.pod_qty,
							cost: parseFloat(data.cost)
						};

						// Add item
						var rec = purchasing_grid.getStore().add(item_data);
						purchasing_grid.getSelectionModel().select(rec);
					});

					Update_total_cost();

					Ext.Msg.close();
					Ext.getCmp('frm_sel_category').getStore().reload();
					Get_item_store_data();
				}
			}
		});
	}

	// Delete
	function Delete() {
		var selected = grid.getSelectionModel().getSelection();
		var data = selected[0].getData();
		opt = 'delete';

		Ext.MessageBox.show({
			title:'Confirmation',
			msg: 'Are you sure to <strong>Delete</strong> Purchase Order # <strong>' + data.po_purchase_order_number + '</strong>?',
			buttons: Ext.MessageBox.YESNO,
			icon: Ext.MessageBox.QUESTION,
			closable: false,
			fn: function(btn) {
				if(btn == 'yes') {
					Save();
				}
			}
		});
	}

	// Restore
	function Restore() {
		var selected = grid.getSelectionModel().getSelection();
		var data = selected[0].getData();
		opt = 'restore';

		Ext.MessageBox.show({
			title:'Confirmation',
			msg: 'Are you sure to <strong>Restore</strong> Purchase Order # <strong>' + data.po_purchase_order_number + '</strong>?',
			buttons: Ext.MessageBox.YESNO,
			icon: Ext.MessageBox.QUESTION,
			closable: false,
			fn: function(btn) {
				if(btn == 'yes') {
					Save();
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

		// Check if there are entered Purchase Order Items
		if(purchasing_grid.getStore().count() == 0) {
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

	// Save
	function Save(print) {
		if(opt != 'delete' && opt != 'restore') {
			if(Validate() == true) {
				Ext.Msg.wait('Saving Purchase Order...', 'Please wait');
				var items = [];
				purchasing_grid.getStore().each(function(record) {
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

				var po_id = '';
				if(opt == 'edit') {
					var selected = grid.getSelectionModel().getSelection();
					var data = selected[0].getData();
					po_id = data.po_id;
				}

				Ext.Ajax.request({
					url: global_controller_url + 'save',
					method: 'POST',
					params: {
						po_id: po_id,
						items: Ext.JSON.encode(items),
						s_id: Ext.getCmp('frm_sel_supplier').getValue(),
						opt: opt
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
							var purchase_order = decode.purchase_order;

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
											Ext.Msg.wait('Creating Purchase Order Voucher...', 'Please wait');

											// All Items HTML
											var po_html = '';
											var po_html_items = ''
											var po_total_cost = 0;
											Ext.Array.each(items, function(item_data, index) {
												po_html_items += '\
													<tr>\
														<td style="padding: 3px;">' + item_data.qty + '</td>\
														<td style="padding: 3px;">' + item_data.u_slug_name + '</td>\
														<td style="padding: 3px;">' + item_data.name + (item_data.attribute != '' ? '-' + item_data.attribute : '') + '</td>\
														<td style="text-align: right; padding: 3px;">' + renderer_currency_no_sign(item_data.purchase_price) + '</td>\
														<td style="text-align: right; padding: 3px;">' + renderer_currency_no_sign(item_data.cost) + '</td>\
													</tr>\
												';
												po_total_cost += item_data.cost;
											});
											po_html = '\
												<div class="extjs-align-center">\
													' + store_information.si_name + '<br>\
													' + store_information.si_address + '<br>\
													' + store_information.si_telephone_no + '\
												</div>\
												<br>\
												<table class="table" style="margin-bottom: 0; font-size: 13px;">\
													<tr>\
														<td style="width: 60%; border-top: none; padding: 3px;">\
															<strong>Purchase Order Voucher #:</strong> ' + purchase_order.po_purchase_order_number + '<br>\
															Date: ' + renderer_datetime(purchase_order.po_date) + '\
														</td>\
														<td style="width: 40%; border-top: none; padding: 3px;">\
															Requested by: ' + purchase_order.created_name + '\
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
														' + po_html_items + '\
												</table>\
												<table class="table" style="margin-bottom: 0; font-size: 13px;">\
													<tr>\
														<td style="width: 70%; border-top: none; padding: 3px;"></td>\
														<td style="width: 15%; border-top: none; padding: 3px;"><strong>Total Cost</strong></td>\
														<td style="width: 15%; border-top: none; text-align: right; padding: 3px;">\
															<strong>' + renderer_currency(po_total_cost) + '</strong>\
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
											Print_html(po_html);
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
		} else {
			var po_id = '';
			var selected = grid.getSelectionModel().getSelection();
			var data = selected[0].getData();
			po_id = data.po_id

			Ext.Msg.wait('Saving...', 'Please wait');
			Ext.Ajax.request({
				url: global_controller_url + 'save',
	            method: 'POST',
	            params: {
	            	opt: opt,
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
	                	Ext.Msg.close();
			        	grid.getStore().reload();
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
		for(var i = 0; i < purchasing_grid.getStore().count(); i++) {
			if(purchasing_grid.getStore().getAt(i).getData().i_id == item_id) {
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
			var rec = purchasing_grid.getStore().add(item_data);
			purchasing_grid.getSelectionModel().select(rec);
		}

		Update_total_cost();
	}

	// Get Total
	function Get_total() {
		var total = 0;
		for(var i = 0; i < purchasing_grid.getStore().count(); i++) {
			var data = purchasing_grid.getStore().getAt(i).getData();
			total += data.cost;
		}

		return total;
	}

	// Get Item Store Data
	function Get_item_store_data() {
		purchasing_grid.setLoading(true);
		item_store.removeAll();
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
            		purchasing_grid.setLoading(false);
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
                	purchasing_grid.setLoading(false);
                }
            }
		});
	}

	// Update Qty/Purchase Price
	function Update_qty_purchase_price() {
		var record = purchasing_grid.getSelectionModel().getSelection();
		var record = record[0];
		var qty = Ext.getCmp('frm_qty').getValue();
		var purchase_price = Ext.getCmp('frm_purchase_price').getValue();
		
		// Set Data
		record.set('qty', qty);
		record.set('i_purchase_price', purchase_price);
		record.set('cost', (purchase_price * qty));
		purchasing_grid.getStore().commitChanges();

		Update_total_cost();
	}

	// Update Total Cost
	function Update_total_cost() {
		var get_total = Get_total();
		var total = renderer_currency_no_sign(get_total);
		Ext.getCmp('text_total').setText(total);
	}
});
