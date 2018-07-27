var ENVIRON = "DEV";
var EMAILREPLIES = "noreply@auroragov.org";
var SENDEMAILS = true;
var ACAURL = "https://awebdev.aurora.city/CitizenAccess/";


//set Debug
var vDebugUsers = ['EWYLAM','ADMIN','JSCHILLO','EVONTRAPP'];
if (exists(currentUserID,vDebugUsers)) {
	showDebug = 3;
	showMessage = true;
}