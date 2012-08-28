function Slider(options) {
    var self = this;
    options = options || {};
    var defaults = {
        speed: 'fast',
        containerId: 'slider',
        frameClass: 'frame',
        currentFrameClass: 'current',
        frameWidth: 710
    };
    var settings = $.extend(defaults, options);

    var currentFrameSelector = '#' + settings.containerId + ' .' + settings.currentFrameClass + '.' + settings.frameClass;
    var otherFrameSelector = '.' + settings.frameClass;

    self.next = function (distance) {
        var $currentFrame = $(currentFrameSelector),
            $nextFrame = $currentFrame.next(otherFrameSelector);
        distance = distance || 1;
        for (var i = distance; i > 1; i--) {
            $nextFrame.hide();
            $nextFrame = $nextFrame.next(otherFrameSelector);
        }

        // display the next/right frame since its parent's overflow will obscure it
        $nextFrame.show();

        // reduce the left margin of the left frame to slide the right frame into view
        $currentFrame.animate({ marginLeft: (settings.frameWidth * -1) }, settings.speed, function () {

            // after the left frame has slid out of view, hide it
            $currentFrame.hide()

                // now that it's hidden, go ahead and put its margin back to zero
                .css({ marginLeft: 0 })

                // remove the css class since this is no longer the current frame
                .toggleClass(settings.currentFrameClass);

            // the left frame is now current
            $nextFrame.toggleClass(settings.currentFrameClass);
        });
    };

    self.prev = function (distance) {
        var $currentFrame = $(currentFrameSelector),
            $prevFrame = $currentFrame.prev(otherFrameSelector);
        distance = distance || 1;
        for (var i = distance; i > 1; i--) {
            $prevFrame.hide();
            $prevFrame = $prevFrame.prev(otherFrameSelector);
        }

        // reset the left frame to a negative left margin
        $prevFrame.css({ marginLeft: (settings.frameWidth * -1) })

            // show the left frame, since its parent's overflow will obscure it
            .show()

                // increase the left margin of the left frame to slide it into view (pushing right)
                .animate({ marginLeft: 0 }, settings.speed, function () {

                    // after the right frame  is slid out of view, hide it
                    $currentFrame.hide()

                        // remvoe the css class since this is no longer the current frame
                        .toggleClass(settings.currentFrameClass);

                    // the right frame is now current
                    $prevFrame.toggleClass(settings.currentFrameClass);
                });
    };
}
