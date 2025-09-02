Ext.define('MyApp.store.Companies', {
    extend: 'Ext.data.Store',
    alias: 'store.companies',

    model: 'MyApp.model.Company',

    data: { items: [
            { id: 1, name: 'Компания 1' },
            { id: 2, name: 'Компания 2' },
            { id: 3, name: 'Компания 3' },
            { id: 4, name: 'Компания 4' },
            { id: 5, name: 'Компания 5' }
        ]},

    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            rootProperty: 'items'
        }
    }
});