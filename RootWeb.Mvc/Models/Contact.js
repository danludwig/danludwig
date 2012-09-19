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

    self.email = ko.observable('asdf@asdf.asdf')
        .extend({
            required: {
                message: 'I\'m going to need your email address.'
            },
            email: {
                message: 'Come on, everyone knows this is not a real email address.'
            }
        });

    self.subject = ko.observable()
        .extend({
            maxLength: {
                params: 50,
                message: 'Tighten up your subject, it\'s too long ({0} characters max please)'
            }
        });

    self.messageCharsMax = 1000;
    self.message = ko.observable()
        .extend({
            required: {
                message: 'Message is NOT optional.'
            },
            maxLength: {
                params: 1000,
                message: 'Tighten up your message, it\'s too long'
            }
        });
    self.messageCharsRemaining = ko.computed(function () {
        var message = self.message();
        return message ? self.messageCharsMax - message.length : self.messageCharsMax;
    });
    self.messageCharsOverflowed = ko.computed(function () {
        var remaining = self.messageCharsRemaining();
        return remaining < 0;
    });
    self.messageCharactersPluralizer = ko.computed(function () {
        var remaining = self.messageCharsRemaining();
        return remaining == 1 || remaining == -1 ? 'character' : 'characters';
    });

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
        $.post('/api/contact', {
            email: self.email(),
            subject: self.subject(),
        })
        .success(function (response) {
            alert('successful response ' + response);
        });
        //router.navigate('//sent', { replace: true });
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
        insertMessages: true,
        parseInputAttributes: true
});
