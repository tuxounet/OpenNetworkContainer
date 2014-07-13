/* Notes:
 * - History management is currently done using window.location.hash.  this could easily be changed to use Push State instead.
 * - jQuery dependency for now. this could also be easily removed.
 */

function ONC_PageSlider() {

    var self = this; 

    var container = $("body"),
        currentPage,
        stateHistory = [];

    

    self.initialize = function ($container)
    {
        container = $container;
        //Affichage 
        $container.show();


    }

    // Use self function if you want PageSlider to automatically determine the sliding direction based on the state history
    self.slidePage = function (page, callback) {

        var l = stateHistory.length,
            state = window.location.hash;

        if (l === 0) {
            stateHistory.push(state);
            self.slidePageFrom(page, null, callback);

            return;
        }
        if (state === stateHistory[l - 2]) {
            stateHistory.pop();
            self.slidePageFrom(page, 'left', callback);
        } else {
            stateHistory.push(state);
            self.slidePageFrom(page, 'right', callback);
        }

    }

    // Use self function directly if you want to control the sliding direction outside PageSlider
    self.slidePageFrom = function (page, from, callback) {


        container.append(page);

        if (!currentPage || !from) {
            page.attr("class", "page center");
            currentPage = page;

            if (callback != null) callback();

            return;
        }

        // Position the page at the starting position of the animation
        page.attr("class", "page " + from);

        //On tuilise Modernize pour savoir sur quel eveneltn de fin de transition ets a utiliser

        var transEndEventNames = {
            'WebkitTransition': 'webkitTransitionEnd',// Saf 6, Android Browser
            'MozTransition': 'transitionend',      // only for FF < 15
            'transition': 'transitionend'       // IE10, Opera, Chrome, FF 15+, Saf 7+
        };
        transEndEventName = transEndEventNames[Modernizr.prefixed('transition')];

        currentPage.one(transEndEventName, function (e) {
            $(e.target).remove();

            if (callback != null) callback();
        });



        // Force reflow. More information here: http://www.phpied.com/rendering-repaint-reflowrelayout-restyle/
        container[0].offsetWidth;

        // Position the new page and the current page at the ending position of their animation with a transition class indicating the duration of the animation
        page.attr("class", "page transition center");
        currentPage.attr("class", "page transition " + (from === "left" ? "right" : "left"));
        currentPage = page;
    }

}