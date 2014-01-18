Ext.onReady(function() {
	/*
	 * INITIALIZE
	 */

	// Set Store
	var store = new Ext.data.Store({
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
	    	beforeload: function(item_store) {
		    	item_store.getProxy().extraParams.c_id = Ext.getCmp('frm_sel_category').getValue();
		    },
		    load: function() {
		    	Ext.getCmp('frm_sel_item').expand();
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
	    		Ext.getCmp('frm_sel_item').getStore().reload();
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
            width: '40%',
            labelWidth: 60,
            forceSelection: true,
            anyMatch: true,
            value: 'All',
            listeners: {
            	select: function() {
            		Ext.getCmp('frm_sel_item').getStore().reload();
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
			anyMatch: true,
			width: '60%',
			listConfig: {
				emptyText: 'No Items found.',
				maxHeight: 400,
				getInnerTpl: function() {
					return '<table class="table table-bordered" style="margin-bottom: 0;">' +
								'<tr>' +
									'<td style="padding: 1px;" colspan="2">' + 
										'<strong>{item_display_name}</strong>' +
										'<span class="pull-right">' +
											'Qty on Hand: ' +
											'<strong>' +
												'<tpl if="qty_on_hand &gt; item_reorder_level">' +
													'<span class="text-success">{[Ext.util.Format.number(values.qty_on_hand, \'0.00\')]}</span>' +
												'</tpl>' +
												'<tpl if="qty_on_hand &lt; item_reorder_level || qty_on_hand == item_reorder_level">' +
													'<tpl if="qty_on_hand == item_reorder_level">' +
														'<span class="text-warning">{[Ext.util.Format.number(values.qty_on_hand, \'0.00\')]}</span>' +
													'</tpl>' +
													'<tpl else="">' +
														'<span class="text-error">{[Ext.util.Format.number(values.qty_on_hand, \'0.00\')]}</span>' +
													'</tpl>' +
												'</tpl>' +
											'</strong>' +
										'</span>' +
									'</td>' +
									'<td style="width: 20%; padding: 1px; text-align: right;"><strong class="text-success">{[Ext.util.Format.currency(values.item_selling_price, \'₱&emsp;\')]}</strong></td>' +
								'</tr>' +
								'<tr>' +
									'<td style="width: 40%; padding: 1px;"><small>{category_name}</small></td>' +
									'<td style="width: 40%; padding: 1px;"><small>{supplier_name}</small></td>' +
									'<td style="width: 20%; padding: 1px; text-align: right;"><strong>{[Ext.util.Format.currency(values.item_purchase_price, \'₱&emsp;\')]}</strong></td>' +
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
		}
	];

	// Set Bottom Bar
	var bottom_bar = [
		{
			xtype: 'button',
			id: 'btn_cancel_order',
			text: 'Cancel Order',
			iconCls: 'extjs-icon-cancel-large',
			scale: 'large',
			handler: function() {
				Cancel_order();
			}
		},
		{
			xtype: 'button',
			id: 'btn_pay',
			text: 'Pay',
			iconCls: 'extjs-icon-money-large',
			scale: 'large',
			handler: function() {
				Pay();
			}
		},
		'->',
		{
			xtype: 'text',
            text: 'Tax:',
            cls: 'lead'
		},
		{
			xtype: 'text',
			id: 'text_tax',
            cls: 'lead extjs-bold-text',
            width: 200
		},
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

	// Set Grid
	var grid = new Ext.grid.Panel({
	    renderTo: 'grid-container',
	    store: store,
	    title: '<span class="lead">Order Taking</span>',
	    width: '100%',
	    height: 500,
	    columnLines: true,
	    iconCls: 'extjs-icon-order-taking',
	    tbar: top_bar,
	    bbar: bottom_bar,
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

					    	var rec = grid.getSelectionModel().getSelection();
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
							grid.getStore().remove(grid.getSelectionModel().getSelection());
					    	if(grid.getStore().count() == 0) {
					    		Ext.getCmp('btn_cancel_order').disable();
					    		Ext.getCmp('btn_pay').disable();
					    	}

					    	Update_total_values();
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
	            text: 'Category',
	            width: 120,
	            dataIndex: 'c_name',
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
	            text: 'Discount',
	            width: 100,
	            dataIndex: 'discount',
	            align: 'right',
	            renderer: renderer_currency,
	            sortable: false,
	            draggable: false,
	            locked: true
	        },
	        {
	            text: 'Subtotal',
	            width: 100,
	            dataIndex: 'subtotal',
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
	        }
	    ]
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
	var receipt_tab_panel = new Ext.tab.Panel({
		width: '100%',
		activeTab: 0,
		plain: true,
		deferredRender: false,
		bbar: [
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
				minValue: 1,
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
				id: 'pay_text_total',
	            cls: 'lead extjs-bold-text'
			}
		]
	});

	// Set Window panel
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

	var pay_window_panel = new Ext.window.Window({
		title: 'Pay',
		height: 500,
		width: 750,
		bodyPadding: 5,
		iconCls: 'extjs-icon-money',
		layout: 'fit',
		closeAction: 'hide',
		modal: true,
		resizable: false,
		closable: false,
		items: [receipt_tab_panel],
		bbar: [
			{
				xtype: 'button',
				text: 'Cancel',
				iconCls: 'extjs-icon-cancel-large',
				scale: 'large',
				handler: function() {
					pay_window_panel.close();
				}
			},
			'->',
			{
				xtype: 'checkbox',
				id: 'print_vattable_check',
				boxLabel: 'Print Vattable Items'
			},
			{
				xtype: 'button',
				id: 'btn_print_pay',
				text: 'Print & Pay',
				iconCls: 'extjs-icon-cashiering-large',
				scale: 'large',
				handler: function() {
					Print_and_pay()
				}
			}
		]
	});

	Ext.getCmp('frm_sel_category').focus();
	Ext.getCmp('btn_cancel_order').disable();
	Ext.getCmp('btn_pay').disable();

	Update_total_values();


	/*
	 * FUNCTIONS
	 */

	// Add Item
	function Add_item(record) {
		var data = record.getData();

		// Check if Item is already added
		var is_existing = false;
		var item_id = data.item_id;
		for(var i = 0; i < grid.getStore().count(); i++) {
			if(grid.getStore().getAt(i).getData().i_id == item_id) {
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
			var rec = grid.getStore().add(item_data);
			grid.getSelectionModel().select(rec);
		}

		Ext.getCmp('btn_cancel_order').enable();
		Ext.getCmp('btn_pay').enable();

		Update_total_values();
	}

	// Update Qty/Discount
	function Update_qty_discount() {
		var record = grid.getSelectionModel().getSelection();
		var record = record[0];
		var qty = Ext.getCmp('frm_qty').getValue();
		var discount = Ext.getCmp('frm_discount').getValue();
		var selling_price = record.getData().i_selling_price;
		
		// Set Data
		record.set('qty', qty);
		record.set('discount', discount);
		record.set('subtotal', ((selling_price * qty) - (discount * qty)));
		grid.getStore().commitChanges();

		Update_total_values();
	}

	// Update Total Values
	function Update_total_values() {
		Update_total();
		Update_tax();
	}

	// Update Total
	function Update_total() {
		var total = renderer_currency_no_sign(Get_total());
		Ext.getCmp('text_total').setText(total);
	}

	// Update Tax
	function Update_tax() {
		var tax = renderer_currency_no_sign(Get_tax());
		Ext.getCmp('text_tax').setText(tax);
	}

	// Get Total
	function Get_total() {
		var total = 0;

		for(var i = 0; i < grid.getStore().count(); i++) {
			var data = grid.getStore().getAt(i).getData();
			total += data.subtotal;
		}

		return total;
	}

	// Get Tax
	function Get_tax() {
		var tax = 0;

		for(var i = 0; i < grid.getStore().count(); i++) {
			var data = grid.getStore().getAt(i).getData();

			if(data.i_vat == '1') {
				tax += (data.subtotal * 0.12);
			}
		}

		return tax;
	}

	// Cancel Order
	function Cancel_order() {
		grid.getStore().removeAll();
		Update_total_values();

		Ext.getCmp('btn_cancel_order').disable();
		Ext.getCmp('btn_pay').disable();
		Ext.getCmp('frm_sel_category').setValue('all');
		Ext.getCmp('frm_sel_item').setValue('');
		Ext.getCmp('frm_sel_category').focus();
	}

	// Pay
	function Pay() {
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
					Ext.Msg.wait('Creating Receipt Preview...', 'Please wait');

					// Get Items from rows
					var all_items = new Array();
					var vattable_items = new Array();
					grid.getStore().each(function(record) {
						var data = record.getData();
						item_details = {
							id: data.i_id,
							name: data.i_name,
							attribute: data.i_attribute,
							selling_price: data.i_selling_price,
							purchase_price: data.i_purchase_price,
							vat: data.i_vat,
							u_slug_name: data.u_slug_name,
							qty: data.qty,
							discount: data.discount,
							subtotal: data.subtotal
						};

						all_items.push(item_details);
						if(data.i_vat == '1') {
							vattable_items.push(item_details);
						}
					});
					
					// Initialize Tab Items
					var tab_items = [];

					// All Items HTML
					var all_items_html = '';
					var all_items_html_items = ''
					var all_items_total = 0;
					Ext.Array.each(all_items, function(item_data, index) {
						all_items_html_items += '\
							<tr>\
								<td style="padding: 1px; text-align: center;">' + item_data.qty + '</td>\
								<td style="padding: 1px;">' + item_data.u_slug_name + '</td>\
								<td style="padding: 1px;">' + item_data.name + (item_data.attribute != '' ? '-' + item_data.attribute : '') + '</td>\
								<td style="text-align: right; padding: 1px;">' + renderer_currency_no_sign(item_data.selling_price) + '</td>\
								<td style="text-align: right; padding: 1px;">' + renderer_currency_no_sign(item_data.subtotal) + '</td>\
							</tr>\
						';
						all_items_total += item_data.subtotal;
					});
					all_items_html = '\
						<div class="extjs-align-center" style="font-size: 12px;">\
							' + store_information.si_name + '<br>\
							' + store_information.si_address + '<br>\
							' + store_information.si_telephone_no + '\
						</div>\
						<br>\
						<table class="table" style="margin-bottom: 0; font-size: 12px;">\
							<tr>\
								<td style="width: 60%; border-top: none; padding: 1px;">\
									<strong>Delivery Report #:</strong> <span id="all_items_dr"></span><br>\
									Date: <span id="all_items_date"></span>\
								</td>\
								<td style="width: 40%; border-top: none; padding: 1px;">\
									Attended by: <span id="all_items_attended_by"></span>\
								</td>\
							</tr>\
						</table>\
						<table class="table table-bordered" style="margin-bottom: 0; font-size: 12px;">\
							<thead>\
								<th style="width: 7%; padding: 1px;">Qty</th>\
								<th style="width: 10%; padding: 1px;">Unit</th>\
								<th style="width: 53%; padding: 1px;">Item</th>\
								<th style="width: 15%; padding: 1px; text-align: right;">Price</th>\
								<th style="width: 15%; padding: 1px; text-align: right;">Subtotal</th>\
							</thead>\
							<tbody>\
								' + all_items_html_items + '\
						</table>\
						<table class="table" style="margin-bottom: 0; font-size: 12px;">\
							<tr>\
								<td style="width: 15%; border-top: none; padding: 1px;"><strong>Total</strong></td>\
								<td style="width: 15%; border-top: none; text-align: right;  padding: 1px;">\
									<strong>' + renderer_currency(all_items_total - Get_tax()) + '</strong>\
								</td>\
								<td style="width: 40%; border-top: none; padding: 1px;"></td>\
								<td style="width: 15%; border-top: none; padding: 1px;"><strong>Cash</strong></td>\
								<td style="width: 15%; border-top: none; text-align: right; padding: 1px;">\
									<strong id="all_items_cash"></strong>\
								</td>\
							</tr>\
							<tr>\
								<td style="width: 15%; border-top: none; padding: 1px;"><strong>Tax</strong></td>\
								<td style="width: 15%; border-top: none; text-align: right; padding: 1px;">\
									<strong>' + renderer_currency(Get_tax()) + '</strong>\
								</td>\
								<td style="width: 40%; border-top: none; padding: 1px;"></td>\
								<td style="width: 15%; border-top: none; padding: 1px;"><strong>Change</strong></td>\
								<td style="width: 15%; border-top: none; text-align: right; padding: 1px;">\
									<strong id="all_items_change"></strong>\
								</td>\
							</tr>\
							<tr>\
								<td style="width: 15%; border-top: none; padding: 1px;"><strong>Amount Due</strong></td>\
								<td style="width: 15%; border-top: none; text-align: right; padding: 1px;">\
									<strong>' + renderer_currency(all_items_total) + '</strong>\
								</td>\
								<td style="width: 70%; border-top: none; padding: 1px;" colspan="3">&nbsp;</td>\
							</tr>\
						</table>\
						<table class="table" style="margin-bottom: 0; font-size: 12px;">\
							<tr>\
								<td style="width: 50%; border-top: none; padding: 1px;"></td>\
								<td style="width: 50%; border-top: none; padding: 1px;">\
									<strong>Checked & Received by:</strong>\
								</td>\
							</tr>\
						</table>\
					';
					tab_items.push({
						title: 'All Items',
						id: 'all_items_tab',
            			html: all_items_html,
            			bodyPadding: 5,
            			autoScroll: true
					});

					// If has Vattable Items
					if(vattable_items.length > 0) {
						// Show Print Vattable Items
						Ext.getCmp('print_vattable_check').show();

						// Vattable Items HTML
						var vattable_items_html = '';
						var vattable_items_html_items = ''
						var vattable_items_total = 0;
						Ext.Array.each(vattable_items, function(item_data, index) {
							vattable_items_html_items += '\
								<tr>\
									<td style="padding: 1px;">' + item_data.qty + '</td>\
									<td style="padding: 1px;">' + item_data.u_slug_name + '</td>\
									<td style="padding: 1px;">' + item_data.name + (item_data.attribute != '' ? '-' + item_data.attribute : '') + '</td>\
									<td style="text-align: right; padding: 1px;">' + renderer_currency_no_sign(item_data.selling_price) + '</td>\
									<td style="text-align: right; padding: 1px;">' + renderer_currency_no_sign(item_data.discount) + '</td>\
									<td style="text-align: right; padding: 1px;">' + renderer_currency_no_sign(item_data.subtotal) + '</td>\
								</tr>\
							';
							vattable_items_total += item_data.subtotal;
						});
						vattable_items_html = '\
							<div class="extjs-align-center" style="font-size: 12px;">\
								' + store_information.si_name + '<br>\
								' + store_information.si_address + '<br>\
								' + store_information.si_telephone_no + '\
							</div>\
							<br>\
							<table class="table" style="margin-bottom: 0; font-size: 12px;">\
								<tr>\
									<td style="width: 60%; border-top: none;">\
										<strong>Delivery Report #:</strong> <span id="vattable_items_dr"></span><br>\
										Date: <span id="vattable_items_date"></span>\
									</td>\
									<td style="width: 40%; border-top: none;">\
										Attended by: <span id="vattable_items_attended_by"></span>\
									</td>\
								</tr>\
							</table>\
							<table class="table table-bordered" style="margin-bottom: 0;">\
								<thead>\
									<th style="width: 7%; padding: 1px;">Qty</th>\
									<th style="width: 10%; padding: 1px;">Unit</th>\
									<th style="width: 38%; padding: 1px;">Item</th>\
									<th style="width: 15%; padding: 1px;">Price</th>\
									<th style="width: 15%; padding: 1px;">Discount</th>\
									<th style="width: 15%; padding: 1px;">Subtotal</th>\
								</thead>\
								<tbody>\
									' + vattable_items_html_items + '\
									<tr>\
										<td colspan="4" style="padding: 1px;"></td>\
										<td style="padding: 1px;"><strong>Total</strong></td>\
										<td style="text-align: right; padding: 1px;">\
											<strong>' + renderer_currency(vattable_items_total) + '</strong>\
										</td>\
									</tr>\
								</tbody>\
							</table>\
						';
						tab_items.push({
							title: 'Vattable Items',
							id: 'vattable_items_tab',
	            			html: vattable_items_html,
	            			bodyPadding: 5,
	            			autoScroll: true
						});
					} else {
						// Hide Print Vattable Items
						Ext.getCmp('print_vattable_check').hide();
					}

					// Reset Pay Window
					Ext.getCmp('pay_text_total').setText(Ext.getCmp('text_total').text);
					Ext.getCmp('frm_amount_tendered').setMinValue(Get_total());
					Ext.getCmp('frm_amount_tendered').setValue('');
					Ext.getCmp('print_vattable_check').setValue(false);
					receipt_tab_panel.removeAll();
					receipt_tab_panel.add(tab_items);
					receipt_tab_panel.setActiveTab(0);
					Ext.Msg.close();
					pay_window_panel.show();
					Ext.getCmp('frm_amount_tendered').focus();
				}
			}
		});
	}

	// Print and Pay
	function Print_and_pay() {
		var total = Get_total();
		var amount_tendered = Ext.getCmp('frm_amount_tendered').getValue();

		// Check if empty
		if(amount_tendered == '') {
			Ext.Msg.show({
				title:'Information',
				msg: 'Please enter Amount Tendered',
				buttons: Ext.Msg.OK,
				icon: Ext.Msg.WARNING,
				closable: false
			});
			return;
		}

		// Check if Amount Tendered is less than total
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

		// Get Items from rows
		var all_items = new Array();
		var vattable_items = new Array();
		grid.getStore().each(function(record) {
			var data = record.getData();
			item_details = {
				id: data.i_id,
				name: data.i_name,
				attribute: data.i_attribute,
				selling_price: data.i_selling_price,
				purchase_price: data.i_purchase_price,
				vat: data.i_vat,
				u_slug_name: data.u_slug_name,
				qty: data.qty,
				discount: data.discount,
				subtotal: data.subtotal
			};

			all_items.push(item_details);
			if(data.i_vat == '1') {
				vattable_items.push(item_details);
			}
		});

		Ext.Msg.wait('Generating Receipt...', 'Please wait');
		Ext.Ajax.request({
			url: global_controller_url + 'save',
			method: 'POST',
			params: {
				all_items: Ext.JSON.encode(all_items),
				vattable_items: Ext.JSON.encode(vattable_items),
				include_vattable: Ext.getCmp('print_vattable_check').getValue(),
				amount_tendered: Ext.getCmp('frm_amount_tendered').getValue(),
				total: total
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
					var order = decode.order;

					// Set All Items Details
					Ext.get('all_items_dr').setHTML(order.o_order_number);
					Ext.get('all_items_date').setHTML(renderer_datetime(order.o_date));
					Ext.get('all_items_attended_by').setHTML(order.attended_name);
					Ext.get('all_items_cash').setHTML(renderer_currency(amount_tendered));
					Ext.get('all_items_change').setHTML(renderer_currency(amount_tendered - total));
					if(vattable_items.length > 0) {
						Ext.get('vattable_items_dr').setHTML(order.o_order_number);
						Ext.get('vattable_items_date').setHTML(renderer_datetime(order.o_date));
						Ext.get('vattable_items_attended_by').setHTML(order.attended_name);
					}

					Print_element(Ext.getCmp('all_items_tab'));
					if(Ext.getCmp('print_vattable_check').getValue() == true) {
						setTimeout(function() {
							Print_element(Ext.getCmp('vattable_items_tab'));
						}, 3000);
					}
					
					Ext.Msg.close();
					Cancel_order();
					pay_window_panel.hide();
				}
			}
		});
	}
});
