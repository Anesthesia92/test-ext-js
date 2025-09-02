Ext.define('MyApp.view.dialog.AddStreetController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.addstreet',

    init: function() {
        this.getView().on('afterrender', this.onWindowAfterRender, this);
    },

    onWindowAfterRender: function() {
        var formPanel = this.lookupReference('addStreetForm');

        if (formPanel && formPanel.isXType('form')) {
            var form = formPanel.getForm();
            var fields = form.getFields();

            fields.each(function(field) {
                field.on('change', this.onFieldChange, this);
            }, this);
        }
        this.updateCreateButtonState();
    },

    onFieldChange: function() {
        this.updateCreateButtonState();
    },

    updateCreateButtonState: function() {
        var formPanel = this.lookupReference('addStreetForm');
        var createButton = this.getView().down('button[text=Создать]');

        if (formPanel && createButton) {
            var form = formPanel.getForm();
            createButton.setDisabled(!form.isValid());
        }
    },

    onCreateStreet: function() {
        var formPanel = this.lookupReference('addStreetForm');
        if (!formPanel) return;

        var form = formPanel.getForm();
        if (!form.isValid()) {
            Ext.toast('Пожалуйста, заполните все поля корректно', 3000);
            return;
        }

        var values = form.getValues();
        var streetStore = Ext.getStore('Streets');
        var controller = this;

        // Генерируем новый ID
        var maxId = 0;
        streetStore.each(function(record) {
            maxId = Math.max(maxId, record.get('id'));
        });
        var newId = maxId + 1;

        var newStreet = Ext.create('MyApp.model.Street', {
            id: newId,
            name: values.name,
            company: values.company,
            houses: parseInt(values.houses, 10),
            cityId: parseInt(values.cityId, 10)
        });

        var errors = newStreet.validate();
        if (!errors.isValid()) {
            // Возобновляем события перед выходом
            streetStore.resumeEvents();
            var errorMessage = 'Ошибки валидации: ';
            errors.each(function(error) {
                errorMessage += error.getMessage() + '; ';
            });
            Ext.Msg.alert('Ошибка', errorMessage);
            return;
        }

        var isDuplicate = streetStore.findBy(function(record) {
            return record.get('name').toLowerCase() === values.name.toLowerCase() &&
                record.get('cityId') === parseInt(values.cityId, 10);
        });

        if (isDuplicate !== -1) {
            Ext.Msg.alert('Ошибка', 'Улица с таким названием уже существует в выбранном городе');
            return;
        }

        streetStore.add(newStreet);

        var proxy = streetStore.getProxy();
        var data = proxy.getReader().rawData;
        streetStore.totalCount = data.items.length;
        data.items.push(newStreet.data);

        streetStore.loadPage(streetStore.currentPage, {
            callback: function() {
                var grid = Ext.ComponentQuery.query('grid[reference=streetGrid]')[0];
                if (grid) {
                    var view = grid.getView();
                    view.focus();
                    grid.getSelectionModel().select(newStreet);
                }
                controller.getView().close();

                var mainController = Ext.ComponentQuery.query('app-main')[0].getController();
                mainController.refreshStreetFilters();

                Ext.toast('Улица успешно добавлена', 3000);
            },
            scope: this
        });
        if (form && !form.destroyed) {
            form.reset();
        }
        var pagingToolbar = Ext.ComponentQuery.query('pagingtoolbar[dock=bottom]')[0];
        if (pagingToolbar) {
            pagingToolbar.updateInfo();
        }

        console.log('Всего записей в store:', streetStore.getTotalCount());
        console.log('Записей на текущей странице:', streetStore.getCount(), data.items);
    },
    /**
     * Обработчик закрытия окна
     */
    onWindowClose: function() {
        var form = this.lookupReference('addStreetForm');
        if (form) {
            form.destroy();
        }
    },

    /**
     * Валидация названия улицы
     */
    validateStreetName: function(value) {
        if (value && value.length < 5) {
            return 'Название улицы должно содержать не менее 5 символов';
        }
        return true;
    },

    /**
     * Валидация количества домов
     */
    validateHouses: function(value) {
        if (isNaN(value) || value <= 0) {
            return 'Количество домов должно быть положительным числом';
        }
        return true;
    }
});