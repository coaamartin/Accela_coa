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
} else if (!appMatch("Building/Permit/TempSigns/*") && !appMatch("Building/Permit/TempUse/*") && !appMatch("Building/Permit/DonationBin/*") && !appMatch("Building/Permit/OTC/*")) {
logDebug("Starting PPA;Building!Permit!~!~.js ");
logDebug("Current balance: " + balanceDue);
//Check balance and update task
if (balanceDue == 0) {
		var altID = capId.getCustomID();
		appType = cap.getCapType().toString();
		var invoiceNbrObj = getLastInvoice({});
		var invNbr = invoiceNbrObj.getInvNbr();
		var vAsyncScript = "SEND_EMAIL_BLD_OTC";
		var envParameters = aa.util.newHashMap();
		envParameters.put("altID", altID);
		envParameters.put("capId", capId);
		envParameters.put("cap", cap);
		envParameters.put("INVOICEID", String(invNbr));
		logDebug("Starting to kick off ASYNC event for BLD PERMITS. Params being passed: " + envParameters);
		aa.runAsyncScript(vAsyncScript, envParameters);
		logDebug("---------------------> PPA;Building!Permit.js ended.");
	}
}
