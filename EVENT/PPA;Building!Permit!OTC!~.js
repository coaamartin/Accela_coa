if (!appMatch("Building/Permit/TempSigns/*") && !appMatch("Building/Permit/TempUse/*") &&
!appMatch("Building/Permit/DonationBin/*")){
logDebug("Starting PPA;Building!Permit!OTC!~.js ");
logDebug("Current balance: " + balanceDue);

//Check balance and update task
if (balanceDue == 0) {
	// updateAppStatus("Approved", "Status updated via script PPA;Building!Permit.js");
	// closeTask("Application Close", "Approved", "", "");
	// closeAllTasks(capId, "Approved");
	//include("5124_CityClerk_Approval");
	
	logDebug("---------------------> PPA;Building!Permit!OTC!~.js has ended");
	//aa.sendMail("rprovinc@auroragov.org", "rprovinc@auroragov.org", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);
	//Start to generate the Certificate. This will attach to the record when ran.
	logDebug("Starting to kick off event to attach cert to record");
		var altID = capId.getCustomID();
		appType = cap.getCapType().toString();
		var vAsyncScript = "SEND_EMAIL_BLD_ASYNC";
		var envParameters = aa.util.newHashMap();
		envParameters.put("altID", altID);
		envParameters.put("capId", capId);
		envParameters.put("cap", cap);
        envParameters.put("appType", appType);
		logDebug("Starting to kick off ASYNC event for OTC. Params being passed: " + envParameters);
		aa.runAsyncScript(vAsyncScript, envParameters);
	
}

logDebug("End of PPA;Building!Permit!OTC!~.js");
}