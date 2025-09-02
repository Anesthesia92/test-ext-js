Ext.define('MyApp.model.City', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'id', type: 'int' },
        { name: 'name', type: 'string' },
        { name: 'region', type: 'string' },
        { name: 'population', type: 'int' }
    ]
});