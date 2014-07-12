var ONC_Config = function (app) {
    var self = this;

    self.app = app;

    var defautConfig = {
        remoteUrl: "",
        debug: true
    };


    self.config = defautConfig;


    self.loadConfig = function (callback) {

        ONC_Logger.log("ONC: Chargement de la config...");

        if (typeof config == "undefined") {
            ONC_Logger.warn("ONC: Configuration introuvable, chargement de la config par défaut");
            self.config = defautConfig; 
        }
        else {
            self.config = config;
            ONC_Logger.log("ONC: Config chargée " + JSON.stringify(config));
        }
        
        if (callback) callback(); 
    };


}