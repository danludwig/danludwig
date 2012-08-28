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

    Backbone.history.start();
    location.hash = '/compose';

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

ko.applyBindings(new ContactViewModel(), $('#main > .content')[0]);
