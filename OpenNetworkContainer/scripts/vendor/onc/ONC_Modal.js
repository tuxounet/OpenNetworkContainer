function ONC_Modal() {


    var self = this;

    self.DOM = null;

    self.app = null;
    self.modalId = null;
    self.closeCallback = null;


    /* Bind la modal courante en tant que viewmodel */
    self.bind = function (domObject, app, modalId, closeCallBack) {

        //Branchement du ViewModel
        self.DOM = domObject;
        //Association de l'app courante
        self.app = app;

        //Id de Modale
        self.modalId = modalId;

        //Callback de fermeture 
        self.closeCallback = closeCallBack;

        //On ne force pas ko 
        if (self.DOM && ko)
            ko.applyBindings(self, self.DOM);

        //Activation du fallback de scroller

        if (overthrow.isApplicable == true) {
            //Overthrow applicable, ajout de la classe necessaire
            var rootElement = null;
            if ($(".onc-modal-content", self.DOM).length > 0) {
                $(".onc-modal-content", self.DOM).addClass("overthrow");
                rootElement = $(".onc-modal-content", self.DOM)[0];
            }
            else {
                $(self.DOM).addClass("overthrow");
                rootElement = $(self.DOM)[0];
            }

            if ($(rootElement).hasClass("no-onc-overthrow") == false)
            {
                //Activations 
                overthrow.set();
            }
            
        }

    }



    /* De-Binde la modal courante en tant que viewmodel */
    self.unbind = function () {

        //Si overthrow applicable
        if (overthrow.isApplicable == true) {

            //Suppression de la classe
            var rootElement = null; 
            if ($(".onc-modal-content", self.DOM).length > 0) {
                $(".onc-modal-content", self.DOM).removeClass("overthrow");
                rootElement = $(".onc-modal-content", self.DOM)[0];
            }
            else {
                $(self.DOM).removeClass("overthrow");
                rootElement = $(self.DOM)[0];
            }


            if ($(rootElement).hasClass("no-onc-overthrow") == false) {
                //Désactivation
                //     overthrow.forget(rootElement);
            }

           
        }

        if (self.DOM)
            ko.cleanNode(self.DOM);
    }


    /*Ferme la modale*/
    self.close = function () {

        //Si un callback de fermetrue est défini, on l'appelle
        if (self.closeCallback) {
            //Appel avec renvoi du viewmodel courant
            self.closeCallback(self);
        }

        //Fermeture
        self.app.router.hideModal();
    }

}