/// <reference path="dependencies/modernizr-2.7.2.js" />

var ONC_Boot = function (app) {

    var self = this;
    self.app = app;
    self.isPhoneGap = false;
    self.isLegacy = false;


    var initCallback = null;

    // Application Constructor
    self.initialize = function (callback) {


        ONC_Logger.log("OpenNetworkContainer " + self.app.version + " ((c) Christophe Tiraoui 2014)")
        ONC_Logger.log("ONC: Boot...");

        initCallback = callback;
        self.bindEvents();

    };

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    self.bindEvents = function () {


        if (window.location.host != "localhost:8077") {
            self.isPhoneGap = true;
            //Mode phoneGap
            document.addEventListener('deviceready', self.onDeviceReady, false);

        }
        else {
            //Mode web
            self.isPhoneGap = false;
            self.startup();
        }

    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    self.onDeviceReady = function () {
        ONC_Logger.log("Device ready");
        if (app != null && app.onPause != null) document.addEventListener("pause", app.onPause, false);
        if (app != null && app.onResume != null) document.addEventListener("resume", app.onResume, false);
        if (app != null && app.onBackButton != null) document.addEventListener("backbutton", app.onBackButton, false);
        if (app != null && app.onMenuButton != null) document.addEventListener("menubutton", app.onMenuButton, false);
        self.startup();
    };

    //Processus de démarrage
    self.startup = function () {


        //On demande de forcer le mode legacy 
        if (self.app.params.forceLegacy === true) {
            self.isLegacy = true;

        }
        else {
            //Test du mode legacy 
            if (typeof Modernizr === "undefined") {
                //On ne peut pas tester, on passe en legacy
                self.isLegacy = true;
            }
            else {
                if (Modernizr.csstransforms3d == false)
                    self.isLegacy = true;
                else
                    self.isLegacy = false;
            }

        }

        //Affichage des capacités du navigateur
        ONC_Logger.log("DEBUG: Capacité du navigateur : " + $("html").attr("class"));

        if (self.isLegacy == true)
        {
            $("body").addClass("onc-legacy");
            ONC_Logger.warn("Mode Legacy");
        }
        


        ONC_Logger.log("ONC: Boot terminé");
        //Si il y a un callback de démarrage, on l'invoque
        if (initCallback != null) initCallback();


    };



}



