/// <reference path="ONC_Boot.js" />
/// <reference path="ONC_Config.js" />
/// <reference path="ONC_Logger.js" />
/// <reference path="ONC_Router.js" />
var ONC = function (params) {
    var self = this;

    self.version = "14.3";

    var defaultParams = {
        viewportSelector: "body",
        sliderSelector: ".pages"
    }

    /* Configuration du conteneur */
    self.params = params == null ? defaultParams : params;
    

    /* Boot de référence de l'application */
    self.boot = new ONC_Boot(self);

    /* Config de référence de l'application */
    self.config = new ONC_Config();

    /* Gestionnaire de vue de référence */
    self.viewport = new ONC_Viewport();

    /* Routeur de référence */
    self.router = new ONC_Router();

    /*Démarre le conteneur */
    self.run = function (callback) {

        window.onerror = self.onexception;

        //On attend que toute les ressources soient chargées
        $(document).ready(function () {

            self.boot.initialize(function () {

                //L'applicaiton a démarré
                self.config.loadConfig(function () {


                    //Application de fastClick     
                    FastClick.attach(document.body);

                    //Gestionnaire de vue                    
                    self.viewport.initialize(self.params.viewportSelector)
                    
                    //Router 
                    self.router.initialize(self.params.sliderSelector);


                    //Callabck final 
                    if (callback) callback();

                });

            })
        });



    }


    self.onPause = function () {
        ONC_Logger.log("App Paused");


    };
    self.onResume = function () {
        ONC_Logger.log("App Resume");

    };

    self.onBackButton = function () {
        ONC_Logger.log("BackButton");

    };
    self.onMenuButton = function () {
        ONC_Logger.log("Menu button");

    };





    //#region "Debug"

    //En cas d'erreur
    self.onerror = function (e) {
        var ret = e;
        if (e != null) {
            if (e.ErrorCode != null || e.ErrorMessage != null) {
                ret = "AJAX:" + e.ErrorCode + " - " + e.ErrorMessage;
            }
            else
                ret = e;
        }
        else
            ret = "Une erreur est survenue";

        ONC_Logger.error(ret);


    },

    self.onexception = function (msg, url, linenumber) {

        var ret = 'EXCEPTION: Error message: ' + msg + '\nURL: ' + url + ":" + linenumber;
        ONC_Logger.error(ret);

        return true;
    }

    //#endregion

}
