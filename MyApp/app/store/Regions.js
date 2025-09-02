Ext.define('MyApp.store.Regions', {
    extend: 'Ext.data.Store',
    alias: 'store.regions',

    fields: ['name'],

    data: { items: [
            { name: 'Центральный' },
            { name: 'Северо-Западный' },
            { name: 'Сибирский' },
            { name: 'Южный' },
            { name: 'Приволжский' },
            { name: 'Уральский' },
            { name: 'Дальневосточный' }
        ]},

    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            rootProperty: 'items'
        }
    }
});