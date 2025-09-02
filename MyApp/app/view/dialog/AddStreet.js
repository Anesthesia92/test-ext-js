Ext.define('MyApp.view.dialog.AddStreet', {
        extend: 'Ext.window.Window',
    xtype: 'addstreet-dialog',

    requires: [
        'MyApp.view.dialog.AddStreetController',
        'MyApp.store.Cities',
        'MyApp.store.Companies'
    ],

    controller: 'addstreet',

    title: 'Добавление новой улицы',
    width: 500,
    height: 350,
    modal: true,
    layout: 'fit',

    items: [{
        xtype: 'form',
        reference: 'addStreetForm',
        bodyPadding: 10,
        layout: 'form',
        items: [{
            xtype: 'textfield',
            fieldLabel: 'Название',
            name: 'name',
            allowBlank: false,
            minLength: 5,
            emptyText: 'Введите название улицы',
            validator: function(value) {
                var controller = this.up('window').getController();
                return controller.validateStreetName(value);
            },
            listeners: {
                change: 'onFieldChange'
            }
        }, {
            xtype: 'combo',
            fieldLabel: 'Ответственная компания',
            name: 'company',
            displayField: 'name',
            valueField: 'name',
            queryMode: 'local',
            forceSelection: false,
            store: {
                type: 'companies'
            },
            allowBlank: false,
            editable: true,
            emptyText: 'Выберите или введите компанию',
            listeners: {
                change: 'onFieldChange'
            }
        }, {
            xtype: 'numberfield',
            fieldLabel: 'Количество домов',
            name: 'houses',
            minValue: 1,
            allowBlank: false,
            emptyText: 'Введите количество домов',
            validator: function(value) {
                var controller = this.up('window').getController();
                return controller.validateHouses(value);
            },
            listeners: {
                change: 'onFieldChange'
            }
        }, {
            xtype: 'combo',
            fieldLabel: 'Город',
            name: 'cityId',
            displayField: 'name',
            valueField: 'id',
            queryMode: 'local',
            forceSelection: true,
            store: {
                type: 'cities'
            },
            allowBlank: false,
            emptyText: 'Выберите город',
            listeners: {
                change: 'onFieldChange'
            }
        }]
    }],

    buttons: [{
        text: 'Создать',
        formBind: true,
        handler: 'onCreateStreet'
    }, {
        text: 'Закрыть',
        handler: function() {
            this.up('window').close();
        }
    }],

    listeners: {
        close: 'onWindowClose'
    }
});