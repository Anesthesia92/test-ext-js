Ext.application({
    name: 'MyApp',
    extend: 'MyApp.Application',

    requires: [
        'MyApp.view.main.Main'
    ],

    mainView: 'MyApp.view.main.Main'
});