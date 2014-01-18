Ext.onReady(function() {
	/*
	 * INITIALIZE
	 */

	// Override to fire collapsebody & expandbody
	Ext.override(Ext.grid.plugin.RowExpander, { 
		init: function(grid) {
			this.callParent(arguments);
			grid.getView().addEvents('collapsebody', 'expandbody');
		}
	});

	// Set Store
	var store = new Ext.data.Store({
	    fields: ['i_id', 'i_name', 'i_attribute', 'i_selling_price', 'i_purchase_price', 'i_vat', 'qty', 'discount', 'subtotal']
	});

	var item_store =  new Ext.data.Store({
	    fields: [
	    	{name: 'item_id', mapping: 'i_id'},
	    	{name: 'item_name', mapping: 'i_name'},
	    	{name: 'item_attribute', mapping: 'i_attribute'},
	    	{name: 'item_description', mapping: 'i_description'},
	    	{name: 'item_selling_price', mapping: 'i_selling_price'},
	    	{name: 'item_purchase_price', mapping: 'i_purchase_price'},
	    	{name: 'item_vat', mapping: 'i_vat'},
	    	{name: 'category_id', mapping: 'c_id'},
	    	{name: 'category_name', mapping: 'c_name'},
	    	{name: 'unit_id', mapping: 'u_id'},
	    	{name: 'unit_name', mapping: 'u_name'},
    		{name: 'unit_slug_name', mapping: 'u_slug_name'},
	    	{name: 'supplier_id', mapping: 's_id'},
	    	{name: 'supplier_name', mapping: 's_name'}
	    ],
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
		    	store.getProxy().extraParams.c_id = Ext.getCmp('frm_sel_category').getValue();
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
            editable: false,
            width: '20%',
            labelWidth: 60,
            value: 'All'
        },
		{
			xtype: 'combobox',
			id: 'frm_sel_item',
            name: 'frm_sel_item',
			store: item_store,
			valueField: 'i_id',
			displayField: 'i_name',
			emptyText: 'Enter Search query',
			typeAhead: false,
            hideLabel: true,
            hideTrigger:true,
            width: '80%',
            pageSize: global_page_size,
            minChars: 0,
            listConfig: {
                emptyText: 'No Items found.',
                maxHeight: 400,
                getInnerTpl: function() {
                    return '<div class="row-fluid">' +
                        '<div class="span4">' +
                        	'<strong>{item_name}</strong><br>'+
                        	'<small>' +
	                        	'Attribute: <strong>{item_attribute}</strong><br>'+
	                        	'Category: <strong>{category_name}</strong>'+
                        	'</small>' +
                        '</div>' +
                        '<div class="span3">' +
                        	'Selling Price: <strong class="text-success">{[Ext.util.Format.currency(values.item_selling_price, \'₱&emsp;\')]}</strong><br>' +
                        	'<small>' +
	                        	'Purchase Price: <strong>{[Ext.util.Format.currency(values.item_purchase_price, \'₱&emsp;\')]}</strong><br>'+
	                        	'VAT: <strong>{[renderer_yes_no_negative(values.item_vat)]}</strong>'+
                        	'</small>' +
                        '</div>' +
                        '<div class="span3">' +
                        	'<br>' +
                        	'<small>' +
	                        	'Unit: <strong>{unit_name} ({unit_slug_name})</strong><br>'+
	                        	'Supplier: <strong>{supplier_name}</strong>'+
                        	'</small>' +
                        '</div>' +
                    '</div>' +
                    '<br>';
                }
            },
            listeners: {
            	select: function(combo, records) {
            		Add_item(records[0]);
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
			id: 'btn_proceed_cashier',
			text: 'Proceed to Cashier',
			iconCls: 'extjs-icon-cashiering-large',
			scale: 'large',
			handler: function() {
				Proceed_to_cashiering();
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
	    title: 'Order Taking',
	    width: '100%',
	    height: 500,
	    columnLines: true,
	    iconCls: 'extjs-icon-order-taking',
	    tbar: top_bar,
	    bbar: bottom_bar,
	    plugins: [{
            ptype: 'rowexpander',
            pluginId: 'rowexpander',
            expandOnDblClick: false,
            expandOnEnter: false,
            selectRowOnExpand: true,
            rowBodyTpl : new Ext.XTemplate(
                '<div class="row-fluid" style="margin-top: 5px;">',
                	'<div class="span2 offset8">',
                		'<div id="btn_qty_discount_container_{i_id}" class="pull-right"></div>',
                	'</div>',
                	'<div class="span2">',
                		'<div id="btn_remove_container_{i_id}" class="pull-right"></div>',
                	'</div>',
                '</div>'
			)
        }],
	    columns: [
	    	{
				xtype: 'actioncolumn',
				text: 'Action',
				width: 60,
				items: [
					{
						iconCls: 'extjs-icon-edit'
					},
					{
						iconCls: 'extjs-icon-delete pull-right'
					}
				]
	    	},
	        {
	            text: 'Item Name',
	            width: 300,
	            dataIndex: 'i_name',
	            tdCls: 'extjs-bold-text',
	            renderer: renderer_to_upper,
	            sortable: false,
	            draggable: false
	        },
	        {
	            text: 'Attribute',
	            width: 150,
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
	            width: 75,
	            dataIndex: 'i_vat',
	            align: 'center',
	            renderer: renderer_yes_no_negative,
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
	            text: 'Discount',
	            width: 120,
	            dataIndex: 'discount',
	            align: 'right',
	            renderer: renderer_currency,
	            sortable: false,
	            draggable: false
	        },
	        {
	            text: 'Subtotal',
	            width: 120,
	            dataIndex: 'subtotal',
	            align: 'right',
	            tdCls: 'extjs-bold-text text-info',
	            renderer: renderer_currency,
	            sortable: false,
	            draggable: false
	        }
	    ],
	    listeners: {
	    	select: function(me, record, index) {
	    		var rowExpander = grid.getPlugin('rowexpander');
	    		var rowCollapsedCls = Ext.baseCSSPrefix + 'grid-row-collapsed';

				for(var i = 0; i < grid.getStore().count(); i++) {
					var rowNode = grid.getView().getNode(i);
					var row = Ext.fly(rowNode, '_rowExpander');
					var isCollapsed = row.hasCls(rowExpander.rowCollapsedCls);

					if(i == index) {
						if(isCollapsed == true) {
							rowExpander.toggleRow(i, record)
						}
					} else {
						if(isCollapsed == false) {
							rowExpander.toggleRow(i, record)
						}
					}
				}
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
	    		iconCls: 'extjs-icon-save',
	    		handler: function() {
	    			Update_qty_discount();
	    			qty_discount_window_panel.close();
	    		}
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

	Ext.getCmp('frm_sel_item').focus();
	Ext.getCmp('btn_cancel_order').disable();
	Ext.getCmp('btn_proceed_cashier').disable();

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
				qty: 1,
				discount: 0,
				subtotal: (1 * data.item_selling_price)
			};

			// Add item
			var rec = grid.getStore().add(item_data);
			grid.getSelectionModel().select(rec);
		}

		Ext.getCmp('btn_cancel_order').enable();
		Ext.getCmp('btn_proceed_cashier').enable();

		Update_total_values();
	}

	// Update Qty/Discount
	function Update_qty_discount() {
		var record = grid.getSelectionModel().getSelection();
		var record = record[0];
		var index = grid.getStore().indexOf(record);
		var qty = Ext.getCmp('frm_qty').getValue();
		var discount = Ext.getCmp('frm_discount').getValue();
		var selling_price = record.getData().i_selling_price;
		
		// Set Data
		record.set('qty', qty);
		record.set('discount', discount);
		record.set('subtotal', ((selling_price * qty) - (discount * qty)));
		grid.getStore().commitChanges();

		// Refresh Row Expander since the content of it disappears during store commit
		var rowExpander = grid.getPlugin('rowexpander');
		rowExpander.toggleRow(index, record);
		rowExpander.toggleRow(index, record);

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
		Ext.getCmp('btn_proceed_cashier').disable();
		Ext.getCmp('frm_sel_item').focus();
	}

	// Proceed to Cashiering
	function Proceed_to_cashiering() {
		Ext.Msg.wait('Processing...', 'Please wait');

		// Get Items from rows
		var items = new Array();
		grid.getStore().each(function(record) {
			var data = record.getData();
			item_details = {
				id: data.i_id,
				selling_price: data.i_selling_price,
				purchase_price: data.i_purchase_price,
				vat: data.i_vat,
				qty: data.qty,
				discount: data.discount
			};
			items.push(item_details);
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
					Ext.Msg.close();
					Cancel_order();
				}
			}
		});
	}


	/*
	 * EVENTS
	 */

	// Grid Rowexpander Expandbody
	grid.getView().addListener('expandbody', function(rowNode, record, expandRow) {
		var btn_qty_discount = Ext.get('btn_qty_discount_' + record.get('i_id'));
		var btn_remove = Ext.get('btn_remove_' + record.get('i_id'));
		
		if(!btn_qty_discount) {
			var button = new Ext.Button({
				id: 'btn_qty_discount_' + record.get('i_id'),
			    text: 'Update Qty/Discount',
			    iconCls: 'extjs-icon-edit',
				iconAlign: 'left',
			    renderTo: 'btn_qty_discount_container_' + record.get('i_id'),
			    handler: function() {
			    	Ext.getCmp('qty_discount_form').getForm().reset();

			    	var rec = grid.getSelectionModel().getSelection();
			    	var data = rec[0].getData();
			    	Ext.getCmp('frm_qty').setValue(data.qty);
			    	Ext.getCmp('frm_discount').setValue(data.discount);
			    	Ext.getCmp('frm_discount').setMaxValue(data.i_purchase_price);

			    	qty_discount_window_panel.show();
					qty_discount_window_panel.center();
			    }
			});
		}
		if(!btn_remove) {
			var button = new Ext.Button({
				id: 'btn_remove_' + record.get('i_id'),
			    text: 'Remove',
			    iconCls: 'extjs-icon-delete',
			    iconAlign: 'left',
			    renderTo: 'btn_remove_container_' + record.get('i_id'),
			    handler: function() {
			    	grid.getStore().remove(grid.getSelectionModel().getSelection());
			    	if(grid.getStore().count() == 0) {
			    		Ext.getCmp('btn_cancel_order').disable();
			    		Ext.getCmp('btn_proceed_cashier').disable();
			    	}

			    	Update_total_values();
			    }
			});
		}
	});
});
