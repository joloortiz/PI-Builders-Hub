Ext.onReady(function() {
	/*
	 * INITIALIZE
	 */

	// Set Form Panel
	var form_panel = new Ext.form.Panel({
		renderTo: 'grid-container',
	    title: '<span class="lead">Store Information</span>',
	    width: '100%',
	    height: 300,
        id: 'crud_form',
        url: global_controller_url + 'save',
    	bodyPadding: 10,
    	iconCls: 'extjs-icon-store-information',
    	defaults: {
            anchor: '100%',
            enforceMaxLength: true
        },
        fieldDefaults: {
            msgTarget: 'side',
            labelWidth: 100
        },
        items: [
            {
                xtype: 'textfield',
                fieldLabel: 'Store Name',
                afterLabelTextTpl: global_required,
                id: 'frm_name',
                name: 'frm_name',
                emptyText: 'Enter Store Name',
                allowBlank: false,
                maxLength: 50
            },
            {
                xtype: 'textfield',
                fieldLabel: 'Address',
                id: 'frm_address',
                name: 'frm_address',
                emptyText: 'Enter Address',
                maxLength: 100
            },
            {
                xtype: 'textfield',
                fieldLabel: 'Owner',
                id: 'frm_owner',
                name: 'frm_owner',
                emptyText: 'Enter Owner\'s Name',
                maxLength: 100
            },
            {
                xtype: 'textfield',
                fieldLabel: 'Telephone No.',
                id: 'frm_telephone_no',
                name: 'frm_telephone_no',
                emptyText: 'Enter Telephone No.',
                maxLength: 50
            },
            {
                xtype: 'textfield',
                fieldLabel: 'Email Address',
                id: 'frm_email',
                name: 'frm_email',
                emptyText: 'Enter Email Address',
                maxLength: 50,
                vtype: 'email'
            }
        ],
        bbar: [
			'->',
			{
				xtype: 'button',
				text: 'Save',
				iconCls: 'extjs-icon-save-large',
				scale: 'large',
				formBind: true,
				handler: function() {
					Save();
				}
			}
		]
    });

	Load_store_information();

	/*
	 * FUNCTIONS
	 */

	// Load Store Information
	function Load_store_information() {
		Ext.Msg.wait('Loading Store Information...', 'Please wait');
		Ext.Ajax.request({
			url: global_controller_url + 'get_store_information',
            method: 'POST',
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
                	var store_information = decode.data;
                	
                	Ext.getCmp('frm_name').setValue(store_information.si_name);
                	Ext.getCmp('frm_address').setValue(store_information.si_address);
                	Ext.getCmp('frm_owner').setValue(store_information.si_owner);
                	Ext.getCmp('frm_telephone_no').setValue(store_information.si_telephone_no);
                	Ext.getCmp('frm_email').setValue(store_information.si_email);
					Ext.Msg.close();
                }
            }
		});
	}

	// Save
	function Save() {
		var form = form_panel.getForm();
        if(form.isValid()) {
            Ext.Msg.wait('Saving...', 'Please wait');
            form.submit({
                submitEmptyText: false,
                success: function(form, action) {
                    Ext.Msg.close();
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
});
