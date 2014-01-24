Ext.onReady(function() {
	/*
	 * INITIALIZE
	 */

	// Set Store
	var store = new Ext.data.Store({
	    fields: ['o_id', 'o_order_number', 'o_date', 'o_status', 'o_amount_tendered', 'o_attended_by', 'attended_name', 'total', 'change', 'changed_order', 'o_delivered_to'],
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

	// Set Top Bar
	var top_bar = [
		{
			xtype: 'button',
			text: 'Void Order',
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
			text: 'View Order',
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

	// Set Grid
	var grid = new Ext.grid.Panel({
	    renderTo: 'grid-container',
	    store: store,
	    title: '<span class="lead">Order History</span>',
	    width: '100%',
	    height: 500,
	    columnLines: true,
	    iconCls: 'extjs-icon-history',
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
	            text: 'Status',
	            width: 120,
	            dataIndex: 'o_status',
	            tdCls: 'extjs-bold-text',
	            renderer: renderer_status
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
	            text: 'Delivered To',
	            width: 150,
	            dataIndex: 'o_delivered_to'
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
	            renderer: renderer_yes_no_negative
	        }
	    ],
	    listeners: {
	    	selectionchange: function(grid, selected) {
	    		if(selected.length > 0) {
	    			selected = selected[0];
		    		var data = selected.getData();
		    		if(data.o_status == 'P') {
		    			Ext.getCmp('btn_void').enable();
		    		} else {
		    			Ext.getCmp('btn_void').disable();
		    		}
	    		}
	    	}
	    }
	});

	// Set Tab Panel
	var view_order_tab_panel = new Ext.tab.Panel({
		width: '100%',
		activeTab: 0,
		plain: true,
		deferredRender: false
	});

	// Set Window panel
	var view_order_window_panel = new Ext.window.Window({
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
		items: [view_order_tab_panel],
		bbar: [
			{
				xtype: 'button',
				text: 'Close',
				iconCls: 'extjs-icon-cancel-large',
				scale: 'large',
				handler: function() {
					view_order_window_panel.close();
					view_order_window_panel.restore();
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

	// Void
	function Void() {
		var o_id = '';
		var selected = grid.getSelectionModel().getSelection();
		var data = selected[0].getData();
		o_id = data.o_id

		Ext.MessageBox.show({
			title:'Confirmation',
			msg: 'Are you sure to <strong class="text-error">Void</strong> Order # <strong>' + data.o_order_number + '</strong>? This cannot be undone',
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
			                	Ext.Msg.close();
					        	grid.getStore().reload();
			                }
			            }
					});
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

		Ext.Msg.wait('Generating Order Preview...', 'Please wait');
		Ext.Ajax.request({
			url: global_controller_url + 'get_order_items',
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
                	var order_items = decode.order_items;
                	var store_information = decode.store_information;

                	// Get Items from rows
					var all_items = new Array();
					var vattable_items = new Array();
					var tax = 0;
					Ext.Array.each(order_items, function(data) {
						item_details = {
							id: data.i_id,
							name: data.i_name,
							attribute: data.i_attribute,
							selling_price: data.od_selling_price,
							purchase_price: data.od_purchase_price,
							vat: data.od_vat,
							u_slug_name: data.u_slug_name,
							qty: data.od_qty,
							discount: data.od_discount,
							subtotal: (parseFloat(data.od_selling_price) * parseFloat(data.od_qty)) - (parseFloat(data.od_discount) * parseFloat(data.od_qty))
						};

						all_items.push(item_details);
						if(data.od_vat == '1') {
							vattable_items.push(item_details);
							tax += ((parseFloat(data.od_selling_price) * parseFloat(data.od_qty)) * 0.12);
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
								<td style="padding: 0px; line-height: 15px;">' + renderer_number(item_data.qty) + '</td>\
								<td style="padding: 0px; line-height: 15px;">' + item_data.u_slug_name + '</td>\
								<td style="padding: 0px; line-height: 15px;">' + item_data.name + '</td>\
								<td style="text-align: right; padding: 0px; line-height: 15px;">' + renderer_currency_no_sign(item_data.selling_price - item_data.discount) + '</td>\
								<td style="text-align: right; padding: 0px; line-height: 15px;">' + renderer_currency_no_sign(item_data.subtotal) + '</td>\
							</tr>\
						';
						all_items_total += item_data.subtotal;
					});

					// Add more lines, to equal to lines count it is less than the lines count
					if(all_items.length < global_items_line_count) {
						for(var i = all_items.length; i < global_items_line_count; i++) {
							all_items_html_items += '\
								<tr>\
									<td style="padding: 0px; line-height: 15px;">&nbsp;</td>\
									<td style="padding: 0px; line-height: 15px;">&nbsp;</td>\
									<td style="padding: 0px; line-height: 15px;">&nbsp;</td>\
									<td style="padding: 0px; line-height: 15px;">&nbsp;</td>\
									<td style="padding: 0px; line-height: 15px;">&nbsp;</td>\
								</tr>\
							';
						}
					}

					all_items_html = '\
						<div style="font-size: 12px; line-height: 15px; margin-top: 10px; text-align: center;">\
							<span style="font-size: 13px;"><strong>' + store_information.si_name + '</strong></span><br>\
							' + store_information.si_address + '<br>\
							' + store_information.si_telephone_no + '\
						</div>\
						<table class="table" style="margin-bottom: 0; font-size: 12px;">\
							<tr>\
								<td style="width: 70%; border-top: none; padding: 0px; line-height: 15px;">\
									Delivery Report #: <span id="all_items_dr">' + data.o_order_number + '</span><br>\
									Delivered To: <span id="all_items_delivered_to">' + data.o_delivered_to + '</span>\
								</td>\
								<td style="width: 30%; border-top: none; padding: 0px; line-height: 15px;">\
									Date: <span id="all_items_date">' + renderer_datetime(data.o_date) + '</span>\
								</td>\
							</tr>\
						</table>\
						<table class="table table-bordered" style="margin-bottom: 0; font-size: 12px; line-height: 15px;">\
							<thead>\
								<td style="width: 7%; padding: 0px; text-align: center; line-height: 15px;">Qty</td>\
								<td style="width: 10%; padding: 0px; text-align: center; line-height: 15px;">Unit</td>\
								<td style="width: 53%; padding: 0px; text-align: center; line-height: 15px;">Item</td>\
								<td style="width: 15%; padding: 0px; text-align: center; line-height: 15px;">Price</td>\
								<td style="width: 15%; padding: 0px; text-align: center; line-height: 15px;">Subtotal</td>\
							</thead>\
							<tbody>\
								' + all_items_html_items + '\
							</tbody>\
						</table>\
						<table class="table" style="margin-bottom: 0; font-size: 12px;">\
							<tr>\
								<td style="width: 15%; border-top: none; padding: 0px; line-height: 15px;">Cash</td>\
								<td style="width: 15%; border-top: none; text-align: right; padding: 0px;">\
									' + renderer_currency(data.o_amount_tendered) + '\
								</td>\
								<td style="width: 40%; border-top: none; padding: 0px; line-height: 15px;"></td>\
								<td style="width: 15%; border-top: none; padding: 0px; line-height: 15px;">Total</td>\
								<td style="width: 15%; border-top: none; text-align: right; padding: 0px; line-height: 15px;">\
									' + renderer_currency(all_items_total) + '\
								</td>\
							</tr>\
							<tr>\
								<td style="width: 15%; border-top: none; padding: 0px; line-height: 15px;">' + (data.o_amount_tendered >= all_items_total ? 'Change' : 'Credit') + '</td>\
								<td style="width: 15%; border-top: none; text-align: right; padding: 0px; line-height: 15px;">\
									' + renderer_currency(data.change) + '\
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
									' + data.attended_name + '<br>___________________\
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
									<td style="padding: 0px; line-height: 15px;">' + renderer_number(item_data.qty) + '</td>\
									<td style="padding: 0px; line-height: 15px;">' + item_data.u_slug_name + '</td>\
									<td style="padding: 0px; line-height: 15px;">' + item_data.name + '</td>\
									<td style="text-align: right; padding: 0px; line-height: 15px;">' + renderer_currency_no_sign(item_data.selling_price - item_data.discount) + '</td>\
									<td style="text-align: right; padding: 0px; line-height: 15px;">' + renderer_currency_no_sign(item_data.subtotal) + '</td>\
								</tr>\
							';
							vattable_items_total += item_data.subtotal;
						});

						// Add more lines, to equal to lines count it is less than the lines count
						if(vattable_items.length < global_items_line_count) {
							for(var i = vattable_items.length; i < global_items_line_count; i++) {
								vattable_items_html_items += '\
									<tr>\
										<td style="padding: 0px; line-height: 15px;">&nbsp;</td>\
										<td style="padding: 0px; line-height: 15px;">&nbsp;</td>\
										<td style="padding: 0px; line-height: 15px;">&nbsp;</td>\
										<td style="padding: 0px; line-height: 15px;">&nbsp;</td>\
										<td style="padding: 0px; line-height: 15px;">&nbsp;</td>\
									</tr>\
								';
							}
						}
						
						vattable_items_html = '\
							<div class="extjs-align-center" style="font-size: 12px; line-height: 15px; margin-top: 10px;">\
								<span style="font-size: 13px;"><strong>' + store_information.si_name + '</strong></span><br>\
								' + store_information.si_address + '<br>\
								' + store_information.si_telephone_no + '\
							</div>\
							<table class="table" style="margin-bottom: 0; font-size: 12px;">\
								<tr>\
									<td style="width: 70%; border-top: none; padding: 0px; line-height: 15px;">\
										Delivery Report #: <span id="vattable_items_dr">' + data.o_order_number + '</span><br>\
										Delivered To: <span id="vattable_items_delivered_to">' + data.o_delivered_to + '</span>\
									</td>\
									<td style="width: 30%; border-top: none; padding: 0px; line-height: 15px;">\
										Date: <span id="vattable_items_date">' + renderer_datetime(data.o_date) + '</span>\
									</td>\
								</tr>\
							</table>\
							<table class="table table-bordered" style="margin-bottom: 0; font-size: 12px;">\
								<thead>\
									<td style="width: 7%; padding: 0px; text-align: center; line-height: 15px;">Qty</td>\
									<td style="width: 10%; padding: 0px; text-align: center; line-height: 15px;">Unit</td>\
									<td style="width: 53%; padding: 0px; text-align: center; line-height: 15px;">Item</td>\
									<td style="width: 15%; padding: 0px; text-align: center; line-height: 15px;">Price</td>\
									<td style="width: 15%; padding: 0px; text-align: center; line-height: 15px;">Subtotal</td>\
								</thead>\
								<tbody>\
									' + vattable_items_html_items + '\
								</tbody>\
							</table>\
							<table class="table" style="margin-bottom: 0; font-size: 12px;">\
								<tr>\
									<td style="width: 70%; border-top: none; padding: 0px; line-height: 15px;"></td>\
									<td style="width: 15%; border-top: none; padding: 0px; line-height: 15px;">Total</td>\
									<td style="width: 15%; border-top: none; text-align: right;  padding: 0px; line-height: 15px;">\
										' + renderer_currency(vattable_items_total) + '\
									</td>\
								</tr>\
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

					// Reset View Order Window
					Ext.getCmp('print_vattable_check').setValue(false);
					view_order_tab_panel.removeAll();
					view_order_tab_panel.add(tab_items);
					view_order_tab_panel.setActiveTab(0);
					Ext.Msg.close();
					view_order_window_panel.setTitle('View Order # ' + data.o_order_number);
					view_order_window_panel.show();
                }
			}
		});
	}

	// Print Contents
	function Print_contents() {
		view_order_window_panel.focus();
		Print_element(Ext.getCmp('all_items_tab'));
		if(Ext.getCmp('print_vattable_check').getValue() == true) {
			setTimeout(function() {
				Print_element(Ext.getCmp('vattable_items_tab'));
			}, 3000);
		}
	}
});
