if (balanceDue > 0) {
	logDebug("Starting 496_Fire_Notifications script");
	var InvoiceNbr = InvoiceNbrArray[0] + "";
	var envParameters = aa.util.newHashMap();
	envParameters.put("capId", capId);
	envParameters.put("cap", cap);
	envParameters.put("INVOICEID", InvoiceNbr);
	envParameters.put("AGENCYID", "AURORACO");
	var vAsyncScript = "SEND_FIRE_INVOICE_ASYNC";
	aa.runAsyncScript(vAsyncScript, envParameters)
	logDebug("CapID info: " + envParameters);
	logDebug("Invoice NBR: " + InvoiceNbr);
	logDebug("End of 496_Fire_Notifications script");
	logDebug("**END** FIRE_INVOICE_ASYNC kicks off from here");
	//var errorLog = [];
	//logDebug("Errors from Send_fire_Invoice_Async =" + errorLog);
	var capAlias = cap.getCapModel().getAppTypeAlias();
	//var iContact = getContactByType("", capId);
	var fName = "Ray";
	var lName = "Province";
	var today = new Date();
	var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
	var tParams = aa.util.newHashtable();
	tParams.put("$$todayDate$$", thisDate);
	tParams.put("$$altID$$", capId.getCustomID());
	tParams.put("$$capAlias$$", capAlias);
	tParams.put("$$FirstName$$", fName);
	tParams.put("$$LastName$$", lName);
	var rParams = aa.util.newHashtable();
	rParams.put("AGENCYID", "AURORACO");
	rParams.put("INVOICEID", invNbr);
	var report = generateReportFile("Fire Invoice Report", rParams, aa.getServiceProviderCode());
	logDebug("Template Parameters: " + tParams);
	logDebug("Rparams" + rParams);
	logDebug("Report info: " + report);


}