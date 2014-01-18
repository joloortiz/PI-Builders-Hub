Ext.onReady(function() {
	/*
	 * INITIALIZE
	 */

	var opt = '';

	// Set Store
	var store = new Ext.data.Store({
	    fields: ['i_id', 'i_name', 'i_attribute', 'i_selling_price', 'i_purchase_price', 'i_vat', 'i_reorder_level', 'c_id', 'c_name', 'u_id', 'u_name', 'u_slug_name', 's_id', 's_name', 'is_deleted'],
	    pageSize: global_page_size,
	    autoLoad: true,
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
		    	store.getProxy().extraParams.query = Ext.getCmp('search-text').getValue().trim();
		    	store.getProxy().extraParams.show_deleted = Ext.getCmp('show-deleted').getValue();
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

	var unit_store = new Ext.data.Store({
		fields: ['u_id', 'u_name'],
		autoLoad: true,
		proxy: {
	        type: 'ajax',
	        url: global_controller_url + 'get_units',
	        reader: {
	            type: 'json',
	            root: 'data'
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

	// Set Grid
	var grid = new Ext.grid.Panel({
	    renderTo: 'grid-container',
	    store: store,
	    title: '<span class="lead">Items</span>',
	    width: '100%',
	    height: 500,
	    columnLines: true,
	    iconCls: 'extjs-icon-items',
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
	            text: 'Item Name',
	            width: 300,
	            dataIndex: 'i_name',
	            tdCls: 'extjs-bold-text',
	            renderer: renderer_to_upper,
	            locked: true
	        },
	        {
	            text: 'Attribute',
	            width: 150,
	            dataIndex: 'i_attribute',
	            locked: true
	        },
	        {
	            text: 'Selling Price',
	            width: 120,
	            dataIndex: 'i_selling_price',
	            align: 'right',
	            tdCls: 'extjs-bold-text text-success',
	            renderer: renderer_currency
	        },
	        {
	            text: 'Purchase Price',
	            width: 120,
	            dataIndex: 'i_purchase_price',
	            align: 'right',
	            renderer: renderer_currency
	        },
	        {
	            text: 'VAT',
	            width: 75,
	            dataIndex: 'i_vat',
	            align: 'center',
	            renderer: renderer_yes_no_negative
	        },
	        {
	            text: 'Reorder Level',
	            width: 100,
	            dataIndex: 'i_reorder_level',
	            align: 'center',
	            renderer: renderer_number
	        },
	        {
	            text: 'Category',
	            width: 150,
	            dataIndex: 'c_name'
	        },
	        {
	            text: 'Unit',
	            width: 100,
	            dataIndex: 'u_name'
	        },
	        {
	            text: 'Supplier',
	            width: 150,
	            dataIndex: 's_name'
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

	// Set Form Panel
	var form_panel = new Ext.form.Panel({
        id: 'crud_form',
        url: global_controller_url + 'save',
    	bodyPadding: 10,
    	defaults: {
            anchor: '100%'
        },
        fieldDefaults: {
            msgTarget: 'side',
            labelWidth: 100
        },
        items: [
            {
                xtype: 'textfield',
                fieldLabel: 'Item Name',
                afterLabelTextTpl: global_required,
                id: 'frm_name',
                name: 'frm_name',
                emptyText: 'Enter Item Name',
                allowBlank: false,
                maxLength: 100
            },
            {
                xtype: 'textfield',
                fieldLabel: 'Attribute',
                id: 'frm_attribute',
                name: 'frm_attribute',
                emptyText: 'Enter Attrubute (i.e. blue)',
                maxLength: 20
            },
            {
                xtype: 'numberfield',
                fieldLabel: 'Selling Price',
                afterLabelTextTpl: global_required,
                id: 'frm_selling_price',
                name: 'frm_selling_price',
                emptyText: 'Enter Selling Price',
                fieldCls: 'extjs-align-right text-success',
                allowBlank: false,
                maxLength: 10,
                minValue: 0.01
            },
            {
                xtype: 'numberfield',
                fieldLabel: 'Purchase Price',
                afterLabelTextTpl: global_required,
                id: 'frm_purchase_price',
                name: 'frm_purchase_price',
                emptyText: 'Enter Purchase Price',
                fieldCls: 'extjs-align-right',
                allowBlank: false,
                maxLength: 10,
                minValue: 0.01
            },
            {
                xtype: 'checkbox',
                fieldLabel: 'VAT',
                id: 'frm_vat_check',
                name: 'frm_vat_check',
                inputValue: 'true'
            },
            {
                xtype: 'numberfield',
                fieldLabel: 'Reorder Level',
                afterLabelTextTpl: global_required,
                id: 'frm_reorder_level',
                name: 'frm_reorder_level',
                emptyText: 'Enter Reorder Level',
                fieldCls: 'extjs-align-center',
                allowBlank: false,
                maxLength: 4,
                minValue: 0
            },
            {
                xtype: 'combobox',
                fieldLabel: 'Category',
                afterLabelTextTpl: global_required,
                id: 'frm_sel_category',
                name: 'frm_sel_category',
                store: category_store,
                valueField: 'c_id',
                displayField: 'c_name',
                triggerAction: 'all',
                queryMode: 'local',
                emptyText: 'Select Category',
                allowBlank: false,
                forceSelection: true
            },
            {
                xtype: 'combobox',
                fieldLabel: 'Unit',
                afterLabelTextTpl: global_required,
                id: 'frm_sel_unit',
                name: 'frm_sel_unit',
                store: unit_store,
                valueField: 'u_id',
                displayField: 'u_name',
                triggerAction: 'all',
                queryMode: 'local',
                emptyText: 'Select Unit',
                allowBlank: false,
                forceSelection: true
            },
            {
                xtype: 'combobox',
                fieldLabel: 'Supplier',
                afterLabelTextTpl: global_required,
                id: 'frm_sel_supplier',
                name: 'frm_sel_supplier',
                store: supplier_store,
                valueField: 's_id',
                displayField: 's_name',
                triggerAction: 'all',
                queryMode: 'local',
                emptyText: 'Select Supplier',
                allowBlank: false,
                forceSelection: true
            }
        ],
    	buttons: [
	    	{
	    		text: 'Cancel',
	    		iconCls: 'extjs-icon-cancel',
	    		handler: function() {
	    			window_panel.close();
	    		}
	    	},
	    	{
	    		text: 'Save',
	    		iconCls: 'extjs-icon-save',
	    		formBind: true,
	    		handler: function() {
	    			Save();
	    		}
	    	}
	    ]
    });

	// Set Window panel
	var window_panel = new Ext.window.Window({
	    height: 400,
	    width: 400,
	    layout: 'fit',
	    closeAction: 'hide',
	    modal: true,
	    closable: false,
	    resizable: false,
	    items: [form_panel]
	});


	/*
	 * FUNCTIONS
	 */

	// Add
	function Add() {
		opt = 'add';

		Ext.getCmp('crud_form').getForm().reset();

		window_panel.setTitle('Add Item');
		window_panel.setIconCls('extjs-icon-add');
		window_panel.show();
		window_panel.center();

		Ext.getCmp('frm_name').focus();
	}

	// Edit
	function Edit() {
		var selected = grid.getSelectionModel().getSelection();
		var data = selected[0].getData();
		opt = 'edit';

		Ext.getCmp('crud_form').getForm().reset();

		Ext.getCmp('frm_name').setValue(data.i_name);
		Ext.getCmp('frm_attribute').setValue(data.i_attribute);
		Ext.getCmp('frm_selling_price').setValue(data.i_selling_price);
		Ext.getCmp('frm_purchase_price').setValue(data.i_purchase_price);
		Ext.getCmp('frm_vat_check').setValue(data.i_vat);
		Ext.getCmp('frm_reorder_level').setValue(data.i_reorder_level);
		Ext.getCmp('frm_sel_category').setValue(data.c_id);
		Ext.getCmp('frm_sel_unit').setValue(data.u_id);
		Ext.getCmp('frm_sel_supplier').setValue(data.s_id);

		window_panel.setTitle('Edit Item - ' + data.i_name.toUpperCase());
		window_panel.setIconCls('extjs-icon-edit');
		window_panel.show();
		window_panel.center();

		Ext.getCmp('frm_name').focus();
	}

	// Delete
	function Delete() {
		var selected = grid.getSelectionModel().getSelection();
		var data = selected[0].getData();
		opt = 'delete';

		Ext.MessageBox.show({
			title:'Confirmation',
			msg: 'Are you sure to <strong>Delete</strong> the Item <strong>' + data.i_name + '</strong>?',
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
			msg: 'Are you sure to <strong>Restore</strong> the Item <strong>' + data.i_name + '</strong>?',
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

	// Save
	function Save() {
		if(opt != 'delete' && opt != 'restore') {
			// Trim
			Ext.getCmp('frm_name').setValue(Ext.getCmp('frm_name').getValue().trim());
			Ext.getCmp('frm_attribute').setValue(Ext.getCmp('frm_attribute').getValue().trim());

			// Validate
			Ext.getCmp('frm_name').clearInvalid();
			Ext.getCmp('frm_attribute').clearInvalid();
			Ext.Msg.wait('Validating...', 'Please wait');
	        var i_id = '';
	        if(opt == 'edit') {
	        	var selected = grid.getSelectionModel().getSelection();
				var data = selected[0].getData();
				i_id = data.i_id
	        }
	        Ext.Ajax.request({
	            url: global_controller_url + 'check_existing',
	            method: 'POST',
	            params: {
	            	name: Ext.getCmp('frm_name').getValue(),
	            	attribute: Ext.getCmp('frm_attribute').getValue(),
	                i_id: i_id
	            },
	            success: function (response) {
	            	Ext.Msg.close();
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
	                	var is_valid = true;

	                	if(decode.msg_name != '') {
	                		Ext.getCmp('frm_name').markInvalid(decode.msg_name);
							Ext.getCmp('frm_attribute').markInvalid(decode.msg_name);
							is_valid = false;
	                	}

	                	// Save
	                	if(is_valid == true) {
	                		var form = Ext.getCmp('crud_form').getForm();
	                		if(form.isValid()) {
							    Ext.Msg.wait('Saving...', 'Please wait');
							    form.submit({
							    	submitEmptyText: false,
							    	params: {
										opt: opt,
										i_id: i_id
									},
							        success: function(form, action) {
							        	if(opt == 'add') {
							        		form.reset();
							        		Ext.getCmp('frm_name').focus();
							        	} else if(opt == 'edit') {
							        		window_panel.close();
							        	}
							        	Ext.Msg.close();
							        	grid.getStore().reload();
							        },
							        failure: function(form, action) {
							            Ext.Msg.show({
							                title: 'Failed',
							                msg: action.result.msg,
							                buttons: Ext.Msg.OK,
							                icon: Ext.MessageBox.ERROR,
							                closable: false
							            });
							        }
							    });
							}
	                	}
	                }
	            }
	        });
		} else {
			var i_id = '';
			var selected = grid.getSelectionModel().getSelection();
			var data = selected[0].getData();
			i_id = data.i_id

			Ext.Msg.wait('Saving...', 'Please wait');
			Ext.Ajax.request({
				url: global_controller_url + 'save',
	            method: 'POST',
	            params: {
	            	opt: opt,
	                i_id: i_id
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