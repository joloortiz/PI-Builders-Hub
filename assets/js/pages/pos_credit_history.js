Ext.onReady(function() {
	/*
	 * INITIALIZE
	 */

	var remaining_credit = 0;

	// Set Store
	var store = new Ext.data.Store({
	    fields: ['o_id', 'o_order_number', 'o_date', 'o_status', 'o_amount_tendered', 'o_attended_by', 'attended_name', 'total', 'o_delivered_to', 'cr_id', 'cr_amount', 'remaining_credit', 'status'],
	    pageSize: global_page_size,
	    autoLoad: true,
	    proxy: {
	        type: 'ajax',
	        url: global_controller_url + 'get_credits',
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
			{value: 'W', display: 'With Balance'},
			{value: 'F', display: 'Fully Paid'}
		]
	});

	var credit_payments_store = new Ext.data.Store({
	    fields: ['crp_id', 'crp_amount_payed', 'crp_amount_tendered', 'crp_date', 'attended_name', 'cr_id'],
		proxy: {
	        type: 'ajax',
	        url: global_controller_url + 'get_credit_payments',
	        reader: {
	            type: 'json',
	            root: 'data'
	        }
	    },
	    listeners: {
	    	beforeload: function(item_store) {
	    		var selected = grid.getSelectionModel().getSelection();
				var data = selected[0].getData();
		    	credit_payments_store.getProxy().extraParams.cr_id = data.cr_id;
		    },
		    load: function() {
		    	Update_credit();
		    }
	    }
	});

	// Set Top Bar
	var top_bar = [
		{
			xtype: 'button',
			text: 'Credit Payment',
			id: 'btn_credit_payment',
			iconCls: 'extjs-icon-credit-payment',
			iconAlign: 'left',
			handler: function() {
				if(grid.getSelectionModel().hasSelection()) {
					Credit_payment();
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
            value: 'W',
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
	    title: '<span class="lead">Credit History</span>',
	    width: '100%',
	    height: 500,
	    columnLines: true,
	    iconCls: 'extjs-icon-credit',
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
	            dataIndex: 'status',
	            tdCls: 'extjs-bold-text',
	            renderer: renderer_credit_status
	        },
	        {
	            text: 'Remaining Credit',
	            width: 150,
	            dataIndex: 'remaining_credit',
	            tdCls: 'extjs-bold-text text-error',
	            align: 'right',
	            renderer: renderer_currency
	        },
	        {
	            text: 'Total Credit',
	            width: 150,
	            dataIndex: 'cr_amount',
	            tdCls: 'extjs-bold-text text-info',
	            align: 'right',
	            renderer: renderer_currency
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
	        }
	    ]
	});

	var credit_payments_grid = new Ext.grid.Panel({
		title: 'Payments',
	    store: credit_payments_store,
	    width: '100%',
	    columnLines: true,
	    dockedItems: [
			{
				xtype: 'toolbar',
				dock: 'bottom',
				id: 'pay_toolbar',
				items: [
					{
						xtype: 'label',
						text: 'Amount to Pay',
						cls: 'lead-small extjs-bold-text'
					},
					{
						xtype: 'numberfield',
						id: 'frm_amount_to_pay',
						fieldCls: 'lead-small lead-small-no-mb extjs-align-right text-info',
						width: 120,
						maxLength: 10,
						minValue: 0,
						value: 0,
						enforceMaxLength: true,
						listeners: {
							blur: function(me) {
								if(me.getValue() == '' || me.getValue() == null) {
									me.setValue(0);
								}
								if(me.getValue() == 0) {
									Ext.getCmp('frm_amount_tendered').disable();
								} else {
									Ext.getCmp('frm_amount_tendered').enable();
								}
							}
						}
					},
					'->',
					{
						xtype: 'label',
						text: 'Amount Tendered',
						cls: 'lead-small extjs-bold-text'
					},
					{
						xtype: 'numberfield',
						id: 'frm_amount_tendered',
						fieldCls: 'lead-small lead-small-no-mb extjs-align-right',
						width: 120,
						maxLength: 10,
						minValue: 0,
						value: 0,
						enforceMaxLength: true,
						listeners: {
							blur: function(me) {
								if(me.getValue() == '' || me.getValue() == null) {
									me.setValue(0);
								}
							}
						}
					}
				]
			},
			{
				xtype: 'toolbar',
				dock: 'top',
				items: [
					{
						xtype: 'button',
						text: 'Print Credit Payment',
						iconCls: 'extjs-icon-print',
						iconAlign: 'left',
						handler: function() {
							if(credit_payments_grid.getSelectionModel().hasSelection()) {
								Print_credit_payment();
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
					}
				]
			}
	    ],
	    columns: [
	        {
	            text: 'Amount Payed',
	            width: 120,
	            dataIndex: 'crp_amount_payed',
	            align: 'right',
	            tdCls: 'extjs-bold-text text-info',
	            renderer: renderer_currency
	        },
	        {
	            text: 'Amount Tendered',
	            width: 130,
	            dataIndex: 'crp_amount_tendered',
	            align: 'right',
	            tdCls: 'extjs-bold-text',
	            renderer: renderer_currency
	        },
	        {
	            text: 'Date Payed',
	            width: 170,
	            dataIndex: 'crp_date',
	            renderer: renderer_datetime
	        },
	        {
	            text: 'Attended By',
	            width: 150,
	            dataIndex: 'attended_name'
	        }
	    ],
	    bbar: [
	    	{
				xtype: 'label',
				text: 'Remaining Credit',
				cls: 'lead-small extjs-bold-text'
			},
			{
				xtype: 'label',
				id: 'text_remaining_credit',
				cls: 'lead-small extjs-bold-text text-error'
			},
			'->',
			{
				xtype: 'label',
				text: 'Total Credit',
				cls: 'lead-small extjs-bold-text'
			},
			{
				xtype: 'label',
				id: 'text_total_credit',
				cls: 'lead-small extjs-bold-text text-info'
			}
	    ]
	});

	// Set Window panel
	var window_panel = new Ext.window.Window({
	    height: 500,
	    width: 700,
		layout: 'fit',
	    closeAction: 'hide',
	    modal: true,
	    closable: false,
	    resizable: false,
	    maximizable: true,
	    bodyPadding: 5,
	    iconCls: 'extjs-icon-credit-payment',
	    items: [credit_payments_grid],
	    bbar: [
			{
				xtype: 'button',
				text: 'Close',
				iconCls: 'extjs-icon-cancel-large',
				scale: 'large',
				handler: function() {
					window_panel.close();
					window_panel.restore();
					store.reload();
				}
			},
			'->',
			{
				xtype: 'button',
				id: 'btn_pay',
				text: 'Pay',
				iconCls: 'extjs-icon-money-large',
				scale: 'large',
				handler: function() {
					Pay();
				}
			}
		],
	    listeners: {
	    	show: function() {
	    		credit_payments_grid.getStore().reload();
	    	}
	    }
	});


	/*
	 * FUNCTIONS
	 */

	// Credit Payment
	function Credit_payment() {
		var selected = grid.getSelectionModel().getSelection();
		var data = selected[0].getData();

		Reset_credit_payment();
		window_panel.setTitle('Credit Payment - Order # ' + data.o_order_number);
		window_panel.show();
		window_panel.center();
	}

	// Reset Credit Payment
	function Reset_credit_payment() {
		Ext.getCmp('pay_toolbar').hide();
		Ext.getCmp('btn_pay').hide();

		credit_payments_grid.getStore().removeAll();
		Ext.getCmp('text_total_credit').setText('');
		Ext.getCmp('text_remaining_credit').setText('');

		Ext.getCmp('frm_amount_tendered').setValue(0);
	}

	// Update Credit
	function Update_credit() {
		var selected = grid.getSelectionModel().getSelection();
		var data = selected[0].getData();

		var total_credit = renderer_currency_no_sign(data.cr_amount);
		Ext.getCmp('text_total_credit').setText(total_credit);

		var payed_credit = 0;
		credit_payments_grid.getStore().each(function(record) {
			var data = record.getData();
			payed_credit += parseFloat(data.crp_amount_payed);
		});
		remaining_credit = parseFloat(data.cr_amount) - payed_credit;
		remaining_credit_text = renderer_currency_no_sign(remaining_credit);
		Ext.getCmp('text_remaining_credit').setText(remaining_credit_text);
		
		// Set Pay components status
		if(remaining_credit > 0) {
			Ext.getCmp('pay_toolbar').show();
			Ext.getCmp('btn_pay').show();
			Ext.getCmp('frm_amount_to_pay').setMaxValue(remaining_credit);
			Ext.getCmp('frm_amount_to_pay').setValue(remaining_credit);
		} else {
			Ext.getCmp('pay_toolbar').hide();
			Ext.getCmp('btn_pay').hide();
		}
	}

	// Pay
	function Pay() {
		var selected = grid.getSelectionModel().getSelection();
		var data = selected[0].getData();

		var cr_id = data.cr_id;
		var amount_to_pay = parseFloat(Ext.getCmp('frm_amount_to_pay').getValue());
		var amount_tendered = parseFloat(Ext.getCmp('frm_amount_tendered').getValue());

		if(amount_to_pay == 0) {
			Ext.Msg.show({
				title:'Information',
				msg: 'Please enter a valid <strong>Amount to Pay</strong>',
				buttons: Ext.Msg.OK,
				icon: Ext.Msg.WARNING,
				closable: false
			});
			Ext.getCmp('frm_amount_to_pay').focus();
			return;
		}

		if(amount_to_pay > remaining_credit) {
			Ext.Msg.show({
				title:'Information',
				msg: '<strong>Amount to Pay</strong> is greater than the <strong>Remaining Credit</strong>',
				buttons: Ext.Msg.OK,
				icon: Ext.Msg.WARNING,
				closable: false
			});
			Ext.getCmp('frm_amount_to_pay').focus();
			return;
		}

		if(amount_tendered < amount_to_pay) {
			Ext.Msg.show({
				title:'Information',
				msg: '<strong>Amount Tendered</strong> is less than <strong>Amount to Pay</strong>',
				buttons: Ext.Msg.OK,
				icon: Ext.Msg.WARNING,
				closable: false
			});
			Ext.getCmp('frm_amount_tendered').focus();
			return;
		}

		Ext.Msg.wait('Processing Credit Payment...', 'Please wait');
		Ext.Ajax.request({
			url: global_controller_url + 'save',
			method: 'POST',
			params: {
				amount_to_pay: amount_to_pay,
				amount_tendered: amount_tendered,
				cr_id: cr_id
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
					var credit_payment = decode.credit_payment;
					var store_information = decode.store_information;

					var credit_payment_html = '\
						<div style="font-size: 12px; line-height: 15px; margin-top: 10px; text-align: center;">\
							<em>' + store_information.si_name + '</em><br>\
							' + store_information.si_address + '<br>\
							' + store_information.si_telephone_no + '<br>\
							<br>\
							Credit Payment\
						</div>\
						<table class="table" style="margin-bottom: 0; margin-top: 5px; font-size: 12px;">\
							<tr>\
								<td style="width: 70%; border-top: none; padding: 0px; line-height: 15px;">\
									Delivery Report #: ' + credit_payment.o_order_number + '</span><br>\
									Delivered To: ' + credit_payment.o_delivered_to + '</span>\
								</td>\
								<td style="width: 30%; border-top: none; padding: 0px; line-height: 15px;">\
									Payment Date: ' + renderer_datetime(credit_payment.crp_date) + '</span>\
								</td>\
							</tr>\
						</table>\
						<br>\
						<table class="table" style="margin-bottom: 0; font-size: 12px;">\
							<tr>\
								<td style="width: 15%; border-top: none; padding: 0px; line-height: 15px;">Payed Amount</td>\
								<td style="width: 15%; border-top: none; text-align: right; padding: 0px;">\
									' + renderer_currency(parseFloat(credit_payment.crp_amount_payed)) + '\
								</td>\
								<td style="width: 40%; border-top: none; padding: 0px; line-height: 15px;"></td>\
								<td style="width: 15%; border-top: none; padding: 0px; line-height: 15px;">Total Credit</td>\
								<td style="width: 15%; border-top: none; text-align: right; padding: 0px;">\
									' + renderer_currency(parseFloat(credit_payment.cr_amount)) + '\
								</td>\
							</tr>\
							<tr>\
								<td style="width: 15%; border-top: none; padding: 0px; line-height: 15px;">Amount Tendered</td>\
								<td style="width: 15%; border-top: none; text-align: right; padding: 0px;">\
									' + renderer_currency(parseFloat(credit_payment.crp_amount_tendered)) + '\
								</td>\
								<td style="width: 40%; border-top: none; padding: 0px; line-height: 15px;"></td>\
								<td style="width: 15%; border-top: none; padding: 0px; line-height: 15px;">Remaining Credit</td>\
								<td style="width: 15%; border-top: none; text-align: right; padding: 0px;">\
									' + renderer_currency(parseFloat(credit_payment.remaining_credit)) + '\
								</td>\
							</tr>\
							<tr>\
								<td style="width: 15%; border-top: none; padding: 0px; line-height: 15px;">Change</td>\
								<td style="width: 15%; border-top: none; text-align: right; padding: 0px;">\
									' + renderer_currency(parseFloat(credit_payment.crp_amount_tendered) - parseFloat(credit_payment.crp_amount_payed)) + '\
								</td>\
								<td style="width: 70%; border-top: none; padding: 0px; line-height: 15px;" colspan="3"></td>\
							</tr>\
						</table>\
						<br>\
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
									' + credit_payment.attended_name + '<br>___________________\
								</td>\
							</tr>\
						</table>\
					';

					Reset_credit_payment();
					credit_payments_grid.getStore().reload();
					Ext.Msg.close();
					Print_html(credit_payment_html);
				}
			}
		});
	}

	// Print Credit Payment
	function Print_credit_payment() {
		var selected = credit_payments_grid.getSelectionModel().getSelection();
		var data = selected[0].getData();
		var crp_id = data.crp_id;

		Ext.Msg.wait('Processing Credit Payment...', 'Please wait');
		Ext.Ajax.request({
			url: global_controller_url + 'get_credit_payment_by_id',
			method: 'POST',
			params: {
				crp_id: crp_id
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
					var credit_payment = decode.credit_payment;
					var store_information = decode.store_information;
					
					var credit_payment_html = '\
						<div style="font-size: 12px; line-height: 15px; margin-top: 10px; text-align: center;">\
							<em>' + store_information.si_name + '</em><br>\
							' + store_information.si_address + '<br>\
							' + store_information.si_telephone_no + '<br>\
							<br>\
							Credit Payment\
						</div>\
						<table class="table" style="margin-bottom: 0; margin-top: 5px; font-size: 12px;">\
							<tr>\
								<td style="width: 70%; border-top: none; padding: 0px; line-height: 15px;">\
									Delivery Report #: ' + credit_payment.o_order_number + '</span><br>\
									Delivered To: ' + credit_payment.o_delivered_to + '</span>\
								</td>\
								<td style="width: 30%; border-top: none; padding: 0px; line-height: 15px;">\
									Payment Date: ' + renderer_datetime(credit_payment.crp_date) + '</span>\
								</td>\
							</tr>\
						</table>\
						<table class="table" style="margin-bottom: 0; font-size: 12px;">\
							<tr>\
								<td style="width: 15%; border-top: none; padding: 0px; line-height: 15px;">Payed Amount</td>\
								<td style="width: 15%; border-top: none; text-align: right; padding: 0px;">\
									' + renderer_currency(parseFloat(credit_payment.crp_amount_payed)) + '\
								</td>\
								<td style="width: 40%; border-top: none; padding: 0px; line-height: 15px;"></td>\
								<td style="width: 15%; border-top: none; padding: 0px; line-height: 15px;">Total Credit</td>\
								<td style="width: 15%; border-top: none; text-align: right; padding: 0px;">\
									' + renderer_currency(parseFloat(credit_payment.cr_amount)) + '\
								</td>\
							</tr>\
							<tr>\
								<td style="width: 15%; border-top: none; padding: 0px; line-height: 15px;">Amount Tendered</td>\
								<td style="width: 15%; border-top: none; text-align: right; padding: 0px;">\
									' + renderer_currency(parseFloat(credit_payment.crp_amount_tendered)) + '\
								</td>\
								<td style="width: 40%; border-top: none; padding: 0px; line-height: 15px;"></td>\
								<td style="width: 15%; border-top: none; padding: 0px; line-height: 15px;">Remaining Credit</td>\
								<td style="width: 15%; border-top: none; text-align: right; padding: 0px;">\
									' + renderer_currency(parseFloat(credit_payment.remaining_credit)) + '\
								</td>\
							</tr>\
							<tr>\
								<td style="width: 15%; border-top: none; padding: 0px; line-height: 15px;">Change</td>\
								<td style="width: 15%; border-top: none; text-align: right; padding: 0px;">\
									' + renderer_currency(parseFloat(credit_payment.crp_amount_tendered) - parseFloat(credit_payment.crp_amount_payed)) + '\
								</td>\
								<td style="width: 70%; border-top: none; padding: 0px; line-height: 15px;" colspan="3"></td>\
							</tr>\
						</table>\
						<br>\
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
									' + credit_payment.attended_name + '<br>___________________\
								</td>\
							</tr>\
						</table>\
					';
					Ext.Msg.close();
					Print_html(credit_payment_html);
				}
			}
		});
	}
});
