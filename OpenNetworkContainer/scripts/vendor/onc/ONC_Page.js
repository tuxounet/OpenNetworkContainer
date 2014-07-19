function ONC_Page() {
    var self = this;

    self.DOM = null;

    self.app = null;

    /* Bind la page courante en tant que viewmodel */
    self.bind = function (domObject, app) {

        //Branchement du ViewModel
        self.DOM = domObject;
        //Association de l'app courante
        self.app = app;
        //On ne force pas ko 
        if (self.DOM && ko)
            ko.applyBindings(self, self.DOM);


    }



    /* De-Binde la page courante en tant que viewmodel */
    self.unbind = function () {
        if (self.DOM)
            ko.cleanNode(self.DOM);
    }

    self.load = function () {
        ONC_Logger.log("ONC: Page chargée");

    }

    self.unload = function () {

        ONC_Logger.log("ONC: Page déchargée");
    }

    self.loadCompleted = function () {

        //Masque le spinner
        if (self.app)
            self.app.complete();
        ONC_Logger.log("ONC: Chargement Page terminé");

    }


}