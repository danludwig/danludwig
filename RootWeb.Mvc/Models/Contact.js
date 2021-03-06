﻿/// <reference path="../scripts/jquery-1.8.0.js" />
/// <reference path="../scripts/knockout-2.1.0.js" />
/// <reference path="../scripts/knockout.validation.js" />
/// <reference path="../scripts/other/slider.js" />
/// <reference path="../scripts/recaptcha_ajax.js" />
/// <reference path="../scripts/sammy/sammy.js" />

ko.validation.rules['recaptcha'] = {
    async: true,
    validator: function (val, vm, callback) {
        $.ajax({
            url: '/recaptcha',
            type: 'POST',
            data: {
                recaptcha_challenge_field: $('#recaptcha_challenge_field').val(),
                recaptcha_response_field: $('#recaptcha_response_field').val()
            }
        })
        .success(function (response) {
            if (response === true) callback(true);
            else callback(false);
        });
    },
    message: 'Nope, that\'s wrong. Try another challenge.'
};
ko.validation.rules['maildomain'] = {
    async: false,
    validator: function (val, vm) {
        return !vm.invalidMailDomain();
    },
    message: 'The domain of this email address does not exist.'
};
ko.validation.rules['servererror'] = {
    async: false,
    validator: function (val, vm) {
        return !vm.serverError();
    },
    message: 'There was an error on the server.'
};
ko.validation.registerExtenders();

