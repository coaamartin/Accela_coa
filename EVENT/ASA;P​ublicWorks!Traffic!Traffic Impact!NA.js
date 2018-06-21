// ASA:P​ublicWorks/Traffic/Traffic Engineering Request/NA
//Script 145
var parentCapId = getParent();
var appName = getAppName(capId);

if(appName == null || appName == "" || appName == undefined)
    copyAppName(parentCapId, capId);