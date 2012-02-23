/* define namespaces which used by tkn's libraries */
var namespace_lib_core = "jp.co.imgsrc";
var namespace_lib_app = "jp.co.imgsrc.application";
var namespace_lib_geom = "jp.co.imgsrc.geom";
var namespace_lib_events = "jp.co.imgsrc.events";
var namespace_lib_tween = "jp.co.imgsrc.tween";
var namespace_lib_net = "jp.co.imgsrc.net";
var namespace_lib_display = "jp.co.imgsrc.display";
var namespace_lib_ui = "jp.co.imgsrc.ui";

/* simple logger */
function trace() {for(var i=0;i<arguments.length;i++)if(window.console){console.log(arguments[i]);}}
function warn(message) {alert("Warning : " + message);}