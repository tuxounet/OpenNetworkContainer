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
    self.currentModal = null;
    self.currentModalDOM = null;
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
        var markupPage = hash.substr(1, hash.length) + self.app.params.markupPageExtension;
        var classfilePage = hash.substr(1, hash.length) + self.app.params.classfilePageExtension;
        var cssFilePage = hash.substr(1, hash.length) + self.app.params.cssfilePageExtension;



        //Fermetrue de la modale active si présente
        if (self.hasModal())
            self.hideModal();


        self.app.loading("Chargement de la page " + hash);


        //Récuperation du markup

        self.includeHtmlFile(markupPage,
            function (result) {

                var page = result;


                //inclusion du fichier CSS

                self.includeCSSFile(cssFilePage, function (result) {

                    //Dechargement de la page courante
                    self.unloadCurrent(self.currentPageDOM, function () {

                        var $target = $(page);

                        //Mise en mode "chargement de la page" 
                        $("div[data-role=content]", $target).removeClass("onc-loaded");
                        $("div[data-role=content]", $target).addClass("onc-loading");

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
            },
            function () {
                self.app.complete("Chargement de la page " + hash);
                //Retour arrière
                self.goBack();
                if (callback) callback("KO");
            })


    }

    self.unloadCurrent = function (dom, callback) {

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

    /*  Ajout du voile si besoin au viewport */
    self.showModalBackground = function () {


        if ($(".onc-modal-background", self.app.viewport.$viewport).length == 0) {
            var voile = "<div class='onc-modal-background'></div>";
            self.app.viewport.$viewport.append(voile);
        }
    }

    /*Suppression du voile */
    self.hideModalBackground = function () {

        if ($(".onc-modal-background", self.app.viewport.$viewport).length == 1) {
            $(".onc-modal-background", self.app.viewport.$viewport).remove();
        }

    }

    /* Indique si une modale est présente */
    self.hasModal = function () {
        if ($(".onc-modal", self.app.viewport.$viewport).length > 0)
            return true;
        else
            return false;

    }


    /* Affiche une page modale */
    self.showModal = function (link, callback, closeCallback) {
        //Si une modale est déja affichée, on la masque 
        if (self.hasModal() == true) {
            self.hideModal();
        }


        //Definition des elements a charger
        var markupPage = link.substr(1, link.length) + self.app.params.markupPageExtension;
        var classfilePage = link.substr(1, link.length) + self.app.params.classfilePageExtension;
        var cssFilePage = link.substr(1, link.length) + self.app.params.cssfilePageExtension;


        self.app.loading("Chargement de la modale " + link);

        var modal = null;

        self.includeHtmlFile(markupPage,
            function (result) {

                var $target = $(result);
                //Vérifications
                if ($target.hasClass("onc-modal") == false) {
                    ONC_Logger.error("ROUTER: La modale n'est pas compatible");

                    //Retour
                    self.app.complete("Chargement de la modale " + link);
                    if (callback) callback("KO");
                    return; 
                }

                //inclusion du fichier CSS

                self.includeCSSFile(cssFilePage, function (result) {

                    //On recherche l'id de page sur le makup
                    modalId = $target.attr("id");
                    if (modalId != null) {


                        self.includeJSFile(classfilePage, function () {



                            ONC_Logger.log("ROUTER: Affichage de la modale  (" + modalId + ")");

                            self.app.complete("Chargement de la modale " + link);
                            self.showModalBackground();

                            //Affichage de la modale
                            self.app.viewport.$viewport.append($target);
                            self.currentModalDOM = $target;


                            //On tente d'initialiser la nouvelle page
                            if (eval("typeof " + modalId + "_ModalClass == 'undefined'") == false) {
                                self.currentModal = modalInstance = eval("new " + modalId + "_ModalClass()");


                                ONC_Logger.log("ROUTER: Modale Instanciée (" + modalId + ")");


                                //Binding de la page
                                if (self.currentModal != null && self.currentModal.bind != null) {
                                    self.currentModal.bind($target[0], self.app, modalId, closeCallback);
                                }

                                //Chargement de la page
                                if (self.currentModal != null && self.currentModal.load != null) {
                                    self.currentModal.load();
                                }
                            }
                            else {
                                ONC_Logger.warn("ROUTER: Définition du classfile introuvable (" + modalId + ")");
                            }

                            //Retour
                            self.app.complete("Chargement de la modale " + link);
                            if (callback) callback("OK", self.currentModal);

                        }, function () {

                            //On affiche malgré tout         

                            self.app.complete("Chargement de la modale " + link);
                            self.showModalBackground();

                            //Affichage de la modale
                            self.app.viewport.$viewport.append($target);
                            self.currentModalDOM = $target;

                            //Retour
                            self.app.complete("Chargement de la modale " + link);
                            if (callback) callback("KO", null);

                        });
                    }
                    else {
                        ONC_Logger.log("ROUTER: Modale sans classfile " + link);

                        //Binding de la  sur un viewmodel vide
                        self.currentModalDOM = $target;
                        self.app.viewport.$viewport.append($target);

                        self.currentModal = new ONC_Modal();

                        if (self.currentModal != null && self.currentModal.bind != null) {
                            self.currentModal.bind($target[0], self.app, modalId, closeCallback);
                        }

                        //Chargement de la page
                        if (self.currentModal != null && self.currentModal.load != null) {
                            self.currentModal.load();
                        }

                        //Retour
                        self.app.complete("Chargement de la modale " + link);
                        self.showModalBackground();
                        if (callback) callback("OK", self.currentModal);
                    }
                })

            },
            function () {
                self.app.complete("Chargement de la modale " + link);
                if (callback) callback("KO");
            });
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
            if (self.currentModal != null) {
                //Debinding
                if (self.currentModal.unbind != null) {
                    self.currentModal.unbind();
                    self.currentModal = null;
                }
            }

            //Suppression
            $(modal).remove();
            self.currentModalDOM = null;

            //Masquage du voile
            self.hideModalBackground();

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

    /* Inclusion d'un fichier HTML */
    self.includeHtmlFile = function (url, win, fail) {
        //On vérifie que l'inclusion n'est pas déja faite
        var $data = $("body script[data-url='" + url + "']");
        if ($data.length == 0) {
            //L'inclusion n'est pas faite

            //Récuperation du markup
            $.ajax({
                url: url,
                cache: false
            }).done(function (result) {
                //Controle de surface
                if (result == null) {
                    ONC_Logger.error("La page " + hash + " est introuvable");
                    if (fail) fail();
                }

                //Incorporation de la balise a la page 
                var $markup = $("<script></script>")
                $markup.attr("data-url", url);
                $markup.attr("type", "text/template");
                $markup.html(result);

                //Ajout au DOM
                $("body").append($markup);

                //Retout
                if (win) win($markup.html())


            }).fail(function (e, xhr) {
                self.app.onerror(e);
                //Erreur de chargement du script
                ONC_Logger.error("ROUTER: Erreur lors du chargement du fichier html " + url);
                if (fail) fail();
            })


        } else {
            //L'inclusion est déja faite
            ONC_Logger.log("ROUTER: Fragment  déjà inclus " + url);
            if (win) win($data.html());
        }


    }


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

