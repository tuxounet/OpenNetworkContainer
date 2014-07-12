var ONC_Viewport = function () {
    var self = this;





    //Mise en place des variables de base
    self.selector = "body";
    self.$viewport = $(document.body);


    self.initialize = function (selector) {
        self.selector = selector;
        self.$viewport = $(selector);



    }


    //Vérification de la présence du viewport
    if (self.$viewport.length == 0) {
        self.$viewport = null;
        throw "VIEWPORT : Viewport " + selector + " introuvable";
    }



    //Obtient la largeur du viewport
    self.getWidth = function () {
        if (self.$viewport == null) return -1;

        return self.$viewport.width();
    };

    //Obtient la hauteur du viewport 
    self.getHeight = function () {
        if (self.$viewport == null) return -1;

        return self.$viewport.height();
    };

    //Destructeur du viewport 
    self.destroy = function () {

    };
}