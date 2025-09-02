Ext.define('MyApp.view.main.MainViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.main',

    stores: {
        cities: {
            type: 'cities',
            autoLoad: true
        },
        streets: {
            type: 'streets',
            autoLoad: true
        },
        companies: {
            type: 'companies',
            autoLoad: true
        },
        regions: {
            type: 'regions',
            autoLoad: true
        }
    },

    data: {
        selectedCity: null
    }
});
