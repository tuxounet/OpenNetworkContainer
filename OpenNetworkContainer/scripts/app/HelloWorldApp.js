/// <reference path="../vendor/ONC_App.js" />
/// <reference path="../vendor/ONC.js" />

window.HelloWorld = {

    /*Conteneur */
    app: new ONC({
        viewportSelector: "#viewport",
        sliderSelector: "#viewport .pages"
    }),


    /*Démarrage */
    start: function () {

        console.log("Start");

        this.app.run(function () {

            //Le conteneur est démarré
            console.log("Started")


        });


    }
}