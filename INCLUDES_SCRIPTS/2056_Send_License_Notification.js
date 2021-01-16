if ((wfStatus == 'Fees Invoiced') && (balanceDue > 0)) {
logDebug("Starting _License_Notification script");
var invoiceNbrObj = getLastInvoice({});
var invNbr = invoiceNbrObj.getInvNbr();
var altID = capId.getCustomID()
appType = cap.getCapType().toString();
var vAsyncScript = "SEND_EMAIL_TAXLIC_INVOICE_ASYNC";
var envParameters = aa.util.newHashMap();
envParameters.put("altID", altID);
envParameters.put("capId", capId);
envParameters.put("cap", cap);
envParameters.put("INVOICEID", String(invNbr));
getACARecordParam4Notification(envParameters,acaUrl)
logDebug("Starting to kick off ASYNC event for Invoice. Params being passed: " + envParameters);
aa.runAsyncScript(vAsyncScript, envParameters);
logDebug("End of 2056_License_Notification script");
}

if ((wfStatus == 'Temp License Issued') || (wfStatus == 'Temp Permit Extended')) {
logDebug("Starting TMP Liq Lic Email Script script");
var altID = capId.getCustomID()
appType = cap.getCapType().toString();
var vAsyncScript = "SEND_EMAIL_TAXLIC_TMPLIC_ASYNC";
var envParameters = aa.util.newHashMap();
envParameters.put("altID", altID);
envParameters.put("capId", capId);
envParameters.put("cap", cap);
logDebug("Starting to kick off ASYNC event for TMP License. Params being passed: " + envParameters);
aa.runAsyncScript(vAsyncScript, envParameters);
logDebug("End of 2056_License_Notification script");
}

if (matches(wfStatus,"Approved", "Denied", "Pending") && wfTask == "Zoning Review"){
	var emailTo = AInfo["Correspondence Email"]; 
	logDebug("Email is: " +emailTo);
	if (emailTo != "" && emailTo !=null){
		var capAlias = cap.getCapModel().getAppTypeAlias();
		var today = new Date();
		var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
		var tParams = aa.util.newHashtable();
		getACARecordParam4Notification(tParams,acaUrl)
		tParams.put("$$todayDate$$", thisDate);
		tParams.put("$$altID$$", capId.getCustomID());
		tParams.put("$$capAlias$$", capAlias);
		addParameter(tParams, "$$wfComment$$", wfComment);
		var emailtemplate = "LIC GB ZONING";
		sendNotification("planning@auroragov.org", emailTo, "", emailtemplate, tParams, null);
	}
}

if (matches(wfStatus,"Approved", "Denied", "Pending") && wfTask == "Building Review"){
	var emailTo = AInfo["Correspondence Email"]; 
	logDebug("Email is: " +emailTo);
	if (emailTo != "" && emailTo !=null){
		var capAlias = cap.getCapModel().getAppTypeAlias();
		var today = new Date();
		var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
		var tParams = aa.util.newHashtable();
		getACARecordParam4Notification(tParams,acaUrl)
		logDebug("TESTING ACA SITE " +acaUrl)
		tParams.put("$$todayDate$$", thisDate);
		tParams.put("$$altID$$", capId.getCustomID());
		tParams.put("$$capAlias$$", capAlias);
		addParameter(tParams, "$$wfComment$$", wfComment);
		var emailtemplate = "LIC GB BUILDING";
		sendNotification("permitcounter@auroragov.org", emailTo, "", emailtemplate, tParams, null);
	}
}
