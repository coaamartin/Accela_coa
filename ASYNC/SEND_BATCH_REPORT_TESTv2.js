	logDebug("Starting SEND_BATCH_REPORT_TESTs script");
	//var InvoiceNbr = InvoiceNbrArray[0] + "";
	//var envParameters = aa.util.newHashMap();
	//envParameters.put("capId", capId);
	//envParameters.put("cap", cap);
	//envParameters.put("INVOICEID", InvoiceNbr);
	envParameters.put("AGENCYID", "AURORACO");
	var vAsyncScript = "SEND_BATCH_REPORT_TEST";
	aa.runAsyncScript(vAsyncScript, envParameters);
	logDebug("CapID info: " + envParameters);
	//logDebug("Invoice NBR: " + InvoiceNbr);
	logDebug("End of SEND_BATCH_REPORT_TEST script");
	logDebug("**END** FSEND_BATCH_REPORT_TEST kicks off from here");
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