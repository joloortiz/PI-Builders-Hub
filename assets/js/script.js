/*
 * INITIALIZE
 */

var global_page_size = 20;
var global_base_url = $('#base_url').val();
var global_controller_url = $('#base_url').val() + $('#controller').val() + '/';
var global_required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
var global_items_line_count = 18; // Number of Items allowed to Order and displyed on the Receipt

// Set Data Types
var data_types = Ext.data.Types;

// Add the additional 'advanced' VTypes
Ext.apply(Ext.form.field.VTypes, {
    daterange: function(val, field) {
        var date = field.parseDate(val);

        if (!date) {
            return false;
        }
        if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
            var start = field.up('form').down('#' + field.startDateField);
            start.setMaxValue(date);
            start.validate();
            this.dateRangeMax = date;
        }
        else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
            var end = field.up('form').down('#' + field.endDateField);
            end.setMinValue(date);
            end.validate();
            this.dateRangeMin = date;
        }
        /*
         * Always return true since we're only using this vtype to set the
         * min/max allowed values (these are tested for after the vtype test)
         */
        return true;
    },

    daterangeText: 'Start date must be less than End date',

    password: function(val, field) {
        if (field.initialPassField) {
            var pwd = field.up('form').down('#' + field.initialPassField);
            return (val == pwd.getValue());
        }
        return true;
    },

    passwordText: 'Passwords do not match'
});

// Initialize Quicktips
Ext.tip.QuickTipManager.init();

// Set Form Panel
var change_account_settings_form_panel = new Ext.form.Panel({
    url: global_base_url + 'change_account_settings',
    bodyPadding: 10,
    defaults: {
        anchor: '100%'
    },
    fieldDefaults: {
        msgTarget: 'side',
        labelWidth: 120,
        enforceMaxLength: true
    },
    items: [
        {
            xtype: 'displayfield',
            fieldLabel: 'First Name',
            id: 'frm_ca_fname',
            name: 'frm_ca_fname'
        },
        {
            xtype: 'displayfield',
            fieldLabel: 'Last Name',
            id: 'frm_ca_lname',
            name: 'frm_ca_lname'
        },
        {
            xtype: 'displayfield',
            fieldLabel: 'Middle Name',
            id: 'frm_ca_mname',
            name: 'frm_ca_mname'
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Username',
            afterLabelTextTpl: global_required,
            id: 'frm_ca_username',
            name: 'frm_ca_username',
            emptyText: 'Enter Username',
            allowBlank: false,
            maxLength: 20
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Old Password',
            afterLabelTextTpl: global_required,
            id: 'frm_ca_old_password',
            name: 'frm_ca_old_password',
            inputType: 'password',
            emptyText: 'Enter Old Password',
            allowBlank: false,
            minLength: 5
        },
        {
            xtype: 'textfield',
            fieldLabel: 'New Password',
            afterLabelTextTpl: global_required,
            id: 'frm_ca_new_password',
            name: 'frm_ca_new_password',
            inputType: 'password',
            emptyText: 'Enter New Password',
            allowBlank: false,
            minLength: 5
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Confirm Password',
            afterLabelTextTpl: global_required,
            id: 'frm_ca_confirm_password',
            name: 'frm_ca_confirm_password',
            inputType: 'password',
            emptyText: 'Enter Confirm Password',
            vtype: 'password',
            initialPassField: 'frm_ca_new_password',
            allowBlank: false,
            minLength: 5
        }
    ],
    buttons: [
        {
            text: 'Cancel',
            iconCls: 'extjs-icon-cancel',
            handler: function() {
                change_account_settings_window_panel.close();
            }
        },
        {
            text: 'Save',
            iconCls: 'extjs-icon-save',
            formBind: true,
            handler: function() {
                Save_account_settings();
            }
        }
    ]
});

// Set Window panel
var change_account_settings_window_panel = new Ext.window.Window({
    title: 'Change Account Settings',
    height: 300,
    width: 400,
    iconCls: 'extjs-icon-settings',
    layout: 'fit',
    closeAction: 'hide',
    modal: true,
    closable: false,
    resizable: false,
    items: [change_account_settings_form_panel]
});

    

/*
 * FUNCTIONS
 */

