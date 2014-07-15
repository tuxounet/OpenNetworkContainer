function ONC_Page() {
    var self = this;

    self.DOM = null;



    /* Bind la page courante en tant que viewmodel */
    self.bind = function (domObject) {

        //Branchement du ViewModel
        self.DOM = domObject;
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

        ONC_Logger.log("ONC: Chargement Page terminé");
    }


}