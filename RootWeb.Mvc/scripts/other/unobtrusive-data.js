(function ($) {
    $.danludwig = $.danludwig || {
        obtruders: {},
        obtrude: function (selector, obtruders) {
            var obtruder;
            obtruders = obtruders || $.danludwig.obtruders;
            for (obtruder in obtruders) { // execute every registered obtruder
                if (obtruders.hasOwnProperty(obtruder)) { // skip any inherited members

                    // apply an unobtrusive behavior
                    if (typeof obtruders[obtruder] === 'function') {
                        obtruders[obtruder].apply(this,
                            Array.prototype.slice.call(arguments, 0, 1) || document);
                    }

                    // apply all unobtrusive behaviors in set
                    if (typeof obtruders[obtruder] === 'object') {
                        $.danludwig.obtrude(selector, obtruders[obtruder]);
                    }
                }
            }
        }
    };

    $.extend($.danludwig.obtruders, {
        autosize: function (selector) {
            if ($.fn.autosize)
                $(selector).find('textarea[data-autosize]').autosize();
        },
        placeholder: function (selector) {
            if ($.fn.placeholder)
                $(selector).find('input[placeholder], textarea[placeholder]').placeholder();
        }
    });

    $(function () {
        $.danludwig.obtrude(document);
    });
} (jQuery));