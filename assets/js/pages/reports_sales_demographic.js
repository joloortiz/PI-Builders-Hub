Ext.onReady(function() {
	/*
	 * INITIALIZE
	 */

	// Set Store
	var store = new Ext.data.Store({
	    fields: [
	    	{name: 'sales', type: 'float'},
	    	{name: 'date', type: 'string'}
	    ],
	    proxy: {
	        type: 'ajax',
	        url: global_controller_url + 'get_sales',
	        reader: {
	            type: 'json',
	            root: 'data'
	        }
	    },
	    listeners: {
	    	beforeload: function(store) {
	    		chart.setLoading(true);
	    		var sales_time = Ext.getCmp('frm_sel_sales_time').getValue();
	    		if(sales_time == 'daterange') {
	    			store.getProxy().extraParams.sales_time = Ext.getCmp('frm_sel_sales_time').getValue();
	    			store.getProxy().extraParams.datefrom = Ext.getCmp('frm_datefrom').getValue();
	    			store.getProxy().extraParams.dateto = Ext.getCmp('frm_dateto').getValue();
	    		} else {
	    			store.getProxy().extraParams.sales_time = Ext.getCmp('frm_sel_sales_time').getValue();
	    		}
		    },
		    load: function() {
		    	var sales_time = Ext.getCmp('frm_sel_sales_time').getValue();

		    	if(sales_time == 'today') {
		    		chart.axes.get('bottom').setTitle('Hours of the Day');
		    	} else if(sales_time == 'week') {
		    		chart.axes.get('bottom').setTitle('Days of the Week');
		    	} else if(sales_time == 'month') {
		    		chart.axes.get('bottom').setTitle('Days of the Month');
		    	} else if(sales_time == 'year') {
		    		chart.axes.get('bottom').setTitle('Months of the Year');
		    	} else if(sales_time == 'daterange') {
		    		chart.axes.get('bottom').setTitle('Days of the Date Range');
		    	}

		    	chart.redraw();
		    	chart.setLoading(false);
		    }
	    }
	});

	var sales_time_store =  new Ext.data.Store({
	    fields: ['value', 'display'],
		data : [
			{value: 'today', display: 'Today'},
			{value: 'week', display: 'Week'},
			{value: 'month', display: 'Month'},
			{value: 'year', display: 'Year'},
			{value: 'daterange', display: 'Date Range'}
		]
	});

	// Set Top Bar
	var top_bar = [
		{
			xtype: 'button',
			text: 'Refresh',
			iconCls: 'extjs-icon-restore',
			iconAlign: 'left',
			handler: function() {
				var sales_time = Ext.getCmp('frm_sel_sales_time').getValue();
				if(sales_time == 'daterange') {
					var datefrom = Ext.getCmp('frm_datefrom').getValue();
					var dateto = Ext.getCmp('frm_dateto').getValue();

					// Check if Date From and Date To has values
					if(datefrom == null || dateto == null) {
						Ext.Msg.show({
							title:'Information',
							msg: 'Please select Date From and Date To',
							buttons: Ext.Msg.OK,
							icon: Ext.Msg.WARNING,
							closable: false
						});
					} else {
						store.reload();
					}
				} else {
					store.reload();
				}
			}
		},
		'-',
		{
            xtype: 'combobox',
            fieldLabel: 'Sales Time',
            id: 'frm_sel_sales_time',
            name: 'frm_sel_sales_time',
            store: sales_time_store,
            valueField: 'value',
            displayField: 'display',
            triggerAction: 'all',
            queryMode: 'local',
            emptyText: 'Select Sales Time',
            editable: false,
            width: 200,
            labelWidth: 70,
			listeners: {
				select: function(me) {
					if(me.getValue() == 'daterange') {
						Show_hide_dates('show');
					} else {
						Show_hide_dates('hide');
						store.reload();
					}
				},
				afterrender: function() {
					Show_hide_dates('hide');
					Ext.getCmp('frm_sel_sales_time').setValue('today');
					store.reload();
				}
			}
        },
        {
        	xtype: 'tbseparator',
        	id: 'toolbar_separator',
    	},
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
        {
        	xtype: 'tbseparator',
        	id: 'toolbar_date_separator'
    	},
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

	// Set Chart
	var chart = new Ext.chart.Chart({
		store: store,
		insetPadding: 30,
		animate: true,
		axes: [
	        {
	            title: 'Sales',
	            type: 'Numeric',
	            position: 'left',
	            fields: 'sales',
	            minorTickSteps: 2,
	            minimum: 0,
	            adjustMinimumByMajorUnit: true,
	            grid: {
					odd: {
						opacity: 0.5,
						fill: '#ddd',
						stroke: '#bbb',
						'stroke-width': 1
					}
				}
	        },
	        {
	            type: 'Category',
	            position: 'bottom',
	            fields: ['date'],
	            label: {
					rotate: {
						degrees: 270
					}
				},
	            grid: true
	        }
	    ],
	    series: [
	        {
	            type: 'line',
	            axis: 'left',
	            xField: 'date',
	            yField: 'sales',
	            smooth: true,
            	fill: true,
            	highlight: {
	                size: 7,
	                radius: 7
	            },
	            markerConfig: {
	                type: 'circle',
	                size: 4,
	                radius: 4,
	                'stroke-width': 0
	            },
	            tips: {
	            	width: 100,
	                trackMouse: true,
	                renderer: function(storeItem, item) {
	                    this.setTitle(storeItem.get('date'));
	                    this.update(renderer_currency(storeItem.get('sales')));
	                }
	            }
	        }
	    ]
	});

	// Set Panel
	var panel = new Ext.panel.Panel({
		renderTo: 'grid-container',
		title: '<span class="lead">Sales Demographic</span>',
		width: '100%',
		height: 500,
		layout: 'fit',
		iconCls: 'extjs-icon-chart',
		tbar: top_bar,
		items: chart
	});


	/*
	 * FUNCTIONS
	 */

	// Show/Hide Dates
	function Show_hide_dates(type) {
		if(type == 'show') {
			Ext.getCmp('toolbar_separator').show();
			Ext.getCmp('frm_datefrom').show();
			Ext.getCmp('toolbar_date_separator').show();
			Ext.getCmp('frm_dateto').show();

			Ext.getCmp('frm_datefrom').setValue('');
			Ext.getCmp('frm_dateto').setValue('');
		} else {
			Ext.getCmp('toolbar_separator').hide();
			Ext.getCmp('frm_datefrom').hide();
			Ext.getCmp('toolbar_date_separator').hide();
			Ext.getCmp('frm_dateto').hide();
		}
	}
});