if (appMatch("Building/Permit/TempSigns/*") && appMatch("Building/Permit/TempUse/*") && appMatch("Building/Permit/DonationBin/*")) {
	logDebug("Starting PPA;Building!Permit!~!~.js ");
	logDebug("Current balance: " + balanceDue);

	//Check balance and update task
	if (balanceDue == 0) {
		updateAppStatus("Approved", "Status updated via script PPA;Building!Permit.js");
		closeTask("Application Close", "Approved", "", "");
		closeAllTasks(capId, "Approved");
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
			logDebug("Starting to kick off ASYNC event for TS. Params being passed: " + envParameters);
			aa.runAsyncScript(vAsyncScript, envParameters);
		} else if ("Building/Permit/TempUse/NA".equals(appTypeString)) {
			var altID = capId.getCustomID();
			appType = cap.getCapType().toString();
			var vAsyncScript = "SEND_EMAIL_TU_ASYNC";
			var envParameters = aa.util.newHashMap();
			envParameters.put("altID", altID);
			envParameters.put("capId", capId);
			envParameters.put("cap", cap);
			logDebug("Starting to kick off ASYNC event for TU. Params being passed: " + envParameters);
			aa.runAsyncScript(vAsyncScript, envParameters);
		}
	}

	logDebug("End of PPA;CityClerk!Incident!~!~.js ");
} else if (!appMatch("Building/Permit/TempSigns/*") && !appMatch("Building/Permit/TempUse/*") && !appMatch("Building/Permit/DonationBin/*")) {
	logDebug("Starting PPA;Building!Permit!~!~.js ");
	logDebug("Current balance: " + balanceDue);
	//Check balance and update task
	if (balanceDue == 0) {
		// updateAppStatus("Approved", "Status updated via script PPA;Building!Permit.js");
		// closeTask("Application Close", "Approved", "", "");
		// closeAllTasks(capId, "Approved");
		var altID = capId.getCustomID();
		appType = cap.getCapType().toString();
		var invNbr = aa.env.getValue("INVOICEID");
		var vAsyncScript = "SEND_EMAIL_BLD_ASYNC";
		var envParameters = aa.util.newHashMap();
		envParameters.put("altID", altID);
		envParameters.put("capId", capId);
		envParameters.put("cap", cap);
		envParameters.put("INVOICEID", invNbr);
		logDebug("Starting to kick off ASYNC event for BLD PERMITS. Params being passed: " + envParameters);
		aa.runAsyncScript(vAsyncScript, envParameters);
		//aa.sendMail("rprovinc@auroragov.org", "rprovinc@auroragov.org", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);
		logDebug("---------------------> PPA;Building!Permit.js ended.");
	}
}