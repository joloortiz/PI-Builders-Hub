Ext.onReady(function() {
	/*
	 * INITIALIZE
	 */

	var opt = '';

	// Set Store
	var store = new Ext.data.Store({
	    fields: ['mmi_id', 'mmi_name', 'mmi_link', 'mmi_order', 'mmi_description', 'mmg_id', 'mmg_name', 'mmg_link', 'is_deleted'],
	    pageSize: global_page_size,
	    autoLoad: true,
	    proxy: {
	        type: 'ajax',
	        url: global_controller_url + 'get_module_menu_items',
	        reader: {
	            type: 'json',
	            root: 'data',
	            totalProperty: 'total'
	        }
	    },
	    listeners: {
	    	beforeload: function(store) {
		    	store.getProxy().extraParams.query = Ext.getCmp('search-text').getValue().trim();
		    	store.getProxy().extraParams.mmg_id = Ext.getCmp('frm_sel_module_menu_group_all').getValue();
		    }
	    }
	});

	var module_menu_group_store = new Ext.data.Store({
	    fields: ['mmg_id', 'mmg_name'],
	    autoLoad: true,
	    proxy: {
	        type: 'ajax',
	        url: global_controller_url + 'get_module_menu_groups',
	        reader: {
	            type: 'json',
	            root: 'data'
	        }
	    }
	});

	var module_menu_group_store_all = new Ext.data.Store({
	    fields: ['mmg_id', 'mmg_name'],
	    autoLoad: true,
	    proxy: {
	        type: 'ajax',
	        url: global_controller_url + 'get_module_menu_groups_all',
	        reader: {
	            type: 'json',
	            root: 'data'
	        }
	    },
	    listeners: {
	    	load: function() {
	    		Ext.getCmp('frm_sel_module_menu_group_all').setValue('all');
	    	}
	    }
	});

	// Set Top Bar
	var top_bar = [
		{
			xtype: 'button',
			text: 'Add',
			iconCls: 'extjs-icon-add',
			iconAlign: 'left',
			handler: function() {
				Add();
			}
		},
		{
			xtype: 'button',
			text: 'Edit',
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
            xtype: 'combobox',
            fieldLabel: 'Group',
            id: 'frm_sel_module_menu_group_all',
            name: 'frm_sel_module_menu_group_all',
            store: module_menu_group_store_all,
            valueField: 'mmg_id',
            displayField: 'mmg_name',
            triggerAction: 'all',
            queryMode: 'local',
            emptyText: 'Select Module Menu Group',
            width: 200,
            labelWidth: 50,
            forceSelection: true,
            value: 'All',
            listeners: {
            	select: function() {
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
	    title: '<span class="lead">Module Menu Items</span>',
	    width: '100%',
	    height: 500,
	    columnLines: true,
	    iconCls: 'extjs-icon-module-menu-item',
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
				xtype: 'actioncolumn',
				text: 'Action',
				width: 60,
				stopSelection: false,
				items: [
					{
						iconCls: 'extjs-icon-arrow-up',
						tooltip: 'Move Order Up',
						handler: function () {
							Move_up();
						}
					},
					{
						iconCls: 'extjs-icon-arrow-down pull-right',
						tooltip: 'Move Order Down',
						handler: function () {
							Move_down();
						}
					}
				]
	    	},
	        {
	            text: 'Name',
	            width: 200,
	            dataIndex: 'mmi_name'
	        },
	        {
	            text: 'Link',
	            width: 150,
	            dataIndex: 'mmi_link'
	        },
	        {
	            text: 'Order',
	            width: 75,
	            dataIndex: 'mmi_order',
	            align: 'center'
	        },
	        {
	            hidden: true,
	            hideable: false,
	            dataIndex: 'mmg_id'
	        },
	        {
	            text: 'Group Name',
	            width: 200,
	            dataIndex: 'mmg_name'
	        },
	        {
	            text: 'Group Link',
	            width: 150,
	            dataIndex: 'mmg_link'
	        },
	        {
	            text: 'Description',
	            width: 200,
	            dataIndex: 'mmi_description'
	        },
	        {
	            text: 'Deleted',
	            width: 75,
	            dataIndex: 'is_deleted',
	            align: 'center',
	            hidden: true,
	            hideable: false,
	            renderer: function(value, meta) {
	            	if(value == '0') {
	            		return '<span class="text-success">No</span>';
	            	} else if(value == '1') {
	            		return '<span class="text-error">Yes</span>';
	            	}
	            }
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
            labelWidth: 80
        },
        items: [
            {
                xtype: 'textfield',
                fieldLabel: 'Name',
                afterLabelTextTpl: global_required,
                id: 'frm_name',
                name: 'frm_name',
                emptyText: 'Enter Menu Item Name',
                allowBlank: false,
                maxLength: 50
            },
            {
                xtype: 'textfield',
                fieldLabel: 'Link',
                afterLabelTextTpl: global_required,
                id: 'frm_link',
                name: 'frm_link',
                emptyText: 'Enter Menu Item Link',
                allowBlank: false,
                maxLength: 20,
                listeners: {
                	blur: function(textfield) {
                		textfield.setValue(Ext.util.Format.lowercase(textfield.getValue()));
                	}
                }
            },
            {
                xtype: 'combobox',
                fieldLabel: 'Menu Group',
                afterLabelTextTpl: global_required,
                id: 'frm_sel_module_menu_group',
                name: 'frm_sel_module_menu_group',
                store: module_menu_group_store,
                valueField: 'mmg_id',
                displayField: 'mmg_name',
                triggerAction: 'all',
                queryMode: 'local',
                emptyText: 'Select Module Menu Group',
                allowBlank: false,
                forceSelection: true
            },
            {
                xtype: 'textarea',
                fieldLabel: 'Description',
                afterLabelTextTpl: global_required,
                id: 'frm_description',
                name: 'frm_description',
                emptyText: 'Enter Menu Item Description',
                allowBlank: false
            },
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
	    height: 260,
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

		window_panel.setTitle('Add Module Menu Item');
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

		Ext.getCmp('frm_name').setValue(data.mmi_name);
		Ext.getCmp('frm_link').setValue(data.mmi_link);
		Ext.getCmp('frm_sel_module_menu_group').setValue(data.mmg_id);
		Ext.getCmp('frm_description').setValue(data.mmi_description);

		window_panel.setTitle('Edit Module Menu Item - ' + data.mmi_name.toUpperCase());
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
			msg: 'Are you sure to <strong>Delete</strong> the Module Menu Item <strong>' + data.mmi_name + '</strong>?',
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
			msg: 'Are you sure to <strong>Restore</strong> the Module Menu Item <strong>' + data.mmi_name + '</strong>?',
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

	// Move Up
	function Move_up() {
		var selected = grid.getSelectionModel().getSelection();
		var data = selected[0].getData();
		var mmi_id = data.mmi_id;
		var mmg_id = data.mmg_id;
		
		Ext.Msg.wait('Saving...', 'Please wait');
		Ext.Ajax.request({
			url: global_controller_url + 'save',
			method: 'POST',
			params: {
				opt: 'move_up',
				mmi_id: mmi_id,
				mmg_id: mmg_id
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

	// Move Down
	function Move_down() {
		var selected = grid.getSelectionModel().getSelection();
		var data = selected[0].getData();
		var mmi_id = data.mmi_id;
		var mmg_id = data.mmg_id;
		
		Ext.Msg.wait('Saving...', 'Please wait');
		Ext.Ajax.request({
			url: global_controller_url + 'save',
			method: 'POST',
			params: {
				opt: 'move_down',
				mmi_id: mmi_id,
				mmg_id: mmg_id
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

	// Save
	function Save() {
		if(opt != 'delete' && opt != 'restore') {
			// Trim
			Ext.getCmp('frm_name').setValue(Ext.getCmp('frm_name').getValue().trim());
			Ext.getCmp('frm_link').setValue(Ext.getCmp('frm_link').getValue().trim());
			Ext.getCmp('frm_description').setValue(Ext.getCmp('frm_description').getValue().trim());

			// Validate
			Ext.getCmp('frm_name').clearInvalid();
			Ext.getCmp('frm_link').clearInvalid();
			Ext.Msg.wait('Validating...', 'Please wait');
	        var mmi_id = '';
	        if(opt == 'edit') {
	        	var selected = grid.getSelectionModel().getSelection();
				var data = selected[0].getData();
				mmi_id = data.mmi_id
	        }
	        Ext.Ajax.request({
	            url: global_controller_url + 'check_existing',
	            method: 'POST',
	            params: {
	            	name: Ext.getCmp('frm_name').getValue(),
	            	link: Ext.getCmp('frm_link').getValue(),
	                mmi_id: mmi_id,
	                mmg_id: Ext.getCmp('frm_sel_module_menu_group').getValue()
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

	                	if(decode.msg_link != '') {
	                		Ext.getCmp('frm_link').markInvalid(decode.msg_link);
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
										mmi_id: mmi_id
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
			var mmi_id = '';
			var selected = grid.getSelectionModel().getSelection();
			var data = selected[0].getData();
			mmi_id = data.mmi_id

			Ext.Msg.wait('Saving...', 'Please wait');
			Ext.Ajax.request({
				url: global_controller_url + 'save',
	            method: 'POST',
	            params: {
	            	opt: opt,
	                mmi_id: mmi_id
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
