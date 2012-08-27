function ContactViewModel() {
    var self = this;

    // set up router
    var router = new Backbone.Router({
        routes: {
            'preview': 'preview',
            'compose': 'compose',
            'sent': 'sent',
            'reset': 'reset'
        }
    });
    Backbone.history.start();
    location.hash = '/compose';

    // set up slider
    var slider = new Slider({
        //speed: 'slow'
    });

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
        router.navigate('//sent');
        e.preventDefault();
        return false;
    };

    router.on('route:compose', function () {
        if ($('#preview').hasClass('current')) {
            slider.left();
        }
        else if ($('#sent').hasClass('current')) {
            slider.left(2);
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
        else if ($('#compose').hasClass('current')) {
            slider.right(2);
        }
    });
}
