var TextTypeArea_ModalClass = function () {
    ONC_Modal.call(this);

    var self = this;

    self.textContent = ko.observable();


    self.goDisplay = function () {

        self.close();

    }
}
