if (!appMatch("Building/Permit/TempSigns/*") && !appMatch("Building/Permit/TempUse/*") &&
	!appMatch("Building/Permit/DonationBin/*")) {
	if (!publicUser) {
		logDebug("Starting PPA;Building!Permit!OTC!~.js ");
		logDebug("Current balance: " + balanceDue);
		//Check balance and update task
		if (balanceDue == 0) {
			//Start to generate the Certificate. This will attach to the record when ran.
			logDebug("Starting to kick off event to attach cert to record");
			var altID = capId.getCustomID();
			var invoiceNbrObj = getLastInvoice({});
			var invNbr = invoiceNbrObj.getInvNbr()
			appType = cap.getCapType().toString();
			var vAsyncScript = "SEND_EMAIL_BLD_OTC";
			var envParameters = aa.util.newHashMap();
			envParameters.put("altID", altID);
			envParameters.put("capId", capId);
			envParameters.put("cap", cap);
			envParameters.put("appType", appType);
			envParameters.put("INVOICEID", String(invNbr));
			logDebug("Starting to kick off ASYNC event for OTC. Params being passed: " + envParameters);
			aa.runAsyncScript(vAsyncScript, envParameters);

		}

		logDebug("End of PPA;Building!Permit!OTC!~.js");
		if (publicUser) {
			logDebug("PRA event will not run as payment is being processed in ACA");
		}
	}
}