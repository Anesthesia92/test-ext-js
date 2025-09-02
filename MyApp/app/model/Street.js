Ext.define('MyApp.model.Street', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'name', type: 'string'},
        {name: 'company', type: 'string'},
        {name: 'houses', type: 'int'},
        {name: 'cityId', type: 'int'},
        {
            name: 'population',
            type: 'int',
            convert: function(value, record) {
                // Рассчитываем население based on houses
                return record.get('houses') * 750;
            }
        }
    ],
    idProperty: 'id' // Важно указать свойство ID
});