Ext.onReady(function() {
	/*
	 * INITIALIZE
	 */

	var opt = '';

	// Set Store
	var store = new Ext.data.Store({
	    fields: ['e_id', 'e_fname', 'e_lname', 'e_mname', 'e_username', 'mug_id', 'mug_name', 'is_deleted'],
	    pageSize: global_page_size,
	    autoLoad: true,
	    proxy: {
	        type: 'ajax',
	        url: global_controller_url + 'get_employees',
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

	var user_group_store = new Ext.data.Store({
		fields: ['mug_id', 'mug_name'],
		autoLoad: true,
		proxy: {
	        type: 'ajax',
	        url: global_controller_url + 'get_module_user_groups',
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
	    title: '<span class="lead">Employees</span>',
	    width: '100%',
	    height: 500,
	    columnLines: true,
	    iconCls: 'extjs-icon-employees',
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
	            text: 'First Name',
	            width: 150,
	            dataIndex: 'e_fname',
	            tdCls: 'extjs-bold-text',
	            renderer: renderer_to_upper
	        },
	        {
	            text: 'Last Name',
	            width: 150,
	            dataIndex: 'e_lname',
	            tdCls: 'extjs-bold-text',
	            renderer: renderer_to_upper
	        },
	        {
	            text: 'Middle Name',
	            width: 150,
	            dataIndex: 'e_mname',
	            tdCls: 'extjs-bold-text',
	            renderer: renderer_to_upper
	        },
	        {
	            text: 'Username',
	            width: 150,
	            dataIndex: 'e_username'
	        },
	        {
	            text: 'User Group',
	            width: 150,
	            dataIndex: 'mug_name'
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
            labelWidth: 120
        },
        items: [
            {
                xtype: 'textfield',
                fieldLabel: 'First Name',
                afterLabelTextTpl: global_required,
                id: 'frm_fname',
                name: 'frm_fname',
                emptyText: 'Enter First Name',
                allowBlank: false,
                maxLength: 50
            },
            {
                xtype: 'textfield',
                fieldLabel: 'Last Name',
                afterLabelTextTpl: global_required,
                id: 'frm_lname',
                name: 'frm_lname',
                emptyText: 'Enter Last Name',
                allowBlank: false,
                maxLength: 50
            },
            {
                xtype: 'textfield',
                fieldLabel: 'Middle Name',
                id: 'frm_mname',
                name: 'frm_mname',
                emptyText: 'Enter Middle Name',
                maxLength: 50
            },
            {
                xtype: 'combobox',
                fieldLabel: 'User Group',
                afterLabelTextTpl: global_required,
                id: 'frm_sel_user_group',
                name: 'frm_sel_user_group',
                store: user_group_store,
                valueField: 'mug_id',
                displayField: 'mug_name',
                triggerAction: 'all',
                queryMode: 'local',
                emptyText: 'Select User Group',
                allowBlank: false,
                editable: false
            },
            {
                xtype: 'textfield',
                fieldLabel: 'Username',
                afterLabelTextTpl: global_required,
                id: 'frm_username',
                name: 'frm_username',
                emptyText: 'Enter Username',
                allowBlank: false,
                minLength: 5,
                maxLength: 20
            },
            {
                xtype: 'checkbox',
                id: 'frm_password_check',
                name: 'frm_password_check',
                boxLabel: '123456',
                listeners: {
					change: function(checkbox, new_value, old_value) {
						if(opt == 'add') {
							if(new_value == true) {
								Ext.getCmp('frm_password').setValue('');
								Ext.getCmp('frm_confirm_password').setValue('');
								Ext.getCmp('frm_password').disable();
								Ext.getCmp('frm_confirm_password').disable();
							} else {
								Ext.getCmp('frm_password').enable();
								Ext.getCmp('frm_confirm_password').enable();
							}
						} else if(opt == 'edit') {
							if(new_value == true) {
								Ext.getCmp('frm_password').enable();
								Ext.getCmp('frm_confirm_password').enable();
							} else {
								Ext.getCmp('frm_password').setValue('');
								Ext.getCmp('frm_confirm_password').setValue('');
								Ext.getCmp('frm_password').disable();
								Ext.getCmp('frm_confirm_password').disable();
							}
						}
						Ext.getCmp('crud_form').getForm().checkValidity();
					}
				}
            },
            {
                xtype: 'textfield',
                fieldLabel: 'Password',
                afterLabelTextTpl: global_required,
                id: 'frm_password',
                name: 'frm_password',
                inputType: 'password',
                emptyText: 'Enter Password',
                allowBlank: false,
                minLength: 5
            },
            {
                xtype: 'textfield',
                fieldLabel: 'Confirm Password',
                afterLabelTextTpl: global_required,
                id: 'frm_confirm_password',
                name: 'frm_confirm_password',
                inputType: 'password',
                emptyText: 'Confirm Password',
                vtype: 'password',
            	initialPassField: 'frm_password',
                allowBlank: false,
                minLength: 5
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
	    height: 350,
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

		Ext.getCmp('frm_password_check').setFieldLabel('Default Password');
		Ext.getCmp('frm_password_check').setBoxLabel('123456');
		Ext.getCmp('frm_password_check').setValue(false);
		Ext.getCmp('frm_password_check').setValue(true);

		window_panel.setTitle('Add Employee');
		window_panel.setIconCls('extjs-icon-add');
		window_panel.show();
		window_panel.center();

		Ext.getCmp('frm_fname').focus();
	}

	// Edit
	function Edit() {
		var selected = grid.getSelectionModel().getSelection();
		var data = selected[0].getData();
		opt = 'edit';

		Ext.getCmp('crud_form').getForm().reset();
		
		Ext.getCmp('frm_password_check').setFieldLabel('Change Password');
		Ext.getCmp('frm_password_check').setBoxLabel(' ');
		Ext.getCmp('frm_password_check').setValue(true);
		Ext.getCmp('frm_password_check').setValue(false);

		Ext.getCmp('frm_fname').setValue(data.e_fname);
		Ext.getCmp('frm_lname').setValue(data.e_lname);
		Ext.getCmp('frm_mname').setValue(data.e_mname);
		Ext.getCmp('frm_sel_user_group').setValue(data.mug_id);
		Ext.getCmp('frm_username').setValue(data.e_username);

		window_panel.setTitle('Edit Employee - ' + data.e_fname.toUpperCase() + ' ' + data.e_lname.toUpperCase());
		window_panel.setIconCls('extjs-icon-edit');
		window_panel.show();
		window_panel.center();

		Ext.getCmp('frm_fname').focus();
	}

	// Delete
	function Delete() {
		var selected = grid.getSelectionModel().getSelection();
		var data = selected[0].getData();
		opt = 'delete';

		Ext.MessageBox.show({
			title:'Confirmation',
			msg: 'Are you sure to <strong>Delete</strong> the Employee <strong>' + data.e_fname + ' ' + data.e_lname + '</strong>?',
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
			msg: 'Are you sure to <strong>Restore</strong> the Employee <strong>' + data.e_fname + ' ' + data.e_lname + '</strong>?',
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
			Ext.getCmp('frm_fname').setValue(Ext.getCmp('frm_fname').getValue().trim());
			Ext.getCmp('frm_lname').setValue(Ext.getCmp('frm_lname').getValue().trim());
			Ext.getCmp('frm_mname').setValue(Ext.getCmp('frm_mname').getValue().trim());
			Ext.getCmp('frm_username').setValue(Ext.getCmp('frm_username').getValue().trim());

			// Validate
			Ext.getCmp('frm_fname').clearInvalid();
			Ext.getCmp('frm_lname').clearInvalid();
			Ext.getCmp('frm_mname').clearInvalid();
			Ext.getCmp('frm_username').clearInvalid();
			Ext.Msg.wait('Validating...', 'Please wait');
	        var e_id = '';
	        if(opt == 'edit') {
	        	var selected = grid.getSelectionModel().getSelection();
				var data = selected[0].getData();
				e_id = data.e_id
	        }
	        Ext.Ajax.request({
	            url: global_controller_url + 'check_existing',
	            method: 'POST',
	            params: {
	            	fname: Ext.getCmp('frm_fname').getValue(),
	            	lname: Ext.getCmp('frm_lname').getValue(),
	            	mname: Ext.getCmp('frm_mname').getValue(),
	                username: Ext.getCmp('frm_username').getValue(),
	                e_id: e_id
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
	                		Ext.getCmp('frm_fname').markInvalid(decode.msg_name);
							Ext.getCmp('frm_lname').markInvalid(decode.msg_name);
							Ext.getCmp('frm_mname').markInvalid(decode.msg_name);
							is_valid = false;
	                	}
	                	if(decode.msg_username != '') {
	                		Ext.getCmp('frm_username').markInvalid(decode.msg_username);
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
										e_id: e_id
									},
							        success: function(form, action) {
							        	if(opt == 'add') {
							        		form.reset();

							        		Ext.getCmp('frm_password_check').setFieldLabel('Default Password');
											Ext.getCmp('frm_password_check').setBoxLabel('123456');
											Ext.getCmp('frm_password_check').setValue(false);
											Ext.getCmp('frm_password_check').setValue(true);

							        		Ext.getCmp('frm_fname').focus();
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
			var e_id = '';
			var selected = grid.getSelectionModel().getSelection();
			var data = selected[0].getData();
			e_id = data.e_id

			Ext.Msg.wait('Saving...', 'Please wait');
			Ext.Ajax.request({
				url: global_controller_url + 'save',
	            method: 'POST',
	            params: {
	            	opt: opt,
	                e_id: e_id
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
