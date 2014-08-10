/// <reference path="../../scripts/vendor/onc/ONC.js" />
/// <reference path="../../scripts/app/HelloWorldApp.js" />
/// <reference path="../../scripts/vendor/onc/dependencies/jquery-1.11.0.min.js" />
/// <reference path="../../scripts/vendor/onc/dependencies/jquery-migrate.1.2.1.min.js" />
/// <reference path="../../scripts/vendor/onc/ONC_Modal.js" />
var modals_PageClass = function () {

    //Héritage page de base 
    ONC_Page.call(this);

    var self = this;


    function testModalVM() {
        ONC_Modal.call(this);

        var self = this;

        self.ping = function () {
            alert("Pong");
        }
    }


    self.modalVM = null;
    self.showModal = function () {

        //Construction du vm 
        self.modalVM = new testModalVM();

        HelloWorld.app.router.showModal($("#modal_sample", self.DOM).html(), self.modalVM)
    }
  
};