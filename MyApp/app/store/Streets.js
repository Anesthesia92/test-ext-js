Ext.define('MyApp.store.Streets', {
    extend: 'Ext.data.Store',
    alias: 'store.streets',

    model: 'MyApp.model.Street',
    autoLoad: true,
    pageSize: 5,
    data: {
        items: [
            {id: 1, name: 'Арбат', company: 'Компания 1', houses: 150, cityId: 1},
            {id: 2, name: 'Тверская', company: 'Компания 2', houses: 200, cityId: 1},
            {id: 3, name: 'Невский проспект', company: 'Компания 3', houses: 180, cityId: 2},
            {id: 4, name: 'Ленина', company: 'Компания 1', houses: 90, cityId: 3},
            {id: 5, name: 'Мира', company: 'Компания 2', houses: 120, cityId: 4},
            {id: 6, name: 'Розы', company: 'Компания 3', houses: 30, cityId:4}
        ]
    },

    proxy: {
        type: 'memory',
        enablePaging: true,
        reader: {
            type: 'json',
            rootProperty: 'items'
        }
    },
});