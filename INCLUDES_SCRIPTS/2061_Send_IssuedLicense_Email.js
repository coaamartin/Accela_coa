logDebug("Starting _License_Notification script");
var capId = aa.env.getValue("capId");
var cap = aa.env.getValue("cap");
var altID = aa.env.getValue("altID");
//var altID = capId.getCustomID()
appType = cap.getCapType().toString();
var vAsyncScript = "SEND_EMAIL_TAXLIC_LICENSE_ASYNC";
var envParameters = aa.util.newHashMap();
envParameters.put("altID", altID);
envParameters.put("capId", capId);
envParameters.put("cap", cap);
logDebug("Starting to kick off ASYNC event for Invoice. Params being passed: " + envParameters);
aa.runAsyncScript(vAsyncScript, envParameters);
logDebug("End of 2056_License_Notification script");
