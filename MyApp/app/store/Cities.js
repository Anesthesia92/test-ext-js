Ext.define('MyApp.store.Cities', {
    extend: 'Ext.data.Store',
    alias: 'store.cities',

    model: 'MyApp.model.City',

    data: { items: [
            { id: 1, name: 'Москва', region: 'Центральный', population: 12655000 },
            { id: 2, name: 'Санкт-Петербург', region: 'Северо-Западный', population: 5384000 },
            { id: 3, name: 'Новосибирск', region: 'Сибирский', population: 1620000 },
            { id: 4, name: 'Екатеринбург', region: 'Уральский', population: 1495000 },
            { id: 5, name: 'Нижний Новгород', region: 'Приволжский', population: 1259000 }
        ]},

    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            rootProperty: 'items'
        }
    }
});