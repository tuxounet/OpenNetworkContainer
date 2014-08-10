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

    function editModalVM() {
        ONC_Modal.call(this);

        var self = this;

        self.textContent = ko.observable();
        self.parent = null; 
      
        self.goDisplay = function () {

            self.parent.value(self.textContent())            
            self.close();

        }
    }


    self.modalVM = null;
    self.goEdit = function () {

        //Construction du vm 
        self.modalVM = new editModalVM();
        self.modalVM.textContent(self.value());
        self.modalVM.parent = self;
        HelloWorld.app.router.showModal($("#editModalContent", self.DOM).html(), self.modalVM)
    }


};