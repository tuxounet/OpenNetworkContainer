var longLoad_PageClass = function () {

    //Héritage page de base 
    ONC_Page.call(this);

    var self = this;


    self.load = function () {
        //Simulation d'un long chargement
        setTimeout(self.loadCompleted, 3000);
    }

};