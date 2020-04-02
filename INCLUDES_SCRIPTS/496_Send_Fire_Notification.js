if (balanceDue > 0) {
	logDebug("Starting 496_Fire_Notifications script");
	var InvoiceNbr = InvoiceNbrArray[0] + "";
	var envParameters = aa.util.newHashMap();
	envParameters.put("capId", capId);
	envParameters.put("cap", cap);
	envParameters.put("INVOICEID", InvoiceNbr);
	envParameters.put("fullName", fullName)
	envParameters.put("AGENCYID", "AURORACO");
	var vAsyncScript = "SEND_FIRE_INVOICE_ASYNC";
	aa.runAsyncScript(vAsyncScript, envParameters)
	var aContact = getContactByType("Inspection Contact", capId);
	var fullName = aContact;
	logDebug("CapID info: " + envParameters);
	logDebug("Invoice NBR: " + InvoiceNbr);
	logDebug("End of 496_Fire_Notifications script");
	logDebug("**END** FIRE_INVOICE_ASYNC kicks off from here");
	//Below was for testing purpose wanted to ensure all parameters where being passed.
	// var capAlias = cap.getCapModel().getAppTypeAlias();
	// var fName = "Ray";
	// var lName = "Province";
	// var today = new Date();
	// var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
	// var tParams = aa.util.newHashtable();
	// tParams.put("$$todayDate$$", thisDate);
	// tParams.put("$$altID$$", capId.getCustomID());
	// tParams.put("$$capAlias$$", capAlias);
	// tParams.put("$$FirstName$$", fName);
	// tParams.put("$$LastName$$", lName);
	// var rParams = aa.util.newHashtable();
	// rParams.put("AGENCYID", "AURORACO");
	// rParams.put("INVOICEID", InvoiceNbr);
	// logDebug("Template Parameters: " + tParams);
	// logDebug("Rparams" + rParams);
}