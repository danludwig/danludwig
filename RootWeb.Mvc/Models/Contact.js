function ContactViewModel() {
    var self = this,
        slider = new Slider({}),
        router = new Backbone.Router({
            routes: {
                'preview': 'preview',
                'compose': 'compose',
                'sent': 'sent'
            }
        });

    self.email = ko.observable()
        .extend({ required: { message: 'I\'m going to need your email address.' } });

    Backbone.history.start();
    router.navigate('//compose', { replace: true });

    self.preview = function (viewModel, e) {
        if (self.isValid()) {
            router.navigate('//preview');
        }
        else {
            self.errors.showAllMessages();
        }
        e.preventDefault();
        return false;
    };

    self.compose = function (viewModel, e) {
        history.back();
        e.preventDefault();
        return false;
    };

    self.send = function (viewModel, e) {
        router.navigate('//sent', { replace: true });
        e.preventDefault();
        return false;
    };

    router.on('route:', function () {
        alert('empty route');
    });

    router.on('route:compose', function () {
        if ($('#preview').hasClass('current')) {
            slider.prev();
        }
        else if ($('#sent').hasClass('current')) {
            history.back();
        }
    });

    router.on('route:preview', function () {
        if ($('#compose').hasClass('current')) {
            slider.next();
        }
        else if ($('#sent').hasClass('current')) {
            router.navigate('//compose', { replace: true });
        }
    });

    router.on('route:sent', function () {
        if ($('#preview').hasClass('current')) {
            slider.next();
        }
    });
}

ko.applyBindingsWithValidation(
    ko.validatedObservable(new ContactViewModel()),
    $('#main > .content')[0],
    {
        decorateElement: true,
        errorElementClass: 'error-field',
        errorMessageClass: 'error-message',
        parseInputAttributes: true,
        insertMessages: true
});