function ContactViewModel() {
    // fire up slider, history, router, and initialize page
    var self = this,
        slider = new Slider({});

    // compose viewmodel card
    // defaults
    self.composeViewModel = {
        subjectMaxChars: 50,
        messageMaxChars: 1000,
    };

    // email input
    var invalidEmailMessage = 'Come on, we both know this is not a real email address.';
    self.composeViewModel.invalidMailDomain = ko.observable(false);
    self.composeViewModel.email = ko.observable('asdf@asdf.asdf').extend({
        required: { message: 'I\'m going to need your email address.' },
        email: { message: invalidEmailMessage },
        maildomain: {
            message: invalidEmailMessage,
            params: self.composeViewModel
        }
    });
    self.composeViewModel.email.subscribe(function() {
        self.composeViewModel.invalidMailDomain(false);
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

    // preview viewmodel card
    // defaults
    self.previewViewModel = {
    };

    // borrow inputs from compose slide
    self.previewViewModel.email = ko.computed(self.composeViewModel.email);
    self.previewViewModel.subject = ko.computed(self.composeViewModel.subject);
    self.previewViewModel.message = ko.computed(self.composeViewModel.message);

    // recaptcha input
    self.previewViewModel.serverError = ko.observable(false);
    self.previewViewModel.recaptchaResponse = ko.observable().extend({
        required: { message: 'Prove you are a human.' },
        recaptcha: true,
        servererror: {
            message: 'Oops, there was an unexpected error on the server :(',
            params: self.previewViewModel
        }
    });

    // recaptcha element
    self.previewViewModel.recaptchaBox = undefined;

    // recaptcha validation
    self.previewViewModel.isValidating = ko.observable();
    self.previewViewModel.recaptchaResponse.isValidating.subscribe(function (isValidating) {
        self.previewViewModel.isValidating(isValidating);
        if (!isValidating) {
            if (self.previewViewModel.isValid()) {
                self.previewViewModel.send(self);
            }
            else {
                var $recaptchaBox = $(self.previewViewModel.recaptchaBox);
                $recaptchaBox.fadeOut('fast', function () {
                    Recaptcha.reload();
                    $recaptchaBox.fadeIn();
                });
            }
        }
    });

    // click button to compose (back from preview)
    self.previewViewModel.compose = function (viewModel, e) {
        history.back();
        e.preventDefault();
        return false;
    };

    // send the message
    self.isSent = ko.observable(false);
    self.isSending = ko.observable(false);
    self.previewViewModel.send = function (viewModel, e) {
        if (!self.previewViewModel.isValid()) {
            self.previewViewModel.errors.showAllMessages();
        }
        else if (!self.previewViewModel.isValidating()) {
            self.isSending(true);
            $.post('/contact', {
                email: self.composeViewModel.email(),
                subject: self.composeViewModel.subject(),
                message: self.composeViewModel.message(),
                challenge: $('#recaptcha_challenge_field').val(),
                response: self.previewViewModel.recaptchaResponse()
            })
            .complete(function() {
                self.isSending(false);
            })
            .success(function (response) {
                var $recaptchaBox;
                if (response === true) {
                    self.isSent(true);
                    self.sammy.setLocation('#/sent/');
                }
                else if (response === 'domain') {
                    self.composeViewModel.invalidMailDomain(true);
                    self.composeViewModel.errors.showAllMessages();
                    $recaptchaBox = $(self.previewViewModel.recaptchaBox);
                    $recaptchaBox.fadeOut('fast', function () {
                        Recaptcha.reload();
                        $recaptchaBox.fadeIn();
                    });
                    history.back();
                }
                else {
                    self.previewViewModel.serverError(true);
                    self.previewViewModel.errors.showAllMessages();
                    $recaptchaBox = $(self.previewViewModel.recaptchaBox);
                    $recaptchaBox.fadeOut('fast', function () {
                        Recaptcha.reload();
                        $recaptchaBox.fadeIn();
                    });
                }
            })
            .error(function () {
                self.previewViewModel.serverError(true);
                self.previewViewModel.errors.showAllMessages();
                var $recaptchaBox = $(self.previewViewModel.recaptchaBox);
                $recaptchaBox.fadeOut('fast', function () {
                    Recaptcha.reload();
                    $recaptchaBox.fadeIn();
                });
            });
        }
        if (e) e.preventDefault();
        return false;
    };

    // set up validation
    ko.validation.group(self.composeViewModel);
    ko.validation.group(self.previewViewModel);


    // submit the form
    self.submit = function () {
        self.previewViewModel.serverError(false);
        if ($('#compose').hasClass('current')) {
            if (self.composeViewModel.isValid()) {
                self.sammy.setLocation('#/preview/');
            }
            else {
                self.composeViewModel.errors.showAllMessages();
            }
        }
        else if ($('#preview').hasClass('current')) {
            var response = $('#recaptcha_response_field').val();
            self.previewViewModel.recaptchaResponse('');
            self.previewViewModel.recaptchaResponse(response);
        }
        return false;
    };

    // disable tabbing to hidden cards
    self.disableCard = function ($container) {
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
    self.disableCards = function () {
        $('#preview, #sent').each(function () {
            self.disableCard($(this));
        });
    };
    ko.computed(self.disableCards);

    self.sammy = Sammy(function () {

        this.use(Sammy.Title);
        this.setTitle('Contact me:');

        // slide to preview card
        this.before('#/preview/', function () {
            if ($('#compose').hasClass('current')) {
                if (!self.composeViewModel.isValid()) {
                    history.back();
                    return false;
                }
            }
            return true;
        });
        this.get('#/preview/', function () {
            this.title('preview your message');
            if ($('#compose').hasClass('current')) {
                slider.next();
            }
            else if ($('#sent').hasClass('current')) {
                slider.prev();
            }
            self.disableCard($('#compose'));
            self.disableCard($('#sent'));
            self.enableCard($('#preview'));
        });

        // slide to compose card
        this.get('#/compose/', function () {
            this.title('compose a message');
            if ($('#preview').hasClass('current')) {
                slider.prev();
            }
            else if ($('#sent').hasClass('current')) {
                slider.prev(2);
            }
            self.disableCard($('#preview'));
            self.disableCard($('#sent'));
            self.enableCard($('#compose'));
        });

        // slide to sent card
        this.get('#/sent/', function () {
            this.title('message sent');
            if ($('#preview').hasClass('current')) {
                slider.next();
            }
            if ($('#compose').hasClass('current')) {
                slider.next(2);
            }
            self.disableCard($('#preview'));
            self.disableCard($('#compose'));
            self.enableCard($('#sent'));
        });

        this.before('#/submit/', function () {
            return false;
        });

        // startup route
        this.get('', function () {
            this.app.setLocation('#/compose/');
        });
    });
    self.sammy.run();
}
