var ONC_Config = function (app) {
    var self = this;

    self.app = app;

    var defautConfig = {
        remoteUrl: "",
        debug: true
    };


    self.current = defautConfig;


    self.loadConfig = function (callback) {

        ONC_Logger.log("ONC: Chargement de la config...");


        $.ajax(app.params.configPath)
            .done(function (result) {
                eval(result);
                self.current = config;
                ONC_Logger.log("ONC: Config chargée " + JSON.stringify(config));
            })
            .fail(function (xhr, e) {
                ONC_Logger.error(e);
                self.current = defautConfig;
                ONC_Logger.warn("ONC: Configuration introuvable, chargement de la config par défaut");
            })
            .always(function () {
                if (callback) callback();
            })

    };


}