// Change Account Settings
function Change_account_settings() {
    change_account_settings_window_panel.show();
    Ext.Msg.wait('Loading Account Information...', 'Please wait');
    Ext.Ajax.request({
        url: global_base_url + 'get_employee_information',
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
                var employee_information = decode.data;
                
                Ext.getCmp('frm_ca_fname').setValue(employee_information.e_fname);
                Ext.getCmp('frm_ca_lname').setValue(employee_information.e_lname);
                Ext.getCmp('frm_ca_mname').setValue(employee_information.e_mname);
                Ext.getCmp('frm_ca_username').setValue(employee_information.e_username);
                Ext.Msg.close();
            }
        }
    });
}

// Save Account Settings
function Save_account_settings() {
    var form = change_account_settings_form_panel.getForm();
    if(form.isValid()) {
        Ext.Msg.wait('Saving Account Settings...', 'Please wait');
        form.submit({
            success: function(form, action) {
                Ext.Msg.show({
                    title: 'Information',
                    msg: 'Successfully changed Account Settings. You must Login again to validate',
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.INFO,
                    closable: false,
                    fn: function() {
                        window.location = global_base_url + 'logout';
                    }
                });
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

// Print Element
function Print_element(el) {
    var win = window.open('', '', 'menubar=0,location=0');
    if(win) {
        win.document.write('<html><head>');
        win.document.write('<title></title>');
        win.document.write('<link type="text/css" rel="stylesheet" media="print" href="' + global_base_url + 'assets/css/bootstrap.min.css">');
        win.document.write('<link type="text/css" rel="stylesheet" media="print" href="' + global_base_url + 'assets/css/extjs-icons.css">');
        win.document.write('<link type="text/css" rel="stylesheet" media="print" href="' + global_base_url + 'assets/css/styles.css">');
        win.document.write('<link type="text/css" rel="stylesheet" media="print" href="' + global_base_url + 'assets/js/extjs/resources/css/ext-all-neptune.css">');
        win.document.write('<link type="text/css" rel="stylesheet" href="' + global_base_url + 'assets/css/bootstrap.min.css">');
        win.document.write('<link type="text/css" rel="stylesheet" href="' + global_base_url + 'assets/css/extjs-icons.css">');
        win.document.write('<link type="text/css" rel="stylesheet" href="' + global_base_url + 'assets/css/styles.css">');
        win.document.write('<link type="text/css" rel="stylesheet" href="' + global_base_url + 'assets/js/extjs/resources/css/ext-all-neptune.css">');
        win.document.write('</head><body">');
        win.document.write(el.body.dom.innerHTML);
        win.document.write('</body></html>');
        win.print();
        setTimeout(function(){
           win.close();
        }, 1000);
    }
}

// Print HTML
function Print_html(html) {
    var win = window.open('', '', 'menubar=0,location=0');
    if(win) {
        win.document.write('<html><head>');
        win.document.write('<title></title>');
        win.document.write('<link type="text/css" rel="stylesheet" media="print" href="' + global_base_url + 'assets/css/bootstrap.min.css">');
        win.document.write('<link type="text/css" rel="stylesheet" media="print" href="' + global_base_url + 'assets/css/extjs-icons.css">');
        win.document.write('<link type="text/css" rel="stylesheet" media="print" href="' + global_base_url + 'assets/css/styles.css">');
        win.document.write('<link type="text/css" rel="stylesheet" media="print" href="' + global_base_url + 'assets/js/extjs/resources/css/ext-all-neptune.css">');
        win.document.write('<link type="text/css" rel="stylesheet" href="' + global_base_url + 'assets/css/bootstrap.min.css">');
        win.document.write('<link type="text/css" rel="stylesheet" href="' + global_base_url + 'assets/css/extjs-icons.css">');
        win.document.write('<link type="text/css" rel="stylesheet" href="' + global_base_url + 'assets/css/styles.css">');
        win.document.write('<link type="text/css" rel="stylesheet" href="' + global_base_url + 'assets/js/extjs/resources/css/ext-all-neptune.css">');
        win.document.write('</head><body">');
        win.document.write(html);
        win.document.write('</body></html>');
        win.print();
        setTimeout(function(){
           win.close();
        }, 1000);
    }
}

// Renderer To Upper
function renderer_to_upper(value) {
    return Ext.util.Format.uppercase(value);
}

// Renderer Currency
function renderer_currency(value) {
    return Ext.util.Format.currency(parseFloat(value), '<span class="pull-left">₱</span>');
}

// Renderer Currency No Sign
function renderer_currency_no_sign(value) { 
    var return_value = '';
    if(value < 0) {
        return_value = '(' + Ext.util.Format.currency((parseFloat(value) * -1), ' ') + ')';
    } else {
        return_value = Ext.util.Format.currency(parseFloat(value), ' ');
    }
    return return_value;
}

// Renderer Change/Credit
function renderer_change_credit(value, metadata, record) {
    var data = record.getData();
    var value = parseFloat(value);
    var amount_tendered = parseFloat(data.o_amount_tendered);
    var total = parseFloat(data.total);

    if(amount_tendered >= total) {
        return Ext.util.Format.currency(value, '<span class="pull-left">₱</span>');
    } else {
        return '<span class="text-error">' + Ext.util.Format.currency(value, '<span class="pull-left">₱</span>') + '</span>';
    }
}

// Renderer Number
function renderer_number(value) {
    var number = parseFloat(value);
    if(number % 1 == 0) {
        return Ext.util.Format.number(parseFloat(value), '0');
    } else {
        return Ext.util.Format.number(parseFloat(value), '0.00');
    }
}

// Renderer Positive/Negative Number
function renderer_positive_negative_number(value) {
    var value = parseFloat(value);
    var number = value % 1 == 0 ? Ext.util.Format.number(value, '0') : Ext.util.Format.number(value, '0.00');
    if(value < 0) {
        return '<span class="text-error">' + number + '</span>';
    } else if(value > 0) {
        return '<span class="text-success">+' + number + '</span>';
    } else {
        return number;
    }
}

// Renderer Positive/Negative Number No Design
function renderer_positive_negative_number_no_design(value) {
    var number = Ext.util.Format.number(parseFloat(value), '0.00');
    if(value < 0) {
        return number;
    } else if(value > 0) {
        return '+' + number;
    }
}

// Renderer Yes/No Positive
function renderer_yes_no_positive(value) {
    if(value == '0') {
        return '<span class="text-error">No</span>';
    } else if(value == '1') {
        return '<span class="text-success">Yes</span>';
    }
}

// Renderer Yes/No Negative
function renderer_yes_no_negative(value) {
    if(value == '0') {
        return '<span class="text-success">No</span>';
    } else if(value == '1') {
        return '<span class="text-error">Yes</span>';
    }
}

// Renderer Order Type
function renderer_order_type(value) {
    if(value == 'S') {
        return '<span class="text-success">SALES</span>';
    } else if(value == 'R') {
        return '<span class="text-error">RETURN</span>';
    }
}

// Renderer Date/Time
function renderer_datetime(value) {
    var datetime_arr = value.split(' ');
    var date_arr = datetime_arr[0].split('-');
    var time_arr = datetime_arr[1].split(':');
    var date = new Date(date_arr[0], parseInt(date_arr[1]) - 1, date_arr[2], time_arr[0], time_arr[1], time_arr[2]);
    return Ext.util.Format.date(date, 'M. j, Y g:i A');
}

// Renderer Date
function renderer_date(value) {
    var date_arr = value.split('-');
    var date = new Date(date_arr[0], parseInt(date_arr[1]) - 1, date_arr[2]);
    return Ext.util.Format.date(date, 'M. j, Y');
}

// Renderer Status
function renderer_status(value) {
    if(value == 'P') {
        return '<span class="text-success">PROCESSED</span>';
    } else if(value == 'V') {
        return '<span class="text-error">VOID</span>';
    }
}

// Renderer Credit Status
function renderer_credit_status(value) {
    if(value == 'F') {
        return '<span class="text-success">FULLY PAID</span>';
    } else if(value == 'W') {
        return '<span class="text-error">WITH BALANCE</span>';
    }
}

// Renderer PO Status
function renderer_po_status(value) {
    if(value == 'O') {
        return '<span class="text-success">OPEN</span>';
    } else if(value == 'C') {
        return '<span class="text-error">CLOSED</span>';
    }
}

// Renderer Qty on Hand
function renderer_qty_on_hand(value, metadata, record) {
    var data = record.getData();
    var value = parseFloat(value);
    var reorder_level = parseFloat(data.i_reorder_level);
    var number = value % 1 == 0 ? Ext.util.Format.number(value, '0') : Ext.util.Format.number(value, '0.00');
    if(value > reorder_level) {
        return '<span class="text-success">' + number + '</span>';
    } else if(value <= reorder_level) {
        if(value == reorder_level) {
            return '<span class="text-warning">' + number + '</span>';
        } else {
            return '<span class="text-error">' + number + '</span>';
        }
    }
}