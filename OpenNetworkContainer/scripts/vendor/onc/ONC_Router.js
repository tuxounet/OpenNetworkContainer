/// <reference path="dependencies/overthrow.js" />
/// <reference path="dependencies/yesnope.js" />
/// <reference path="ONC.js" />
//Router basé sur le hashchange
var ONC_Router = function (app) {
    var self = this


    self.app = app;

    //Initialisation des variables
    self.currentPage = null;
    self.currentPageDOM = null; 
    self.slider = new ONC_PageSlider(app);
    self.sliderSelector = "body";
    self.initialized = null;



    //Intialize le router
    self.initialize = function (sliderSelector) {
        //Si le router est déja initialisée 
        if (self.initialized) return;

        self.sliderSelector = sliderSelector;

        //Initialisation des sous-composantes
        self.slider.initialize($(self.sliderSelector));


        //Branchement sur l'evement de changement de hash du navigateur
        $(window).on('hashchange', self.route);

        self.initialized = true;

    };

    //Arrete le router
    self.destroy = function () {
        //Si le router n'est pas initialisé, sortie
        if (!self.initialized) return;

        //DéBranchement sur l'evement de changement de hash du navigateur
        $(window).off('hashchange', self.route);

        //Vidage des variables
        self.slider = null;
        self.currentPage = null;
    };


    /* Navige a l'url courant si definie, sinon accès a la page de démarrage nommée */
    self.restore = function () {
        //Si une page de démarrage est définie, on passe en mode Pages avec pushstate
        if (self.app.params.autoRestore == true) {
            if (window.location.hash == "") {
                //Navigation sur la page initiale 
                self.navigate(self.app.params.startpage);
            }
            else {
                //Chargement de la vue citée dans l'url
                self.route()
            }

        }
        else {
            //On laisse faire le callback de démarrage
        }


    }


    //Au changement de hash operé sur le navigateur
    self.route = function (event, callback) {
        var page,
            hash = window.location.hash,
            param, markupPage, classfilePage;

        if (hash == "") {
            //Pas de hash ? on ne fait rien
            return;
        }



        //Avec parametres ?
        if (window.url("?", hash) == "") {
            param = null;

        }
        else {

            var url = window.url("?", hash);
            var pairs = url.split("&");
            var data = {};

            for (var i = 0; i < pairs.length; i++) {
                pair = pairs[i];
                separatorIndex = pair.indexOf("=");

                if (separatorIndex === -1) {
                    escapedKey = pair;
                    escapedValue = null;
                } else {
                    escapedKey = pair.substr(0, separatorIndex);
                    escapedValue = pair.substr(separatorIndex + 1);
                }

                key = decodeURIComponent(escapedKey);
                value = decodeURIComponent(escapedValue);

                data[key] = value;
            }

            var pageName = hash.substring(0, hash.indexOf("?"));
            hash = pageName;
            param = data
        }

        //Definition des elements a charger
        markupPage = hash.substr(1, hash.length) + self.app.params.markupPageExtension;
        classfilePage = hash.substr(1, hash.length) + self.app.params.classfilePageExtension;
        cssFilePage = hash.substr(1, hash.length) + self.app.params.cssfilePageExtension;

        self.app.loading("Chargement de la page " + hash);




        //Récuperation du markup
        $.ajax({
            url: markupPage,
            cache: false
        }).done(function (result) {


            if (result != null) {
                page = result;
            }
            else {
                //On ne trouve pas le contenut
                throw "La page " + hash + " est introuvable ou n'est pas correctement incorporée";
            }


            //inclusion du fichier CSS

            self.includeCSSFile(cssFilePage, function (result) {



                
                //Dechargement de la page courante
                self.unloadCurrent(self.currentPageDOM, function () {

                    var $target = $(page);

                    //On recherche l'id de page sur le makup
                    pageId = $target.attr("id");
                    if (pageId != null) {


                        self.includeJSFile(classfilePage, function () {

                            ONC_Logger.log("ROUTER: Démarrage du sliding (" + pageId + ")");

                            //On slide vers cette nouvelle page
                            self.slider.slidePage($target, function () {

                                ONC_Logger.log("ROUTER: Page slidée (" + pageId + ")");

                                //Assignation du nouveau "dom de la page courante"
                                self.currentPageDOM = $target[0];
                                
                                //On tente d'initialiser la nouvelle page
                                if (eval("typeof " + pageId + "_PageClass == 'undefined'") == false) {
                                    var pageInstance = eval("new " + pageId + "_PageClass()");

                                    self.currentPage = pageInstance;

                                    ONC_Logger.log("ROUTER: Page Instanciée (" + pageId + ")");


                                    //Binding de la page
                                    if (pageInstance != null && pageInstance.bind != null) {
                                        pageInstance.bind($target[0], self.app, pageId);
                                    }

                                    //Chargement de la page
                                    if (pageInstance != null && pageInstance.load != null) {
                                        pageInstance.load(param);
                                    }
                                }
                                else {
                                    ONC_Logger.warn("ROUTER: Définition du classfile introuvable (" + pageId + ")");
                                }

                                //Activation de l'overthrow
                                if (self.app.params.useOverthrow == true)
                                {
                                    overthrow.onc_setOnDOM($target[0]);
                                }


                                if (callback) callback("OK");

                            });

                        }, function () {

                            //On slide malgré tout
                            self.slider.slidePage($target);

                            if (callback) callback("KO");

                        });
                    }
                    else {
                        ONC_Logger.log("ROUTER: Slide sans classfile " + hash);
                        //On slide vers cette nouvelle page
                        self.slider.slidePage($target);
                        //Masque le spinner
                        self.app.complete();

                        if (callback) callback("OK");
                    }
                });


            })




        }).fail(function (xhr, e) {
            self.app.onerror(e);
            if (callback) callback("KO");
        });

    }

    self.unloadCurrent = function (dom, callback) {

        //Désactivation de l'overthrow
        if (self.app.params.useOverthrow == true) {
            overthrow.onc_destroyOnDOM(dom);
        }



        //Si il y a déja une page en cours et qu'elle possede un destructeur => On la détruit
        if (self.currentPage != null && self.currentPage.unload != null)
            self.currentPage.unload();

        //Débind
        if (self.currentPage != null && self.currentPage.unbind != null)
            self.currentPage.unbind();

        //On reinitialise la notion de "page courante"
        self.currentPage = null;

        if (callback) callback();

    };



    //Navigue sur le hash demandé
    self.navigate = function (hash, force, callback) {

        if (window.location.hash != hash) {
            window.location.hash = hash;

            if (callback) callback();
        }
        else {
            if (self.currentPage == null) {
                force = true;
            }

        }
        if (force) {
            if (self.currentPage == null) {
                self.route(null, function () {
                    if (callback) callback();
                });
            }
        }
    };


    /* Indique si une modale est présente */
    self.hasModal = function () {        
        if ($(".onc-modal", self.app.viewport.$viewport).length > 0)
            return true;
        else
            return false;

    }


    /* Affiche un bloc modal */
    self.showModal = function (html, viewmodel, callback) {


        var $modal = $(html);
        if ($modal.hasClass("onc-modal") == false) {
            throw "ROUTER: La modale n'est pas compatible";
        }

        //Ajout du voile si besoin au viewport
        if ($(".onc-modal-background", self.app.viewport.$viewport).length == 0) {
            var voile = "<div class='onc-modal-background'></div>";
            self.app.viewport.$viewport.append(voile);
        }

        //Affichage de la modale
        self.app.viewport.$viewport.append($modal);


        //Binding du viewmodel 
        if (viewmodel != null && viewmodel.bind != null) viewmodel.bind($modal[0], self.app);




    }

    /* Masque un block Modal */
    self.hideModal = function () {

        if (self.hasModal() == false) {
            //Pas de modal en cours, sortie; 
            return;
        }
        //Suppression de la modale 
        if ($(".onc-modal", self.app.viewport.$viewport).length == 1) {

            //Extraction du VM si existant 
            var modal = $(".onc-modal", self.app.viewport.$viewport)[0];
            var vm = ko.dataFor(modal);

            //Debinding
            if (vm != null && vm.unbind != null) vm.unbind();

            //Suppression
            $(modal).remove();

            //Suppression du voile
            if ($(".onc-modal-background", self.app.viewport.$viewport).length == 1) {
                $(".onc-modal-background", self.app.viewport.$viewport).remove();
            }
        }




    }


    //Va sur la page précédente du navigateur 
    self.goBack = function () {
        if (self.hasModal()) {
            //Si il y a une modale, on la close 
            self.hideModal();

        }
        else {
            //Retour conventionnel 
            window.history.back();
        }

        return false;
    };



    /* Méthodes d'inclusion dynamique */
    self.includeJSFile = function (url, win, fail) {

        //On vérifie que l'inclusion n'est pas déja faite 

        if ($("head script[src='" + url + "']").length == 0) {
            //L'inclusion n'est pas faite

            //Creation de la balise 
            var tag = document.createElement("script");
            tag.type = 'text/javascript';
            tag.async = true;
            tag.onload = function () {
                //Script inclu et chargé
                ONC_Logger.log("ROUTER: Script inclu et chargé " + url);
                if (win) win();
            };
            tag.onerror = function (e) {
                //Erreur de chargement du script
                ONC_Logger.error("ROUTER: Erreur lors du chargement du script " + url);
                if (fail) fail();

            };
            tag.src = url;
            //Ajout de la balise a la page
            document.getElementsByTagName('head')[0].appendChild(tag);
        }
        else {

            //L'inclusion est déja faite
            ONC_Logger.log("ROUTER: Script déjà inclus " + url);
            if (win) win();
        }
    }


    self.includeCSSFile = function (url, result) {

        if ($("head style[data-url='" + url + "']").length == 0) {
            //Chargement du style
            $.ajax({
                url: url,
                cache: false
            }).done(function (datas) {

                //Style récupéré, inclusion dans le head 

                var tag = $("<style></style>");
                tag.attr("data-url", url);
                tag.html(datas);
                $("head").append(tag);

                ONC_Logger.log("ROUTER: Fichier de style inclu " + url);
                //Callback
                if (result) result(true);

            }).fail(function (e, xhr) {
                //Erreur de chargement du script
                ONC_Logger.error("ROUTER: Erreur lors du chargement du fichier de style " + url);
                if (result) result(false);
            })
        }
        else {
            //L'inclusion est déja faite
            ONC_Logger.log("ROUTER: Style déjà inclus " + url);
            if (result) result(true);

        }




    }



};

