/* Notes:
 * - History management is currently done using window.location.hash.  this could easily be changed to use Push State instead.
 * - jQuery dependency for now. this could also be easily removed.
 */

function ONC_PageSlider(app) {

    var self = this;

    self.app = app;

    var container = $("body"),
        currentPage,
        stateHistory = [];



    self.initialize = function ($container) {
        container = $container;
        //Affichage 
        $container.show();


    }



    /* Slide la page courante vers la pages suivante passée en parametres */
    self.slidePage = function (page, callback) {      
        if (self.app.boot.isLegacy == true) {
            //On est en mode legacy, on fait du best effort pour la transition de page
            self.slidePageLegacy(page, callback);
        }
        else {
            //Mode complet, on fait des transiitons en CSS3
            throw "Not implemented Yet";
        }
    }


    //#region Mode Legacy Transition


    // Use self function if you want PageSlider to automatically determine the sliding direction based on the state history
    self.slidePageLegacy = function (page, callback) {

        var l = stateHistory.length,
            state = window.location.hash;
        var from = null;

        if (l === 0) {
            //Page initiale
            stateHistory.push(state);
        } else {
            if (state === stateHistory[l - 2]) {
                stateHistory.pop();
                from = "left";
            } else {
                stateHistory.push(state);
                from = "right";
            }
        }


        //Transition Legacy
        currentPage = $(".page.center", container);

        //Pas de page précédente, ajout brut
        if (!currentPage || !from) {
            container.append(page);

            page.attr("class", "page center");
            currentPage = page;

            if (callback != null) callback();

            return;
        }

        //On masque les pages
        currentPage.hide();
        page.hide();

        //Ajout de la page au DOM 
        container.append(page);

        //Affichage de la page courante
        page.fadeIn("slow", function () {
            //Suppression du dom de la page précédente
            currentPage.remove();
            page.attr("class", "page center");

            if (callback != null) callback();
        });
    }
    //#endregion





    //#region Mode CSS3 Transition




    //#endregion

}