//Router basé sur le hashchange
var ONC_Router = function (app) {
    var self = this


    self.app = app;

    //Initialisation des variables
    self.currentPage = null;
    self.slider = new ONC_PageSlider();
    self.sliderSelector = "body";
    self.initialized = null;
    self.pagecontainer = new ONC_PageContainer();


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
        if (window.location.hash == "") {
            //Navigation sur la page initiale 
            self.navigate(app.params.startpage);
        }
        else {
            //Chargement de la vue citée dans l'url
            self.route()
        }

    }


    //Au changement de hash operé sur le navigateur
    self.route = function (event, callback) {
        var page,
            hash = window.location.hash,
            param;

        if (hash == "") {
            //Pas de hash ? on ne fait rien
            return;
        }


        var markupPage = hash.substr(1, hash.length) + self.app.params.markupPageExtension;
        var classfilePage = hash.substr(1, hash.length) + self.app.params.classfilePageExtension;



        //Avec parametres ?
        if (hash.indexOf("/") != -1) {
            //Extration des données
            param = hash.substr(hash.indexOf("/") + 1, hash.length);
            hash = hash.substr(0, hash.indexOf("/"));
        }
        else {
            //Non, sans parametres
            param = null;
        }

        //Récuperation du markup
        $.ajax(markupPage)
            .done(function (result) {


                if (result != null) {
                    page = result;
                }
                else {
                    //On ne trouve pas le contenut
                    throw "La page " + hash + " est introuvable ou n'est pas correctement incorporée";
                }



                //Dechargement de la page courante
                self.unloadCurrent(function () {

                    var $target = $(page);

                    //On recherche l'id de page sur le makup
                    pageId = $target.attr("id");
                    if (pageId != null)
                    {
                        $.ajax(classfilePage)
                          .done(function (result) {
                              eval(result);
                           
                              //On tente d'initialiser la nouvelle page
                              if (eval("typeof " + pageId + "_PageClass === 'undefined'") == false) {
                                  var pageInstance = eval("new " + pageId + "_PageClass()");

                                  self.currentPage = pageInstance;

                                  //Chargement de la page
                                  if (pageInstance != null && pageInstance.load != null) {
                                      pageInstance.load(param);
                                  }
                              }
                          }).fail(function (xhr, e) {
                              self.app.onerror(e);
                          }).always(function () {
                              //On Construit la pages 
                              self.pagecontainer.build();


                              //Affichage du contenu cible une fois construit
                              self.pagecontainer.showContent(function () {
                                  if (callback) callback();
                              });
                          });
                    }


                 
                    //On slide vers cette nouvelle page
                    self.slider.slidePage($target);

                });


            }).fail(function (xhr, e) {
                self.app.onerror(e);
            });

    }

    self.unloadCurrent = function (callback) {


        //Si il y a déja une page en cours et qu'elle possede un destructeur => On la détruit
        if (self.currentPage != null && self.currentPage.unload != null)
            self.currentPage.unload();

        //On decharge la page courante 
        self.pagecontainer.destroy();

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



    //Va sur la page précédente du navigateur 
    self.goBack = function () {
        window.history.back();
    };

};

