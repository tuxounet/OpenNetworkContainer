/// <reference path="../../scripts/app/HelloWorldApp.js" />
/// <reference path="../../scripts/vendor/onc/ONC_Router.js" />
var textarea_PageClass = function () {

    //Héritage page de base 
    ONC_Page.call(this);

    var self = this;


    self.goBack = function () {
        HelloWorld.app.router.goBack();

    }
    self.value = ko.observable("TEST");

    self.goEdit = function () {
        HelloWorld.app.router.showModal("#pages/modals/TextTypeArea", self.onTypeAreaLoaded, self.onTypeAreaClosed);        
    }

    self.onTypeAreaLoaded = function (status, vm) {
        if (status != "OK") return;

        vm.textContent(self.value());
    }

    self.onTypeAreaClosed = function (vm) {
        self.value(vm.textContent());
    }


};