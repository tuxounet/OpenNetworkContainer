var ONC_PageContainer = function ($container) {

    var self = this;


    self.nav_open = false;

    self.inner = document.getElementById('inner-wrap');
    self.nav_class = 'js-nav';

    self.doc = document.documentElement;
    self.built = false;

    var transform_prop = window.Modernizr.prefixed('transform');
    var transition_prop = window.Modernizr.prefixed('transition');
    var transition_end = (function () {
        var props = {
            'WebkitTransition': 'webkitTransitionEnd',
            'MozTransition': 'transitionend',
            'OTransition': 'oTransitionEnd otransitionend',
            'msTransition': 'MSTransitionEnd',
            'transition': 'transitionend'
        };
        return props.hasOwnProperty(transition_prop) ? props[transition_prop] : false;
    })();


    self.closeNav = function () {
        if (self.nav_open) {
            // close navigation after transition or immediately
            var duration = (transition_end && transition_prop) ? parseFloat(window.getComputedStyle(document.getElementById("inner-wrap"), '')[transition_prop + 'Duration']) : 0;
            if (duration > 0) {
                document.addEventListener(transition_end, self.closeNavEnd, false);
            } else {
                self.closeNavEnd(null);
            }
        }
        self.removeClass(self.doc, self.nav_class);
    };

    self.openNav = function () {
        if (self.nav_open) {
            return;
        }
        self.addClass(self.doc, self.nav_class);
        self.nav_open = true;
    };

    self.toggleNav = function (e) {
        if (self.nav_open && self.hasClass(self.doc, self.nav_class)) {
            self.closeNav();
        } else {
            self.openNav();
        }
        if (e) {
            e.preventDefault();
        }
    };

    self.goBack = function () {
        //Accède a la page précédente
        kernel.router.goBack();
    }

    self.bodyClose = function (e) {
        if (self.nav_open && !self.hasParent(e.target, 'nav')) {
            e.preventDefault();
            self.closeNav();
        }

    };

    self.closeNavEnd = function (e) {
        if (e && e.target === self.inner) {
            document.removeEventListener(transition_end, self.closeNavEnd, false);
        }
        self.nav_open = false;
    };




    // helper functions

    self.trim = function (str) {
        return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
    };

    self.hasClass = function (el, cn) {
        return (' ' + el.className + ' ').indexOf(' ' + cn + ' ') !== -1;
    };

    self.addClass = function (el, cn) {
        if (!self.hasClass(el, cn)) {
            el.className = (el.className === '') ? cn : el.className + ' ' + cn;
        }
    };

    self.removeClass = function (el, cn) {
        el.className = self.trim((' ' + el.className + ' ').replace(' ' + cn + ' ', ' '));
    };

    self.hasParent = function (el, id) {
        if (el) {
            do {
                if (el.id === id) {
                    return true;
                }
                if (el.nodeType === 9) {
                    break;
                }
            }
            while ((el = el.parentNode));
        }
        return false;
    };


    self.showContent = function (callback) {
        var $content = $(".page.center section[role=application]");

        $content.fadeIn("fast", function () {

            $content.show();

            if (callback) callback();

        });
    };

    self.hideContent = function (callback) {
        var $content = $(".page.center section[role=application]");

        $content.fadeOut("fast", function () {

            $content.hide();

            if (callback) callback();

        });
    };



    self.build = function () {
        self.nav_open = false;
        self.inner = document.getElementById('inner-wrap');
        self.nav_class = 'js-nav';

        self.doc = document.documentElement;

        //Recuperation du bouton
        var buttonOpenElement = document.getElementById('nav-open-btn');

        if (buttonOpenElement != null) {
            //Si il y a un bouton qui actionne l'ouverture de la pane
            // open nav with main "nav" button
            buttonOpenElement.addEventListener('click', self.toggleNav, false);

            // close nav with main "close" button
            document.getElementById('nav-close-btn').addEventListener('click', self.toggleNav, false);

            // close nav by touching the partial off-screen content
            document.addEventListener('click', self.bodyClose, true);

        }

        self.addClass(self.doc, 'js-ready');
        self.built = true;
    };

    self.destroy = function () {
        if (!self.built)
            return;

        self.removeClass(self.doc, 'js-nav');

        // close nav by touching the partial off-screen content
        document.removeEventListener('click', self.bodyClose, true);

        // close nav with main "close" button
        var closeButton = document.getElementById('nav-close-btn');
        if (closeButton != null)
            closeButton.removeEventListener('click', self.toggleNav, false);

        // open nav with main "nav" button
        var openButton = document.getElementById('nav-open-btn');
        if (openButton != null)
            openButton.removeEventListener('click', self.toggleNav, false);

        self.removeClass(self.doc, 'js-ready');
        self.doc = null;
        self.inner = null;

    };

};


