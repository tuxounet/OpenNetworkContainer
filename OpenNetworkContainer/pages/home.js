var home_PageClass = function () {
    var self = this;
    self.pivot = null;
    self.pageElement = function () {
        return $(".page.center")[0];
    };
    self.load = function (reason) {
        
        //Branchement du ViewModel
        ko.applyBindings(self, self.pageElement());


    };

    self.unload = function () {
        //Débranchement du viewModel
        ko.cleanNode(self.pageElement());
    };




};