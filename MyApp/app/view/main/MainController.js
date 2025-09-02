Ext.define('MyApp.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main',

    requires: [
        'MyApp.view.dialog.AddStreet'
    ],

    init: function() {
        var vm = this.getViewModel();
        vm.bind('{selectedCity}', this.onCitySelectionChange, this);

        var streetStore = vm.getStore('streets');
        streetStore.on('datachanged', function() {
            var streetGrid = this.lookupReference('streetGrid');
            if (streetGrid) {
                streetGrid.getView().refresh();
            }
        }, this);
    },

    onCitySelectionChange: function(city) {
        var streetStore = this.getViewModel().getStore('streets');
        streetStore.removeFilter('cityFilter'); // Удаляем старый фильтр
        if(city) {
            streetStore.addFilter({
                id: 'cityFilter',
                property: 'cityId',
                value: city.get('id')
            });
        }
        streetStore.loadPage(1); // Перезагружаем страницу с новым фильтром
        this.updatePagingInfo();
    },

    onCityFilterChange: function(field, value) {
        var store = this.getViewModel().getStore('cities');
        store.clearFilter();
        if (value) {
            store.filter([{
                property: 'name',
                value: value,
                anyMatch: true,
                caseSensitive: false
            }]);
        }
    },

    onRegionFilterChange: function(combo, value) {
        var store = this.getViewModel().getStore('cities');
        store.clearFilter();

        if (value) {
            store.filter([{
                property: 'region',
                value: value,
                exactMatch: true,
                caseSensitive: false
            }]);
        }
    },

    onPopulationFilterChange: function(field, value) {
        var store = this.getViewModel().getStore('cities');
        store.clearFilter();
        if (value) {
            store.filter([{
                property: 'population',
                value: value,
                operator: '>='
            }]);
        }
    },
    updatePagingInfo: function() {
        var streetGrid = this.lookupReference('streetGrid');
        if (streetGrid) {
            var pagingToolbar = streetGrid.down('pagingtoolbar');
            if (pagingToolbar) {
                pagingToolbar.updateInfo();
            }
        }
    },
    onStreetNameFilterChange: function(field, value) {
        var store = this.getViewModel().getStore('streets');
        store.removeFilter('nameFilter');

        if (value) {
            store.addFilter({
                id: 'nameFilter',
                property: 'name',
                value: value,
                anyMatch: true,
                caseSensitive: false
            });
        }

        store.loadPage(1);
        this.updatePagingInfo();
    },
    onCompanyFilterChange: function(combo, value) {
        var store = this.getViewModel().getStore('streets');
        store.removeFilter('companyFilter');

        if (value) {
            store.addFilter({
                id: 'companyFilter',
                property: 'company',
                value: value,
                anyMatch: true,
                caseSensitive: false
            });
        }
    },

    onHousesFilterChange: function(field, value) {
        var store = this.getViewModel().getStore('streets');
        store.removeFilter('housesFilter');

        if (value) {
            store.addFilter({
                id: 'housesFilter',
                property: 'houses',
                value: value,
                exactMatch: true
            });
        }
    },

    onPopulationMinFilterChange: function(field, value) {
        var store = this.getViewModel().getStore('streets');
        var maxField = this.lookupReference('populationMaxFilter');
        var maxValue = maxField.getValue();

        store.removeFilter('populationMinFilter');
        store.removeFilter('populationMaxFilter');

        if (value || maxValue) {
            if (value && maxValue) {
                store.addFilter({
                    id: 'populationFilter',
                    property: 'population',
                    value: [value, maxValue],
                    operator: 'between'
                });
            } else if (value) {
                store.addFilter({
                    id: 'populationMinFilter',
                    property: 'population',
                    value: value,
                    operator: '>='
                });
            } else if (maxValue) {
                store.addFilter({
                    id: 'populationMaxFilter',
                    property: 'population',
                    value: maxValue,
                    operator: '<='
                });
            }
        }
    },

    onPopulationMaxFilterChange: function(field, value) {
        var minField = this.lookupReference('populationMinFilter');
        this.onPopulationMinFilterChange(minField, minField.getValue());
    },
    onResetAllFilters: function() {
        var cityStore = this.getViewModel().getStore('cities');
        cityStore.clearFilter();

        var streetStore = this.getViewModel().getStore('streets');
        streetStore.clearFilter();

        this.lookupReference('cityNameFilter').reset();
        this.lookupReference('regionFilter').reset();
        this.lookupReference('cityPopulationFilter').reset();

        this.lookupReference('streetNameFilter').reset();
        this.lookupReference('companyFilter').reset();
        this.lookupReference('housesFilter').reset();
        this.lookupReference('populationMinFilter').reset();
        this.lookupReference('populationMaxFilter').reset();

        this.lookupReference('cityGrid').getSelectionModel().deselectAll();
        this.lookupReference('streetGrid').getSelectionModel().deselectAll();

        this.getViewModel().set('selectedCity', null);

        streetStore.loadPage(1);
        this.updatePagingInfo();
        cityStore.loadPage(1);
    },

    onDeleteStreet: function(view, rowIndex, colIndex, item, e, record) {
        Ext.Msg.confirm('Подтверждение удаления',
            'Вы уверены, что хотите удалить улицу "' + record.get('name') + '"?',
            function(btn) {
                if (btn === 'yes') {
                    var store = this.getViewModel().getStore('streets');
                    store.remove(record);
                    var proxy = store.getProxy();
                    var data = proxy.getReader().rawData;
                    var index = data.items.findIndex(function(item) {
                        return item.id === record.get('id');
                    });
                    if (index !== -1) {
                        data.items.splice(index, 1);
                    }
                    store.totalCount = data.items.length;

                    store.loadPage(store.currentPage, {
                        callback: function() {
                            Ext.toast('Улица успешно удалена', 3000);
                            this.updatePagingInfo();
                        },
                        scope: this
                    });

                    store.loadPage(1);
                }
            }, this);
    },

    onAddStreet: function() {
        var dialog = Ext.create('MyApp.view.dialog.AddStreet');
        dialog.show();

        var store = this.getViewModel().getStore('streets');
        var proxy = store.getProxy();
        var data = proxy.getReader().rawData;
        store.totalCount = data.items.length;

        store.loadPage(store.currentPage, {
            callback: function() {
                this.updatePagingInfo();
            },
            scope: this
        });
    },

    onEditComplete: function(editor, context) {
        var record = context.record;
        var field = context.field;

        Ext.Msg.confirm('Подтверждение', 'Сохранить изменения?',
            function(btn) {
                if (btn === 'yes') {
                    record.commit();
                    Ext.toast('Изменения сохранены', 3000);
                } else {
                    record.reject();
                    Ext.toast('Изменения отменены', 3000);
                }
            });
    },
    refreshStreetFilters: function() {
        var vm = this.getViewModel();
        var streetStore = vm.getStore('streets');

        var selectedCity = vm.get('selectedCity');
        var streetNameFilter = this.lookupReference('streetNameFilter').getValue();
        var companyFilter = this.lookupReference('companyFilter').getValue();
        var housesFilter = this.lookupReference('housesFilter').getValue();
        var populationMinFilter = this.lookupReference('populationMinFilter').getValue();
        var populationMaxFilter = this.lookupReference('populationMaxFilter').getValue();

        streetStore.clearFilter(true);

        if (selectedCity) {
            streetStore.filter({id: 'cityFilter', property: 'cityId', value: selectedCity.get('id')});
        }
        if (streetNameFilter) {
            streetStore.filter({id: 'nameFilter', property: 'name', value: streetNameFilter, anyMatch: true, caseSensitive: false});
        }
        if (companyFilter) {
            streetStore.filter({id: 'companyFilter', property: 'company', value: companyFilter, anyMatch: true, caseSensitive: false});
        }
        if (housesFilter) {
            streetStore.filter({id: 'housesFilter', property: 'houses', value: housesFilter, exactMatch: true});
        }
        if (populationMinFilter != null && populationMinFilter !== '') {
            if (populationMaxFilter != null && populationMaxFilter !== '') {
                streetStore.filter({id: 'populationFilter', property: 'population', value: [populationMinFilter, populationMaxFilter], operator: 'between'});
            } else {
                streetStore.filter({id: 'populationMinFilter', property: 'population', value: populationMinFilter, operator: '>='});
            }
        } else if (populationMaxFilter != null && populationMaxFilter !== '') {
            streetStore.filter({id: 'populationMaxFilter', property: 'population', value: populationMaxFilter, operator: '<='});
        }

        streetStore.loadPage(1);

        this.updatePagingInfo();

        // Явное обновление вида таблицы чтобы применить изменения
        var streetGrid = this.lookupReference('streetGrid');
        if (streetGrid) {
            streetGrid.getView().refresh();
        }
    }


});