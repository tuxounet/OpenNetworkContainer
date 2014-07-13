/// <reference path="../vendor/ONC_App.js" />
/// <reference path="../vendor/ONC.js" />

var HelloWorld = {

    /*Conteneur */
    app: new ONC({
        viewportSelector: "#viewport",
        sliderSelector: "#viewport .pages",
        forceLegacy: false,
    }),


    /*Démarrage */
    start: function () {

        console.log("Start");

        //Config de libs
        moment.lang("fr");

        //Demarrage de l'app
        this.app.run(function () {

            //Le conteneur est démarré
            console.log("Started")
        });


    }
}