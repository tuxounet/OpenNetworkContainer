function ONC_Modal() {


    var self = this;

    self.DOM = null;
    
    self.app = null;

    /* Bind la modal courante en tant que viewmodel */
    self.bind = function (domObject, app) {

        //Branchement du ViewModel
        self.DOM = domObject;
        //Association de l'app courante
        self.app = app;
        
        //On ne force pas ko 
        if (self.DOM && ko)
            ko.applyBindings(self, self.DOM);


    }



    /* De-Binde la modal courante en tant que viewmodel */
    self.unbind = function () {
        if (self.DOM)
            ko.cleanNode(self.DOM);
    }


    /*Ferme la modale*/
    self.close = function () {
        self.app.router.hideModal();
    }

}