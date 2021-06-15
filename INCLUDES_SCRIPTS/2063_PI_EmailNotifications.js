try{ 
if ((wfStatus == 'Acceptance') && appMatch('PublicWorks/Public Improvement/Permit/*')) {
logDebug("Starting of 2063_PI_Email Notification Script");
var altID = capId.getCustomID()
appType = cap.getCapType().toString();
var vAsyncScript = "SEND_EMAIL_PI_ACCEPTANCE_ASYNC";
var envParameters = aa.util.newHashMap();
envParameters.put("altID", altID);
envParameters.put("capId", capId);
envParameters.put("cap", cap);
logDebug("Starting to kick off ASYNC event for PI. Params being passed: " + envParameters);
aa.runAsyncScript(vAsyncScript, envParameters);
logDebug("End of 2063_PI_Email Notification Script");
}
} catch(e) {
	email("acharlton@truepointsolutions.com", "rprovinc@auroragov.org", "Error in 2063_PI_Notifications", e.message);
}
