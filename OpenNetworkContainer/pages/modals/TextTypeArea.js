var TextTypeArea_ModalClass = function () {
    ONC_Modal.call(this);

    var self = this;

    self.textContent = ko.observable();

    self.load = function () {

        $("textarea", self.DOM).focus();
    }

    self.goDisplay = function () {

        self.close();

    }
}
