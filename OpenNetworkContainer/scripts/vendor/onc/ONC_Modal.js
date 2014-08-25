function ONC_Modal() {


    var self = this;

    self.DOM = null;

    self.app = null;
    self.modalId = null;
    self.closeCallback = null;

    var scrollerFallback = null;

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
        if ($(".onc-modal-content", self.DOM).length > 0) {
            scrollerFallback = new OverflowScrollFallback($(".onc-modal-content", self.DOM)[0]).setOnDOM();
        }
        else {
            scrollerFallback = new OverflowScrollFallback($(self.DOM)[0]).setOnDOM();
        }
    }



    /* De-Binde la modal courante en tant que viewmodel */
    self.unbind = function () {
        if (self.DOM)
            ko.cleanNode(self.DOM);


        if (scrollerFallback)
            scrollerFallback.destroy();
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