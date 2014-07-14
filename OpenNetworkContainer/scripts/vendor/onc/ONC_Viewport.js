var ONC_Viewport = function (app) {
    var self = this;

    self.app = app;



    //Mise en place des variables de base
    self.selector = "body";
    self.$viewport = $(document.body);


    self.initialize = function (selector) {
        self.selector = selector;
        self.$viewport = $(selector);
        

        //Vérification de la présence du viewport
        if (self.$viewport.length == 0) {
            self.$viewport = null;
            throw "VIEWPORT : Viewport " + selector + " introuvable";
        }

        //Appilcation de la taille du viewport
        self.onViewportResized(); 

    }

    //Destructeur du viewport 
    self.destroy = function () {

    };



    /*Obtient la largeur de l'écran */
    self.getScreenWidth = function () {

        var w = window, d = document, e = d.documentElement, g = d.getElementsByTagName('body')[0], x = w.innerWidth || e.clientWidth || g.clientWidth;

        return x;
    };


    /* Obtient la hauteur de l'écran */
    self.getScreenHeight = function () {
        var w = window, d = document, e = d.documentElement, g = d.getElementsByTagName('body')[0], y = w.innerHeight || e.clientHeight || g.clientHeight;
        return y;
    };

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


    self.onViewportResized = function () {
      
        //$("body").height(self.getScreenHeight());
        //self.$viewport.height(self.getScreenHeight());
        //self.$viewport.width(self.getScreenWidth());
     

    };
   
}