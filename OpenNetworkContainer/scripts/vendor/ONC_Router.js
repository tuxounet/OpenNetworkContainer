//Router basé sur le hashchange
var ONC_Router = function (sliderSelector) {
    var self =  this


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


    //Au changement de hash operé sur le navigateur
    self.route = function (event, callback) {
        var page,
            hash = window.location.hash,
            param;

        if (hash == "") {
            //Pas de hash ? on ne fait rien
            return;
        }

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

        //reccherche par id, pages statiques 
        var content = $(hash + "_page").html();
        if (content != null) {
            page = content;
        }
        else {
            //On ne trouve pas le contenut
            throw "La page " + hash + " est introuvable ou n'est pas correctement incorporée";
        }


        //Dechargement de la page courante
        kernel.router.unloadCurrent(function () {

            var $target = $(page);

            //On slide vers cette nouvelle page
            kernel.router.slider.slidePage($target, function () {
                //On tente d'initialiser la nouvelle page
                if (eval("typeof " + hash.substring(1, hash.length) + "_PageClass === 'undefined'") == false) {
                    var pageInstance = eval("new " + hash.substring(1, hash.length) + "_PageClass()");

                    kernel.router.currentPage = pageInstance;

                    //Chargement de la page
                    if (pageInstance != null && pageInstance.load != null) {
                        pageInstance.load(param);
                    }
                }

                //On Construit la pages 
                kernel.router.pagecontainer.build();


                //Affichage du contenu cible une fois construit
                kernel.router.pagecontainer.showContent(function () {
                    if (callback) callback();
                });


            });
        });
    };


    self.unloadCurrent = function (callback) {

        //Si il y a déja une page en cours et qu'elle possede un destructeur => On la détruit
        if (kernel.router.currentPage != null && kernel.router.currentPage.unload != null)
            kernel.router.currentPage.unload();

        //On decharge la page courante 
        kernel.router.pagecontainer.destroy();

        //On reinitialise la notion de "page courante"
        kernel.router.currentPage = null;

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

