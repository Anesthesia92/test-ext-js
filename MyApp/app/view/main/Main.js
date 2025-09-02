Ext.define('MyApp.view.main.Main', {
    extend: 'Ext.panel.Panel',
    xtype: 'app-main',

    requires: [
        'MyApp.view.main.MainController',
        'MyApp.view.main.MainViewModel',
        'Ext.grid.Panel',
        'Ext.toolbar.Paging',
        'Ext.form.field.Text',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Number',
        'Ext.grid.plugin.CellEditing',
        'Ext.grid.column.Action',
        'Ext.window.MessageBox',
        'Ext.toolbar.Toolbar'
    ],

    controller: 'main',
    viewModel: 'main',

    layout: 'hbox',
    padding: 10,

    items: [{
        xtype: 'grid',
        title: 'Список городов',
        width: '25%',
        margin: '0 10 0 0',
        reference: 'cityGrid',
        bind: {
            store: '{cities}',
            selection: '{selectedCity}'
        },
        columns: [{
            text: 'Название',
            dataIndex: 'name',
            flex: 1
        }, {
            text: 'Регион',
            dataIndex: 'region',
            flex: 1
        }, {
            text: 'Население',
            dataIndex: 'population',
            flex: 1,
            renderer: function (value) {
                return Ext.util.Format.number(value, '0,0');
            }
        }],

        dockedItems: [{
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                xtype: 'textfield',
                fieldLabel: 'По городу',
                labelWidth: 60,
                emptyText: 'Введите название',
                reference: 'cityNameFilter',
                triggers: {
                    clear: {
                        cls: 'x-form-clear-trigger',
                        handler: function (field) {
                            field.reset();
                            var store = field.up('grid').getStore();
                            store.clearFilter();
                        }
                    }
                },
                listeners: {
                    change: 'onCityFilterChange',
                    buffer: 300
                }
            },
                {
                    xtype: 'button',
                    text: 'Сбросить все',
                    handler: 'onResetAllFilters',
                    margin: '0 0 0 10'
                }
            ]
        }, {
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                xtype: 'combo',
                fieldLabel: 'По региону',
                labelWidth: 60,
                displayField: 'name',
                valueField: 'name',
                queryMode: 'local',
                forceSelection: true,
                reference: 'regionFilter',
                bind: {
                    store: '{regions}'
                },
                triggers: {
                    clear: {
                        cls: 'x-form-clear-trigger',
                        handler: function(field) {
                            field.reset();
                            var grid = field.up('grid');
                            var store = grid.getStore();

                            if (field.reference === 'cityNameFilter') {
                                store.removeFilter('cityNameFilter');
                            } else if (field.reference === 'regionFilter') {
                                store.removeFilter('regionFilter');
                            }

                            grid.getSelectionModel().deselectAll();
                        }
                    }
                },
                listeners: {
                    change: 'onRegionFilterChange'
                }
            }]
        }, {
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                xtype: 'numberfield',
                fieldLabel: 'По населению',
                labelWidth: 80,
                emptyText: 'От',
                reference: 'cityPopulationFilter',
                triggers: {
                    clear: {
                        cls: 'x-form-clear-trigger',
                        handler: function(field) {
                            field.reset();
                            var grid = field.up('grid');
                            var store = grid.getStore();
                            if (field.reference === 'cityNameFilter') {
                                store.removeFilter('cityNameFilter');
                            } else if (field.reference === 'regionFilter') {
                                store.removeFilter('regionFilter');
                            }
                            grid.getSelectionModel().deselectAll();
                        }
                    }
                },
                listeners: {
                    change: 'onPopulationFilterChange',
                    buffer: 300
                }
            }]
        }, {
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            enableOverflow: true,
            displayInfo: true,
            responsiveConfig: {
                'width < 768': {
                    layout: 'vbox'
                },
                'width >= 768': {
                    layout: 'hbox'
                }
            },
            overflowHandler: 'scroller',
            layout: {
                type: 'hbox',
                pack: 'start',
                align: 'stretch'
            },
            bind: {
                store: '{cities}'
            }
        }]
    }, {
        xtype: 'grid',
        title: 'Список улиц',
        width: '75%',
        reference: 'streetGrid',
        bind: {
            store: '{streets}'
        },
        displayMsg: 'Displaying {0} - {1} of {2}',
        emptyMsg: 'No records to display',
        columns: [{
            text: 'Название улицы',
            dataIndex: 'name',
            flex: 1,
            editor: 'textfield'
        }, {
            text: 'Ответственная компания',
            dataIndex: 'company',
            flex: 1,
            editor: {
                xtype: 'combo',
                displayField: 'name',
                valueField: 'name',
                queryMode: 'local',
                bind: {
                    store: '{companies}'
                },
                forceSelection: false
            }
        }, {
            text: 'Количество домов',
            dataIndex: 'houses',
            flex: 1,
            editor: 'numberfield'
        }, {
            text: 'Примерное население',
            dataIndex: 'population',
            flex: 1,
            renderer: function (value) {
                return '~' + Ext.util.Format.number(value, '0,0');
            }
        }, {
            xtype: 'actioncolumn',
            width: 50,
            items: [{
                iconCls: 'x-fa fa-trash',
                tooltip: 'Удалить улицу',
                handler: 'onDeleteStreet'
            }]
        }],

        plugins: [{
            ptype: 'cellediting',
            clicksToEdit: 1,
            listeners: {
                edit: 'onEditComplete'
            }
        }],

        dockedItems: [{
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                xtype: 'textfield',
                fieldLabel: 'По названию',
                labelWidth: 80,
                emptyText: 'Введите название',
                reference: 'streetNameFilter',
                triggers: {
                    clear: {
                        cls: 'x-form-clear-trigger',
                        handler: function(field) {
                            field.reset();

                            var grid = field.up('grid');
                            var store = grid.getStore();
                            if (field.reference === 'cityNameFilter') {
                                store.removeFilter('cityNameFilter');
                            } else if (field.reference === 'regionFilter') {
                                store.removeFilter('regionFilter');
                            }
                            grid.getSelectionModel().deselectAll();
                        }
                    }
                },
                listeners: {
                    change: 'onStreetNameFilterChange',
                    buffer: 300
                }
            }]
        }, {
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                xtype: 'combo',
                fieldLabel: 'По компании',
                labelWidth: 80,
                displayField: 'name',
                valueField: 'name',
                queryMode: 'local',
                forceSelection: false,
                reference: 'companyFilter',
                bind: {
                    store: '{companies}'
                },
                triggers: {
                    clear: {
                        cls: 'x-form-clear-trigger',
                        handler: function(field) {
                            field.reset();
                            var grid = field.up('grid');
                            var store = grid.getStore();
                            if (field.reference === 'cityNameFilter') {
                                store.removeFilter('cityNameFilter');
                            } else if (field.reference === 'regionFilter') {
                                store.removeFilter('regionFilter');
                            }
                            grid.getSelectionModel().deselectAll();
                        }
                    }
                },
                listeners: {
                    change: 'onCompanyFilterChange'
                }
            }]
        }, {
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                xtype: 'numberfield',
                fieldLabel: 'По домам',
                labelWidth: 60,
                emptyText: 'Количество',
                reference: 'housesFilter',
                triggers: {
                    clear: {
                        cls: 'x-form-clear-trigger',
                        handler: function(field) {
                            field.reset();
                            var grid = field.up('grid');
                            var store = grid.getStore();

                            if (field.reference === 'cityNameFilter') {
                                store.removeFilter('cityNameFilter');
                            } else if (field.reference === 'regionFilter') {
                                store.removeFilter('regionFilter');
                            }

                            grid.getSelectionModel().deselectAll();
                        }
                    }
                },
                listeners: {
                    change: 'onHousesFilterChange',
                    buffer: 300
                }
            }]
        }, {
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                xtype: 'numberfield',
                fieldLabel: 'Население от',
                labelWidth: 80,
                emptyText: 'Минимум',
                reference: 'populationMinFilter',
                triggers: {
                    clear: {
                        cls: 'x-form-clear-trigger',
                        handler: function(field) {
                            field.reset();
                            var grid = field.up('grid');
                            var store = grid.getStore();

                            if (field.reference === 'cityNameFilter') {
                                store.removeFilter('cityNameFilter');
                            } else if (field.reference === 'regionFilter') {
                                store.removeFilter('regionFilter');
                            }
                            grid.getSelectionModel().deselectAll();
                        }
                    }
                },
                listeners: {
                    change: 'onPopulationMinFilterChange',
                    buffer: 300
                }
            }, {
                xtype: 'numberfield',
                fieldLabel: 'до',
                labelWidth: 20,
                emptyText: 'Максимум',
                margin: '0 0 0 5',
                reference: 'populationMaxFilter',
                triggers: {
                    clear: {
                        cls: 'x-form-clear-trigger',
                        handler: function(field) {
                            field.reset();
                            var grid = field.up('grid');
                            var store = grid.getStore();

                            if (field.reference === 'cityNameFilter') {
                                store.removeFilter('cityNameFilter');
                            } else if (field.reference === 'regionFilter') {
                                store.removeFilter('regionFilter');
                            }

                            grid.getSelectionModel().deselectAll();
                        }
                    }
                },
                listeners: {
                    change: 'onPopulationMaxFilterChange',
                    buffer: 300
                }
            }]
        }, {
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            displayInfo: true,
            enableOverflow: true,
            overflowHandler: 'scroller',
            bind: {
                store: '{streets}'
            },
            displayMsg: 'Displaying {0} - {1} of {2}',
            emptyMsg: 'No records to display',
        }, {
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                xtype: 'button',
                text: 'Добавить улицу',
                iconCls: 'x-fa fa-plus',
                handler: 'onAddStreet'
            }]
        }]
    }]
});