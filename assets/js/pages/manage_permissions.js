Ext.onReady(function() {
	/*
	 * INITIALIZE
	 */

	var opt = '';

	// Set Store
	var store = new Ext.data.Store({
	    fields: ['mug_id', 'mug_name', 'is_deleted'],
	    pageSize: global_page_size,
	    autoLoad: true,
	    proxy: {
	        type: 'ajax',
	        url: global_controller_url + 'get_module_user_groups',
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

	var module_menu_items_store = new Ext.data.Store({
	    fields: ['mmi_id', 'mmi_name', 'mmg_id', 'mmg_name', 'checked'],
	    groupField: 'mmg_name',
	    proxy: {
	        type: 'ajax',
	        url: global_controller_url + 'get_module_menu_items',
	        reader: {
	            type: 'json',
	            root: 'data'
	        }
	    },
	    listeners: {
	    	beforeload: function(store) {
	    		if(opt == 'edit') {
	    			var selected = grid.getSelectionModel().getSelection();
					var data = selected[0].getData();
			    	store.getProxy().extraParams.mug_id = data.mug_id;
	    		}
		    },
		    load: function(store, records) {
		    	if(opt == 'edit') {
		    		var selected_records = [];
			    	Ext.each(records, function(rec) {
			    		var data = rec.getData();
			    		if(data.checked == '1') {
			    			selected_records.push(rec);
			    		}
			    	});
			    	module_menu_items_sel_model.select(selected_records);
		    	}
		    }
	    }
	});

	// Set Selection Model
	var module_menu_items_sel_model = new Ext.selection.CheckboxModel({
		checkOnly: true
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
	    title: '<span class="lead">User Groups & Permissions</span>',
	    width: '100%',
	    height: 500,
	    columnLines: true,
	    iconCls: 'extjs-icon-user-groups-permissions',
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
	            text: 'User Group',
	            width: 300,
	            dataIndex: 'mug_name',
	            tdCls: 'extjs-bold-text',
	            renderer: renderer_to_upper
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

	var module_menu_items_grid = new Ext.grid.Panel({
	    store: module_menu_items_store,
	    title: 'Module Menu Items',
	    width: '100%',
	    height: 350,
	    style: 'margin-top: 20px',
	    columnLines: true,
	    iconCls: 'extjs-icon-module-menu-items',
	    selModel: module_menu_items_sel_model,
	    features: [{
	    	ftype:'grouping',
	    	groupHeaderTpl: '{name}',
	    	collapsible: false
	    }],
	    columns: [
	        {
	            text: 'Module Menu Item',
	            width: 250,
	            dataIndex: 'mmi_name'
	        }
	    ]
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
            labelWidth: 120
        },
        items: [
            {
                xtype: 'textfield',
                fieldLabel: 'User Group Name',
                afterLabelTextTpl: global_required,
                id: 'frm_name',
                name: 'frm_name',
                emptyText: 'Enter User Group Name',
                allowBlank: false,
                maxLength: 50
            },
            module_menu_items_grid
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
	    height: 500,
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

		module_menu_items_grid.getStore().reload();

		window_panel.setTitle('Add User Group');
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

		Ext.getCmp('frm_name').setValue(data.mug_name);
		module_menu_items_grid.getStore().reload();

		window_panel.setTitle('Edit User Group - ' + data.mug_name.toUpperCase());
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
			msg: 'Are you sure to <strong>Delete</strong> the User Group <strong>' + data.mug_name + '</strong>?',
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
			msg: 'Are you sure to <strong>Restore</strong> the User Group <strong>' + data.mug_name + '</strong>?',
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

			// Validate
			Ext.getCmp('frm_name').clearInvalid();
			Ext.Msg.wait('Validating...', 'Please wait');
	        var mug_id = '';
	        if(opt == 'edit') {
	        	var selected = grid.getSelectionModel().getSelection();
				var data = selected[0].getData();
				mug_id = data.mug_id
	        }
	        Ext.Ajax.request({
	            url: global_controller_url + 'check_existing',
	            method: 'POST',	
	            params: {
	            	name: Ext.getCmp('frm_name').getValue(),
	                mug_id: mug_id
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
							is_valid = false;
	                	}

	                	// Save
	                	if(is_valid == true) {
	                		var form = Ext.getCmp('crud_form').getForm();
	                		if(form.isValid()) {
							    Ext.Msg.wait('Saving...', 'Please wait');

							    // Get Checked Module Menu Items
							    var module_menu_items = new Array();
							    var selected = module_menu_items_sel_model.getSelection();
							    Ext.each(selected, function(sel) {
							    	var data = sel.getData();
							    	module_menu_items.push(data.mmi_id);
							    })
							    
							    form.submit({
							    	submitEmptyText: false,
							    	params: {
										opt: opt,
										mug_id: mug_id,
										module_menu_items: Ext.JSON.encode(module_menu_items)
									},
							        success: function(form, action) {
							        	if(opt == 'add') {
							        		form.reset();
							        		Ext.getCmp('frm_name').focus();
							        		module_menu_items_grid.getStore().reload();
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
			var mug_id = '';
			var selected = grid.getSelectionModel().getSelection();
			var data = selected[0].getData();
			mug_id = data.mug_id

			Ext.Msg.wait('Saving...', 'Please wait');
			Ext.Ajax.request({
				url: global_controller_url + 'save',
	            method: 'POST',
	            params: {
	            	opt: opt,
	                mug_id: mug_id
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
