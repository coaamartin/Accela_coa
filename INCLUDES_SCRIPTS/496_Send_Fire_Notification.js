if (balanceDue > 0)
{
	logDebug("Starting 496_Fire_Notifications script");
	var envParameters = aa.util.newHashMap();
	envParameters.put("capId", capId);
	envParameters.put("cap", cap);
	envParameters.put("INVOICEID", InvoiceNbrArray[0] + "");
	envParameters.put("AGENCYID", "AURORACO");
	//var capId = aa.env.getValue("capId");
	var vAsyncScript = "SEND_FIRE_INVOICE_ASYNC";
	aa.runAsyncScript(vAsyncScript, envParameters)
	//var invNbr = aa.env.getValue("INVOICEID");
	logDebug("CapID info: " + envParameters);
	//logDebug("Invoice ID = " + invNbr);
	logDebug("End of 496_Fire_Notifications script");
	logDebug("**END** FIRE_INVOICE_ASYNC kicks off from here");
// Testing all of the parameters that are gonig to send fire invoice async
	var capId = aa.env.getValue("capId");
	var cap = aa.env.getValue("cap");
	var invNbr = aa.env.getValue("INVOICEID");
	//var emailTo = getEmailString(); 
	var capAlias = cap.getCapModel().getAppTypeAlias();
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
	var emailtemplate = "FIRE INVOICED FEES";
	var report = generateReportFile("Invoice Report", rParams, aa.getServiceProviderCode());
	logDebug("1" + capId);
	logDebug("2" + invNbr);
	//logDebug("3" + emailTo);
	logDebug("4" + tParams);
	logDebug("5" + rParams);
	logDebug("6" + emailtemplate);
	logDebug("7" + report);
}

