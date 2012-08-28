function LayoutNavViewModel() {
    var self = this;

    var path = location.href;
    path = path.substr(path.indexOf('://') + 3); // strip out the protocol
    path = path.substr(path.indexOf('/')); // strip out the domain name
    if (path.indexOf('?') >= 0) // strip off the querystring
        path = path.substr(0, path.indexOf('?'));
    if (path.indexOf('#') >= 0) // strip off the hash
        path = path.substr(0, path.indexOf('#'));
    self.location = path;

    self.cleanHref = function (href) {
        // ignore trailing slash in link href
        if (href != '/' && href.lastIndexOf('/') === href.length - 1)
            href = href.substr(0, href.length - 1);
        return href;
    };
}

ko.bindingHandlers.locationHref = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var $a = $(element),
            href = $a.attr('href'),
            currentClass = ko.utils.unwrapObservable(valueAccessor());

        if (!href) return;
        href = viewModel.cleanHref(href);

        if (href === '/') { // handle the root separately from all other URL's
            if (viewModel.location === href && !$a.hasClass(currentClass)) {
                $a.addClass(currentClass); // only current when exactly equal
            }
        }
        else {
            if (viewModel.location.indexOf(href) === 0 && !$a.hasClass(currentClass)) {
                $a.addClass(currentClass); // add current class due to match
            } else if ($a.hasClass(currentClass)) {
                $a.removeClass(currentClass); // remove current class due to no match
            }
        }
    }
};

ko.applyBindings(new LayoutNavViewModel(), $('#main > aside .content > ul')[0]);
