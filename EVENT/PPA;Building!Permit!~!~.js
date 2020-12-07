logDebug("Starting PPA;Building!Permit!~!~.js ");
// logDebug("Starting 5127_CityClerk_PRA.js");
//include("5127_CityClerk_PRA.js");
logDebug("Current balance: " + balanceDue);
logDebug("Starting DB approval email and updating statues");
//Check balance and update task
if (balanceDue == 0) {
	updateAppStatus("Approved", "Status updated via script PPA;Building!Permit.js");
	closeTask("Application Close", "Approved", "", "");
	closeAllTasks(capId, "");
	//include("5124_CityClerk_Approval");
	
	logDebug("---------------------> PPA;Building!Permit.js ended.");
	//aa.sendMail("rprovinc@auroragov.org", "rprovinc@auroragov.org", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);
	//Start to generate the Certificate. This will attach to the record when ran.
	logDebug("Starting to kick off event to attach cert to record");
	if ("Building/Permit/DonationBin/NA".equals(appTypeString)) {
		var altID = capId.getCustomID();
		appType = cap.getCapType().toString();
		var vAsyncScript = "SEND_EMAIL_DB_ASYNC";
		var envParameters = aa.util.newHashMap();
		envParameters.put("altID", altID);
		envParameters.put("capId", capId);
		envParameters.put("cap", cap);
		logDebug("Starting to kick off ASYNC event for DB. Params being passed: " + envParameters);
		aa.runAsyncScript(vAsyncScript, envParameters);
	} else if ("Building/Permit/TempSigns/NA".equals(appTypeString)) {
		var altID = capId.getCustomID();
		appType = cap.getCapType().toString();
		var vAsyncScript = "SEND_EMAIL_TS_ASYNC";
		var envParameters = aa.util.newHashMap();
		envParameters.put("altID", altID);
		envParameters.put("capId", capId);
		envParameters.put("cap", cap);
		logDebug("Starting to kick off ASYNC event for DB. Params being passed: " + envParameters);
		aa.runAsyncScript(vAsyncScript, envParameters);
	} else if ("Building/Permit/TempUse/NA".equals(appTypeString)) {
		var altID = capId.getCustomID();
		appType = cap.getCapType().toString();
		var vAsyncScript = "SEND_EMAIL_TU_ASYNC";
		var envParameters = aa.util.newHashMap();
		envParameters.put("altID", altID);
		envParameters.put("capId", capId);
		envParameters.put("cap", cap);
		logDebug("Starting to kick off ASYNC event for DB. Params being passed: " + envParameters);
		aa.runAsyncScript(vAsyncScript, envParameters);
	}
}

logDebug("End of PPA;CityClerk!Incident!~!~.js ");
