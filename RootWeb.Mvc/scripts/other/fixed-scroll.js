(function ($) {
    $('[data-static-scroll=container]').each(function () {
        var $window = $(window),
            $container = $(this),
            $fixed = $container.find('[data-static-scroll=fixed]'),
            $anchor = $container.find('[data-static-scroll=anchor]'),
            fixedWidth = $fixed.width(),
            update = function () {
                var windowScrollTop = $window.scrollTop(),
                    anchorOffsetTop = $anchor.offset().top;
                if (windowScrollTop > anchorOffsetTop)
                    if ($fixed.height() > $window.height())
                        $fixed.css({ position: 'fixed', top: '', bottom: '0px', width: fixedWidth });
                    else
                        $fixed.css({ position: 'fixed', top: '0px', bottom: '', width: fixedWidth });
                else if (windowScrollTop <= anchorOffsetTop)
                    $fixed.css({ position: 'relative', top: '', bottom: '' });
            };
        $window.scroll(update).resize(update);
        update();
    });
}(jQuery));
