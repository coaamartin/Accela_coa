if (!appMatch("Building/Permit/TempSigns/*") && !appMatch("Building/Permit/TempUse/*") && !appMatch("Building/Permit/DonationBin/*")) {
logDebug("Starting PRA;Building!Permit!OTC!~.js ");
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

		//need to also send the permit to the customer once fees have been paid
		// logDebug("Starting to kick off event to send permit to customer");
		// var altID2 = capId.getCustomID();
		// appType2 = cap.getCapType().toString();
		// var vAsyncScript2 = "SEND_EMAIL_BLD_OTC_PERMIT";
		// var envParameters2 = aa.util.newHashMap();
		// envParameters2.put("altID", altID2);
		// envParameters2.put("capId", capId);
		// envParameters2.put("cap", cap);
		// envParameters2.put("appType", appType2);
		// logDebug("Starting to kick off ASYNC event for OTC Permit issuance. Params being passed: " + envParameters2);
		// aa.runAsyncScript(vAsyncScript2, envParameters2);
}
logDebug("End of PRA;Building!Permit!OTC!~.js");
}