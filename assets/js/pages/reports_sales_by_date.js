Ext.onReady(function() {
	/*
	 * INITIALIZE
	 */

	// Set Store
	var store = new Ext.data.Store({
		fields: ['sales', 'date'],
		autoLoad: true,
		proxy: {
			type: 'ajax',
			url: global_controller_url + 'get_sales_by_date',
			reader: {
				type: 'json',
				root: 'data'
			}
		},
	    listeners: {
	    	beforeload: function(store) {
		    	store.getProxy().extraParams.datefrom = Ext.getCmp('frm_datefrom').getValue();
		    	store.getProxy().extraParams.dateto = Ext.getCmp('frm_dateto').getValue();
		    },
		    load: function(store, records) {
		    	var total_sales = 0;

				Ext.Array.each(records, function(rec, index) {
					var data = rec.getData();
					total_sales += parseFloat(data.sales);
				});
				Ext.getCmp('text_total_sales').setText(renderer_currency_no_sign(total_sales));
		    }
	    }
	});

	// Set Top Bar
	var top_bar = [
		{
			xtype: 'button',
			text: 'Refresh',
			iconCls: 'extjs-icon-restore',
			iconAlign: 'left',
			handler: function() {
				store.reload();
			}
		},
		{
			xtype: 'button',
			text: 'Export',
			iconCls: 'extjs-icon-export-excel',
			iconAlign: 'left',
			handler: function() {
				Export_sales_by_date();
			}
		},
		'-',
		{
            xtype: 'datefield',
            fieldLabel: 'Date From',
            id: 'frm_datefrom',
            name: 'frm_datefrom',
            editable: false,
            format: 'M j, Y',
            labelWidth: 70,
            width: 200,
            maxValue: new Date(),
            listeners: {
            	select: function(me) {
            		var datefrom = Ext.getCmp('frm_datefrom').getValue();
            		var dateto = Ext.getCmp('frm_dateto').getValue();
            		if(datefrom != null && dateto != null) {
            			if(dateto < datefrom) {
            				me.setValue('');
            				Ext.Msg.show({
								title:'Information',
								msg: 'Date From should be less than or equal to Date To',
								buttons: Ext.Msg.OK,
								icon: Ext.Msg.WARNING,
								closable: false
							});
            			}
            		}
            	}
            }
        },
        '-',
        {
            xtype: 'datefield',
            fieldLabel: 'Date To',
            id: 'frm_dateto',
            name: 'frm_dateto',
            editable: false,
            format: 'M j, Y',
            labelWidth: 50,
            width: 180,
            maxValue: new Date(),
            listeners: {
            	select: function(me) {
            		var datefrom = Ext.getCmp('frm_datefrom').getValue();
            		var dateto = Ext.getCmp('frm_dateto').getValue();
            		if(datefrom != null && dateto != null) {
            			if(dateto < datefrom) {
            				me.setValue('');
            				Ext.Msg.show({
								title:'Information',
								msg: 'Date From should be less than or equal to Date To',
								buttons: Ext.Msg.OK,
								icon: Ext.Msg.WARNING,
								closable: false
							});
            			}
            		}
            	}
            }
        }
	];

	// Set Bottom Bar
	var bottom_bar = [
		{
			xtype: 'text',
			text: 'Total Sales:',
			cls: 'lead'
		},
		{
			xtype: 'text',
			id: 'text_total_sales',
			cls: 'lead extjs-bold-text',
			width: '40%'
		}
	];

	// Set Grid
	var grid = new Ext.grid.Panel({
	    renderTo: 'grid-container',
	    store: store,
	    title: '<span class="lead">Sales By Date</span>',
	    width: '100%',
	    height: 500,
	    columnLines: true,
	    iconCls: 'extjs-icon-time',
	    tbar: top_bar,
	    bbar: bottom_bar,
	    columns: [
	        {
	            text: 'Date',
	            width: 150,
	            dataIndex: 'date',
	            renderer: renderer_date
	        },
	        {
	            text: 'Sales',
	            width: 120,
	            dataIndex: 'sales',
	            align: 'right',
	            tdCls: 'extjs-bold-text text-success',
	            renderer: renderer_currency
	        }
	    ]
	});


	/*
	 * FUNCTIONS
	 */

	// Export Sales By Date
	function Export_sales_by_date() {
		Ext.Msg.wait('Exporting...', 'Please wait');
		Ext.Ajax.request({
			url: global_controller_url + 'export_sales_by_date',
            method: 'POST',
            params: {
            	datefrom: Ext.getCmp('frm_datefrom').getValue(),
            	dateto: Ext.getCmp('frm_dateto').getValue()
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
                	Ext.Msg.wait('Downloading File...', 'Please wait');
                	window.location = global_controller_url + 'download_sales_by_date?filename=' + decode.filename;
                	Ext.Msg.close();
                }
            }
		});
	}
});