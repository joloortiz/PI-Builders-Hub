Ext.onReady(function() {
    /*
     * INITIALIZE
     */

    // Set Form Panel
    var form_panel = new Ext.form.Panel({
        title: 'Login Form',
        url: global_controller_url + 'initiateLogin',
        bodyPadding: 10,
        width: 350,
        frame: true,
        layout: 'anchor',
        defaults: {
            anchor: '100%'
        },
        fieldDefaults: {
            msgTarget: 'side',
            labelWidth: 75
        },
        items: [
            {
                xtype: 'textfield',
                fieldLabel: 'Username',
                afterLabelTextTpl: global_required,
                id: 'frm_username',
                name: 'frm_username',
                emptyText: 'Enter Username',
                allowBlank: false,
                maxLength: 20,
                listeners: {
                    specialkey: function (textfield, event) {
                        // If Enter key is pressed
                        if(event.keyCode == 13) {
                            Form_submit();
                        }
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
                listeners: {
                    specialkey: function (textfield, event) {
                        // If Enter key is pressed
                        if(event.keyCode == 13) {
                            Form_submit();
                        }
                    }
                }
            }
        ],
        buttons: [
            {
                text: 'Login',
                formBind: true,
                handler: function  () {
                    Form_submit();
                }
            }
        ]
    });

    //  Set View Port
    var viewport = new Ext.Viewport({
        layout: {
            type: 'vbox',
            align: 'center',
            pack: 'center'
        },
        items:[form_panel]
    });

    Ext.getCmp('frm_username').focus();


    /*
     * FUNCTIONS
     */

    // Form Submit
    function Form_submit() {
        var form = form_panel.getForm();
        if(form.isValid()) {
            Ext.Msg.wait('Validating...', 'Please wait');
            form.submit({
                success: function(form, action) {
                    Ext.Msg.wait('Logging in...', 'Please wait');
                    setInterval(function (){
                        window.location = $('#base_url').val();
                    }, 3000);
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