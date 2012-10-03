ko.validation.rules['recaptcha'] = {
    //async: true,
    validator: function (val, options) {
        // do not submit if recaptcha has no value
        if (!val) return false;

        var isValid = false;
        var defaults = {
            type: 'POST',
            async: false,
            success: function (response) {
                //alert('successful response ' + response);
                isValid = response === true;
            }
        };
        var settings = $.extend(defaults, options);
        settings.data = settings.data || { };
        settings.data.recaptcha_challenge_field = $('#recaptcha_challenge_field').val();
        settings.data.recaptcha_response_field = $('#recaptcha_response_field').val();

        $.ajax(settings);
        return isValid;
    },
    message: 'Nope, that\'s wrong. Try another challenge.'
};

ko.validation.registerExtenders();

function ContactViewModel() {
    // fire up slider, history, router, and initialize page
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
    router.navigate('//compose', { replace: true });

    // compose viewmodel card
    // defaults
    self.composeViewModel = {
        subjectMaxChars: 50,
        messageMaxChars: 1000,
    };

    // email input
    self.composeViewModel.email = ko.observable('asdf@asdf.asdf').extend({
        required: { message: 'I\'m going to need your email address.' },
        email: { message: 'Come on, we both know this is not a real email address.' }
    });

    // subject input
    self.composeViewModel.subject = ko.observable().extend({
        maxLength: {
            params: self.composeViewModel.subjectMaxChars,
            message: 'Tighten up your subject, it\'s too long ({0} characters max please)'
        }
    });

    // message input
    self.composeViewModel.message = ko.observable('message').extend({
        required: { message: 'Message is NOT optional.' },
        maxLength: {
            params: self.composeViewModel.messageMaxChars,
            message: 'Tighten up your message, it\'s too long'
        }
    });

    // message remaining characters (max minus current)
    self.composeViewModel.messageCharsRemaining = ko.computed(function () {
        var message = self.composeViewModel.message();
        var maxChars = self.composeViewModel.messageMaxChars;
        return message ? maxChars - message.length : maxChars;
    });

    // true when max characters is currently exceeded
    self.composeViewModel.messageCharsOverflowed = ko.computed(function () {
        var remaining = self.composeViewModel.messageCharsRemaining();
        return remaining < 0;
    });

    // pluralize the character counter (singular on 1 and negative 1)
    self.composeViewModel.messageCharactersPluralizer = ko.computed(function () {
        var remaining = self.composeViewModel.messageCharsRemaining();
        return remaining == 1 || remaining == -1 ? 'character' : 'characters';
    });

    // click button to preview message
    self.composeViewModel.preview = function (viewModel, e) {
        var composeValidationModel = ko.validatedObservable(self.composeViewModel);
        if (composeValidationModel.isValid()) {
            router.navigate('//preview');
        }
        else {
            composeValidationModel.errors.showAllMessages();
        }
        e.preventDefault();
        return false;
    };

    // preview viewmodel card
    // defaults
    self.previewViewModel = {
        recaptchaValidationUrl: '/recaptcha'
    };

    // borrow inputs from compose slide
    self.previewViewModel.email = ko.computed(self.composeViewModel.email);
    self.previewViewModel.subject = ko.computed(self.composeViewModel.subject);
    self.previewViewModel.message = ko.computed(self.composeViewModel.message);

    // recaptcha input
    self.previewViewModel.recaptchaResponse = ko.observable().extend({
        required: { message: 'Prove you are a human.' },
        recaptcha: {
            url: self.previewViewModel.recaptchaValidationUrl,
        }
    });

    // click button to compose (back from preview)
    self.previewViewModel.compose = function (viewModel, e) {
        history.back();
        e.preventDefault();
        return false;
    };

    // send the message
    self.previewViewModel.send = function (viewModel, e) {
        self.previewViewModel.recaptchaResponse($('#recaptcha_response_field').val());
        var previewValidationModel = ko.validatedObservable(self.previewViewModel);
        if (previewValidationModel.isValid()) {
            $.post('/contact', {
                email: self.composeViewModel.email(),
                subject: self.composeViewModel.subject(),
                message: self.composeViewModel.message(),
                challenge: $('#recaptcha_challenge_field').val(),
                response: self.previewViewModel.recaptchaResponse()
            })
            .success(function(response) {
                alert('successful response ' + response);
            })
            .error(function(response, error, message) {
                alert('There was an error: ' + message);
            });
        }
        //router.navigate('//sent', { replace: true });
        e.preventDefault();
        return false;
    };

    // disable tabbing to hidden cards
    self.disableCard = function($container) {
        $container.find('input, textarea, a').attr('tabindex', -1)
            .attr('data-tabindex-set', true).data('tabindex-set', true);
    };

    // enable tabbing within visible cards
    self.enableCard = function ($container) {
        $container.find('input, textarea, a').each(function () {
            var $this = $(this);
            if ($this.attr('data-tabindex-set')) {
                $this.removeAttr('tabindex').removeAttr('data-tabindex-set').removeData('tabindex-set');
            }
        });
    };

    // disable tabbing to other cards
    ko.computed(function () {
        $('#preview, #sent').each(function () {
            self.disableCard($(this));
        });
    });

    // slide to compose card
    router.on('route:compose', function () {
        if ($('#preview').hasClass('current')) {
            slider.prev();
        }
        else if ($('#sent').hasClass('current')) {
            history.back();
        }
        self.disableCard($('#preview'));
        self.disableCard($('#sent'));
        self.enableCard($('#compose'));
    });

    // slide to preview card
    router.on('route:preview', function () {
        if ($('#compose').hasClass('current')) {
            slider.next();
        }
        else if ($('#sent').hasClass('current')) {
            router.navigate('//compose', { replace: true });
        }
        self.disableCard($('#compose'));
        self.disableCard($('#sent'));
        self.enableCard($('#preview'));
    });

    // slide to sent card
    router.on('route:sent', function () {
        if ($('#preview').hasClass('current')) {
            slider.next();
        }
        self.disableCard($('#preview'));
        self.disableCard($('#compose'));
        self.enableCard($('#sent'));
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
