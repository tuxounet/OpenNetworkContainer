function ONC_Page() {
    var self = this;

    self.DOM = null;
    self.pageId = null;

    self.app = null;



    /* Bind la page courante en tant que viewmodel */
    self.bind = function (domObject, app, pageId) {

        //Branchement du ViewModel
        self.DOM = domObject;
        //Association de l'app courante
        self.app = app;
        //Id de la page 
        self.pageId = pageId;

        //On ne force pas ko 
        if (self.DOM && ko)
            ko.applyBindings(self, self.DOM);


        //Application de l'overthrow si applicable 
        if (overthrow.isApplicable == true) {
            //Overthrow applicable, ajout de la classe necessaire
            $("div[data-role=content]", self.DOM).addClass("overthrow");

            //Activations 
            overthrow.set();
        }
    }



    /* De-Binde la page courante en tant que viewmodel */
    self.unbind = function () {

        //Si overthrow applicable
        if (overthrow.isApplicable == true) {

            //Suppression de la classe
            $("div[data-role=content]", self.DOM).removeClass("overthrow");

            //Desactivation
            overthrow.forget();

        }


        if (self.DOM)
            ko.cleanNode(self.DOM);
    }

    self.load = function () {

        ONC_Logger.log("ONC: Page chargée (" + self.pageId + ")");
        self.loadCompleted();
    }

    self.unload = function () {

        ONC_Logger.log("ONC: Page déchargée (" + self.pageId + ")");
    }

    self.loadCompleted = function () {

        //Masque le spinner
        if (self.app)
            self.app.complete();

        //Affichage du contenu
        $("div[data-role=content]", self.DOM).addClass("onc-loaded");
        $("div[data-role=content]", self.DOM).removeClass("onc-loading");


        ONC_Logger.log("ONC: Chargement Page terminé (" + self.pageId + ")");
    }


    /* Bouton retour*/
    self.goBack = function () {
        self.app.router.goBack();
        event.preventDefault();
        return false;

    }


}