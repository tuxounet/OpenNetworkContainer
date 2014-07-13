// Avoid `console` errors in browsers that lack a console.
(function () {
    var method;
    var noop = function () { };
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

var ONC_Logger = {
    debug: true,
    messages: [],
    log: function (message) {
        if (ONC_Logger.debug == true) {
            console.log(message);
            ONC_Logger.messages.push({ Level: "LOG", Message: message });
            if (document.getElementById("_core-debug") != null)
                document.getElementById("_core-debug").innerHTML += "<span>" + message + "</span><br/>";
        }
    },
    info: function (message) {

        console.info(message);
        ONC_Logger.messages.push({ Level: "INFO", Message: message });
        if (ONC_Logger.debug == true) {
            if (document.getElementById("_core-debug") != null)
                document.getElementById("_core-debug").innerHTML += "<span>" + message + "</span><br/>";
        }

    },
    warn: function (message) {
        console.warn(message);
        ONC_Logger.messages.push({ Level: "WARN", Message: message });
        if (ONC_Logger.debug) {
            if (document.getElementById("_core-debug") != null)
                document.getElementById("_core-debug").innerHTML += "<span style='color:purple'>" + message + "</span><br/>";
        }
    },
    error: function (message) {
        console.error(message);
        ONC_Logger.messages.push({ Level: "ERROR", Message: message });
        if (ONC_Logger.debug) {
            if (document.getElementById("_core-debug") != null)
                document.getElementById("_core-debug").innerHTML += "<span style='color:red'>" + message + "</span><br/>";
        }
    },
    clear: function () {

        ONC_Logger.messages = [];
    }
}