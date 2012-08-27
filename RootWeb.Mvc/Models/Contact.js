function ContactViewModel() {
    var self = this,
        slider = new Slider({}),
        router = new Backbone.Router({
            routes: {
                'preview': 'preview',
                'compose': 'compose',
                'sent': 'sent',
                'reset': 'reset'
            }
        });

    Backbone.history.start();
    location.hash = '/compose';

    self.sent = ko.observable(false);

    self.preview = function (viewModel, e) {
        router.navigate('//preview');
        e.preventDefault();
        return false;
    };

    self.compose = function (viewModel, e) {
        history.back();
        e.preventDefault();
        return false;
    };

    self.send = function (viewModel, e) {
        self.sent(true);
        router.navigate('//sent', { replace: true });
        e.preventDefault();
        return false;
    };

    router.on('route:compose', function () {
        if ($('#preview').hasClass('current')) {
            slider.left();
        }
        else if ($('#sent').hasClass('current')) {
            history.back();
        }
    });

    router.on('route:preview', function () {
        if ($('#compose').hasClass('current')) {
            slider.right();
        }
        else if ($('#sent').hasClass('current')) {
            router.navigate('//compose', { replace: true });
        }
    });

    router.on('route:sent', function () {
        if ($('#preview').hasClass('current')) {
            slider.right();
        }
    });
}

ko.applyBindings(new ContactViewModel());
