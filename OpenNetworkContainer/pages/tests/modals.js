﻿/// <reference path="../../scripts/vendor/onc/ONC.js" />
/// <reference path="../../scripts/app/HelloWorldApp.js" />
/// <reference path="../../scripts/vendor/onc/dependencies/jquery-1.11.0.min.js" />
/// <reference path="../../scripts/vendor/onc/dependencies/jquery-migrate.1.2.1.min.js" />
/// <reference path="../../scripts/vendor/onc/ONC_Modal.js" />
var modals_PageClass = function () {

    //Héritage page de base 
    ONC_Page.call(this);

    var self = this;
    

    self.showLinkModal = function () {

        HelloWorld.app.router.showModal("#pages/modals/testModal", null,
            function (ret) {
                //Callback de fermeture
                console.dir(ret);
            });
    }


    self.showSimpleModal = function () {

        HelloWorld.app.router.showModal("#pages/modals/simpleModal", null,
            function (ret) {
                //Callback de fermeture
                console.dir(ret);
            });
    }


    self.goBack = function () {
        HelloWorld.app.router.goBack();
    }


};