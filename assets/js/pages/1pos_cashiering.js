Ext.onReady(function() {
	/*
	 * INITIALIZE
	 */

	var opt = '';

	// Set Store
	var store = new Ext.data.Store({
	    fields: ['o_id', 'o_order_number', 'o_date', 'o_type', 'o_status', 'o_attended_by', 'attended_name', 'processed_name', 'total'],
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
		    	store.getProxy().extraParams.type = Ext.getCmp('frm_sel_order_type').getValue();
		    }
	    }
	});

	var order_type_store =  new Ext.data.Store({
	    fields: ['value', 'display'],
		data : [
			{value: 'all', display: 'All'},
			{value: 'S', display: 'Sales'},
			{value: 'R', display: 'Return'}
		]
	});

	var item_store = new Ext.data.Store({
	    fields: ['i_id', 'i_name', 'i_attribute', 'o_selling_price', 'o_discount', 'o_qty', 'subtotal'],
	    proxy: {
	        type: 'ajax',
	        url: global_controller_url + 'get_items',
	        reader: {
	            type: 'json',
	            root: 'data'
	        }
	    },
	    listeners: {
	    	beforeload: function(store) {
	    		var selected = grid.getSelectionModel().getSelection();
				var data = selected[0].getData();
		    	store.getProxy().extraParams.o_id = data.o_id;
		    }
	    }
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
		{
			xtype: 'button',
			text: 'Process Order',
			id: 'btn_process',
			iconCls: 'extjs-icon-money',
			iconAlign: 'left',
			handler: function () {
				if(grid.getSelectionModel().hasSelection()) {
					Process();
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
            fieldLabel: 'Order Type',
            id: 'frm_sel_order_type',
            name: 'frm_sel_order_type',
            store: order_type_store,
            valueField: 'value',
            displayField: 'display',
            triggerAction: 'all',
            queryMode: 'local',
            emptyText: 'Select Category',
            editable: false,
            width: 150,
            labelWidth: 70,
            value: 'S',
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
	    title: 'Cashiering',
	    width: '100%',
	    height: 500,
	    columnLines: true,
	    iconCls: 'extjs-icon-cashiering',
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
	            text: 'Order Type',
	            width: 100,
	            dataIndex: 'o_type',
	            tdCls: 'extjs-bold-text',
	            renderer: renderer_order_type
	        },
	        {
	            text: 'Order #',
	            width: 60,
	            dataIndex: 'o_order_number',
	            tdCls: 'extjs-bold-text',
	            align: 'center'
	        },
	        {
	            text: 'Total',
	            width: 100,
	            dataIndex: 'total',
	            tdCls: 'extjs-bold-text text-info',
	            align: 'right',
	            renderer: renderer_currency
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

	var item_grid = new Ext.grid.Panel({
	    store: item_store,
	    title: 'Ordered Items',
	    width: '100%',
	    height: 200,
	    columnLines: true,
	    iconCls: 'extjs-icon-bricks',
	    columns: [
	    	{
	            text: 'Item Name',
	            width: 100,
	            dataIndex: 'o_type',
	            tdCls: 'extjs-bold-text',
	            renderer: renderer_order_type
	        }
	    ]
	});


	/*
	 * FUNCTIONS
	 */

	// Void
	function Void() {
		var selected = grid.getSelectionModel().getSelection();
		var data = selected[0].getData();
		opt = 'void';

		Ext.MessageBox.show({
			title:'Confirmation',
			msg: 'Are you sure to <strong>Void</strong> the <strong class="text-' + (data.o_type == 'S' ? 'success' : 'error') + '">' + (data.o_type == 'S' ? 'Sales' : 'Return') + '</strong> Order # <strong>' + data.o_order_number + '</strong>?',
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

	// Process
	function Process() {

	}

	// Save
	function Save() {
		var o_id = '';
		var selected = grid.getSelectionModel().getSelection();
		var data = selected[0].getData();
		o_id = data.o_id

		Ext.Msg.wait('Saving...', 'Please wait');
		Ext.Ajax.request({
			url: global_controller_url + 'save',
            method: 'POST',
            params: {
            	opt: opt,
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
});
