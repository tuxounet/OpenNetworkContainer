/* Notes:
 * - History management is currently done using window.location.hash.  this could easily be changed to use Push State instead.
 * - jQuery dependency for now. this could also be easily removed.
 */

function ONC_PageSlider(app) {

    var self = this;

    self.app = app;

    var container = $("body");
    var currentPage;
    var stateHistory = [];



    self.initialize = function ($container) {
        container = $container;
        //Affichage 
        $container.show();


    }



    /* Slide la page courante vers la pages suivante passée en parametres */
    self.slidePage = function (page, callback) {


        var l = stateHistory.length;
        var state = window.location.hash;
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

        if (self.app.boot.isLegacy == true) {
            //On est en mode legacy, on fait du best effort pour la transition de page
            self.slidePageLegacy(page, callback);
        }
        else {
            //Mode complet, on fait des transiitons en CSS3
            self.slidePage(page, from, callback);
        }
    }


    //#region Mode Legacy Transition


    // Use self function if you want PageSlider to automatically determine the sliding direction based on the state history
    self.slidePageLegacy = function (page, callback) {

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

    self.slidePage = function (page, direction, callback) {
     

       container.css("-webkit-perspective", self.app.viewport.getScreenWidth());
        var PageTransitions = (function () {

            /*Mécanique interne*/
            var $main = $(self.app.params.sliderSelector),
                animcursor = 1,
                current = 0,
                isAnimating = false,
                endCurrPage = false,
                endNextPage = false,
                animEndEventNames = {
                    'WebkitAnimation': 'webkitAnimationEnd',
                    'OAnimation': 'oAnimationEnd',
                    'msAnimation': 'MSAnimationEnd',
                    'animation': 'animationend'
                },
                // animation end event name
                animEndEventName = animEndEventNames[Modernizr.prefixed('animation')],
                // support css animations
                support = Modernizr.cssanimations;

            function nextPage(animation, callback) {

                if (isAnimating) {
                    return false;
                }

                isAnimating = true;

                //Mise a joru des variables 
                $pages = $main.children('div.pt-page');

                $pages.each(function () {
                    var $page = $(this);
                    $page.data('originalClassList', $page.attr('class'));
                });

                pagesCount = $pages.length;
                current = 0;
                var $currPage = $pages.eq(current);

                if (current < pagesCount - 1) {
                    ++current;
                }
                else {
                    current = 0;
                }

                var $nextPage = $pages.eq(current).addClass('pt-page-current'),
                    outClass = '', inClass = '';

                switch (animation) {

                    case 1:
                        outClass = 'pt-page-moveToLeft';
                        inClass = 'pt-page-moveFromRight';
                        break;
                    case 2:
                        outClass = 'pt-page-moveToRight';
                        inClass = 'pt-page-moveFromLeft';
                        break;
                    case 3:
                        outClass = 'pt-page-moveToTop';
                        inClass = 'pt-page-moveFromBottom';
                        break;
                    case 4:
                        outClass = 'pt-page-moveToBottom';
                        inClass = 'pt-page-moveFromTop';
                        break;
                    case 5:
                        outClass = 'pt-page-fade';
                        inClass = 'pt-page-moveFromRight pt-page-ontop';
                        break;
                    case 6:
                        outClass = 'pt-page-fade';
                        inClass = 'pt-page-moveFromLeft pt-page-ontop';
                        break;
                    case 7:
                        outClass = 'pt-page-fade';
                        inClass = 'pt-page-moveFromBottom pt-page-ontop';
                        break;
                    case 8:
                        outClass = 'pt-page-fade';
                        inClass = 'pt-page-moveFromTop pt-page-ontop';
                        break;
                    case 9:
                        outClass = 'pt-page-moveToLeftFade';
                        inClass = 'pt-page-moveFromRightFade';
                        break;
                    case 10:
                        outClass = 'pt-page-moveToRightFade';
                        inClass = 'pt-page-moveFromLeftFade';
                        break;
                    case 11:
                        outClass = 'pt-page-moveToTopFade';
                        inClass = 'pt-page-moveFromBottomFade';
                        break;
                    case 12:
                        outClass = 'pt-page-moveToBottomFade';
                        inClass = 'pt-page-moveFromTopFade';
                        break;
                    case 13:
                        outClass = 'pt-page-moveToLeftEasing pt-page-ontop';
                        inClass = 'pt-page-moveFromRight';
                        break;
                    case 14:
                        outClass = 'pt-page-moveToRightEasing pt-page-ontop';
                        inClass = 'pt-page-moveFromLeft';
                        break;
                    case 15:
                        outClass = 'pt-page-moveToTopEasing pt-page-ontop';
                        inClass = 'pt-page-moveFromBottom';
                        break;
                    case 16:
                        outClass = 'pt-page-moveToBottomEasing pt-page-ontop';
                        inClass = 'pt-page-moveFromTop';
                        break;
                    case 17:
                        outClass = 'pt-page-scaleDown';
                        inClass = 'pt-page-moveFromRight pt-page-ontop';
                        break;
                    case 18:
                        outClass = 'pt-page-scaleDown';
                        inClass = 'pt-page-moveFromLeft pt-page-ontop';
                        break;
                    case 19:
                        outClass = 'pt-page-scaleDown';
                        inClass = 'pt-page-moveFromBottom pt-page-ontop';
                        break;
                    case 20:
                        outClass = 'pt-page-scaleDown';
                        inClass = 'pt-page-moveFromTop pt-page-ontop';
                        break;
                    case 21:
                        outClass = 'pt-page-scaleDown';
                        inClass = 'pt-page-scaleUpDown pt-page-delay300';
                        break;
                    case 22:
                        outClass = 'pt-page-scaleDownUp';
                        inClass = 'pt-page-scaleUp pt-page-delay300';
                        break;
                    case 23:
                        outClass = 'pt-page-moveToLeft pt-page-ontop';
                        inClass = 'pt-page-scaleUp';
                        break;
                    case 24:
                        outClass = 'pt-page-moveToRight pt-page-ontop';
                        inClass = 'pt-page-scaleUp';
                        break;
                    case 25:
                        outClass = 'pt-page-moveToTop pt-page-ontop';
                        inClass = 'pt-page-scaleUp';
                        break;
                    case 26:
                        outClass = 'pt-page-moveToBottom pt-page-ontop';
                        inClass = 'pt-page-scaleUp';
                        break;
                    case 27:
                        outClass = 'pt-page-scaleDownCenter';
                        inClass = 'pt-page-scaleUpCenter pt-page-delay400';
                        break;
                    case 28:
                        outClass = 'pt-page-rotateRightSideFirst';
                        inClass = 'pt-page-moveFromRight pt-page-delay200 pt-page-ontop';
                        break;
                    case 29:
                        outClass = 'pt-page-rotateLeftSideFirst';
                        inClass = 'pt-page-moveFromLeft pt-page-delay200 pt-page-ontop';
                        break;
                    case 30:
                        outClass = 'pt-page-rotateTopSideFirst';
                        inClass = 'pt-page-moveFromTop pt-page-delay200 pt-page-ontop';
                        break;
                    case 31:
                        outClass = 'pt-page-rotateBottomSideFirst';
                        inClass = 'pt-page-moveFromBottom pt-page-delay200 pt-page-ontop';
                        break;
                    case 32:
                        outClass = 'pt-page-flipOutRight';
                        inClass = 'pt-page-flipInLeft pt-page-delay500';
                        break;
                    case 33:
                        outClass = 'pt-page-flipOutLeft';
                        inClass = 'pt-page-flipInRight pt-page-delay500';
                        break;
                    case 34:
                        outClass = 'pt-page-flipOutTop';
                        inClass = 'pt-page-flipInBottom pt-page-delay500';
                        break;
                    case 35:
                        outClass = 'pt-page-flipOutBottom';
                        inClass = 'pt-page-flipInTop pt-page-delay500';
                        break;
                    case 36:
                        outClass = 'pt-page-rotateFall pt-page-ontop';
                        inClass = 'pt-page-scaleUp';
                        break;
                    case 37:
                        outClass = 'pt-page-rotateOutNewspaper';
                        inClass = 'pt-page-rotateInNewspaper pt-page-delay500';
                        break;
                    case 38:
                        outClass = 'pt-page-rotatePushLeft';
                        inClass = 'pt-page-moveFromRight';
                        break;
                    case 39:
                        outClass = 'pt-page-rotatePushRight';
                        inClass = 'pt-page-moveFromLeft';
                        break;
                    case 40:
                        outClass = 'pt-page-rotatePushTop';
                        inClass = 'pt-page-moveFromBottom';
                        break;
                    case 41:
                        outClass = 'pt-page-rotatePushBottom';
                        inClass = 'pt-page-moveFromTop';
                        break;
                    case 42:
                        outClass = 'pt-page-rotatePushLeft';
                        inClass = 'pt-page-rotatePullRight pt-page-delay180';
                        break;
                    case 43:
                        outClass = 'pt-page-rotatePushRight';
                        inClass = 'pt-page-rotatePullLeft pt-page-delay180';
                        break;
                    case 44:
                        outClass = 'pt-page-rotatePushTop';
                        inClass = 'pt-page-rotatePullBottom pt-page-delay180';
                        break;
                    case 45:
                        outClass = 'pt-page-rotatePushBottom';
                        inClass = 'pt-page-rotatePullTop pt-page-delay180';
                        break;
                    case 46:
                        outClass = 'pt-page-rotateFoldLeft';
                        inClass = 'pt-page-moveFromRightFade';
                        break;
                    case 47:
                        outClass = 'pt-page-rotateFoldRight';
                        inClass = 'pt-page-moveFromLeftFade';
                        break;
                    case 48:
                        outClass = 'pt-page-rotateFoldTop';
                        inClass = 'pt-page-moveFromBottomFade';
                        break;
                    case 49:
                        outClass = 'pt-page-rotateFoldBottom';
                        inClass = 'pt-page-moveFromTopFade';
                        break;
                    case 50:
                        outClass = 'pt-page-moveToRightFade';
                        inClass = 'pt-page-rotateUnfoldLeft';
                        break;
                    case 51:
                        outClass = 'pt-page-moveToLeftFade';
                        inClass = 'pt-page-rotateUnfoldRight';
                        break;
                    case 52:
                        outClass = 'pt-page-moveToBottomFade';
                        inClass = 'pt-page-rotateUnfoldTop';
                        break;
                    case 53:
                        outClass = 'pt-page-moveToTopFade';
                        inClass = 'pt-page-rotateUnfoldBottom';
                        break;
                    case 54:
                        outClass = 'pt-page-rotateRoomLeftOut pt-page-ontop';
                        inClass = 'pt-page-rotateRoomLeftIn';
                        break;
                    case 55:
                        outClass = 'pt-page-rotateRoomRightOut pt-page-ontop';
                        inClass = 'pt-page-rotateRoomRightIn';
                        break;
                    case 56:
                        outClass = 'pt-page-rotateRoomTopOut pt-page-ontop';
                        inClass = 'pt-page-rotateRoomTopIn';
                        break;
                    case 57:
                        outClass = 'pt-page-rotateRoomBottomOut pt-page-ontop';
                        inClass = 'pt-page-rotateRoomBottomIn';
                        break;
                    case 58:
                        outClass = 'pt-page-rotateCubeLeftOut pt-page-ontop';
                        inClass = 'pt-page-rotateCubeLeftIn';
                        break;
                    case 59:
                        outClass = 'pt-page-rotateCubeRightOut pt-page-ontop';
                        inClass = 'pt-page-rotateCubeRightIn';
                        break;
                    case 60:
                        outClass = 'pt-page-rotateCubeTopOut pt-page-ontop';
                        inClass = 'pt-page-rotateCubeTopIn';
                        break;
                    case 61:
                        outClass = 'pt-page-rotateCubeBottomOut pt-page-ontop';
                        inClass = 'pt-page-rotateCubeBottomIn';
                        break;
                    case 62:
                        outClass = 'pt-page-rotateCarouselLeftOut pt-page-ontop';
                        inClass = 'pt-page-rotateCarouselLeftIn';
                        break;
                    case 63:
                        outClass = 'pt-page-rotateCarouselRightOut pt-page-ontop';
                        inClass = 'pt-page-rotateCarouselRightIn';
                        break;
                    case 64:
                        outClass = 'pt-page-rotateCarouselTopOut pt-page-ontop';
                        inClass = 'pt-page-rotateCarouselTopIn';
                        break;
                    case 65:
                        outClass = 'pt-page-rotateCarouselBottomOut pt-page-ontop';
                        inClass = 'pt-page-rotateCarouselBottomIn';
                        break;
                    case 66:
                        outClass = 'pt-page-rotateSidesOut';
                        inClass = 'pt-page-rotateSidesIn pt-page-delay200';
                        break;
                    case 67:
                        outClass = 'pt-page-rotateSlideOut';
                        inClass = 'pt-page-rotateSlideIn';
                        break;

                }


                $currPage.addClass(outClass).one(animEndEventName, function () {

                    endCurrPage = true;
                    if (endNextPage) {
                        onEndAnimation($currPage, $nextPage, callback);
                    }
                });

                $nextPage.addClass(inClass).one(animEndEventName, function () {

                    endNextPage = true;
                    if (endCurrPage) {
                        onEndAnimation($currPage, $nextPage, callback);
                    }
                });

                if (!support) {
                    onEndAnimation($currPage, $nextPage, callback);
                }




            }

            function onEndAnimation($outpage, $inpage, callback) {
                endCurrPage = false;
                endNextPage = false;
                resetPage($outpage, $inpage);
                isAnimating = false;
                if (callback) callback();
            }

            function resetPage($outpage, $inpage) {


                $outpage.attr('class', $outpage.data('originalClassList'));
                $inpage.attr('class', $inpage.data('originalClassList') + ' pt-page-current');

                $outpage.remove();
                $inpage.removeClass("pt-page-2");
                $inpage.addClass("pt-page-1");

            }

            function setPage(htmlContent, callback) {
                var $newpage = $("<div class='pt-page pt-page-1 pt-page-current'></div>");
                $newpage.append(htmlContent);

                container.append($newpage);


                if (callback) callback();
            }

            /* Fonctions publiques */


            function slidePage($targetPage, animation, callback) {
                                
                //Si il n'y a pas de page courante
                if ($(".pt-page", container).length == 0) {

                    setPage($targetPage, callback);
                }
                else {
                    var $newpage = $("<div class='pt-page pt-page-2'></div>");
                    $newpage.append($targetPage);
                    container.append($newpage)



                    nextPage(animation, callback);
                }


            }

            /*Retour de l'objet*/
            return { slidePage: slidePage, animEndEventName: animEndEventName };

        })();


        var anim = 1;
        if (anim == "left") {
            anim = self.app.params.outAnimation;
        }
        else {
            anim = self.app.params.inAnimation;
        }


        PageTransitions.slidePage(page, anim, callback);
    }


    //#endregion

}