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
		getWorkflowParams4Notification(tParams);
		tParams.put("$$todayDate$$", thisDate);
		tParams.put("$$altID$$", capId.getCustomID());
		tParams.put("$$capAlias$$", capAlias);
		addParameter(tParams, "$$wfComment$$", wfComment);
		//logDebug("Comment is:" +wfComment);
		var emailtemplate = "LIC GB ZONING";
		sendNotification("noreply@auroragov.org", emailTo, "", emailtemplate, tParams, null);
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
		getWorkflowParams4Notification(tParams);
		tParams.put("$$todayDate$$", thisDate);
		tParams.put("$$altID$$", capId.getCustomID());
		tParams.put("$$capAlias$$", capAlias);
		addParameter(tParams, "$$wfComment$$", wfComment);
		var emailtemplate = "LIC GB ZONING";
		sendNotification("noreply@auroragov.org", emailTo, "", emailtemplate, tParams, null);
	}
}


function getWorkflowParams4Notification(params) {
    // pass in a hashtable and it will add the additional parameters to the table

    // Load Parmeters - Workflow
    var taskItem = null;
    if (arguments.length > 1 && arguments[1] != null) {
        taskItem = arguments[1]; // use cap ID specified in args
    }

    if (taskItem) {             // Load from taskItem
        addParameter(params, "$$wfTask$$", taskItem.getTaskDescription());
        addParameter(params, "$$wfProcess$$", taskItem.getProcessCode());
        addParameter(params, "$$wfNote$$", taskItem.getDispositionNote());
        addParameter(params, "$$wfStatus$$", taskItem.getDisposition());
        addParameter(params, "$$wfDate$$", taskItem.getDispositionDateString());
        addParameter(params, "$$wfDue$$", taskItem.getDueDate());
        addParameter(params, "$$wfComment$$", taskItem.getDispositionComment());
        addParameter(params, "$$wfStaffUserID$$", taskItem.getAsgnStaff());
        addParameter(params, "$$wfStaffUserFullName$$", getUserFullName(taskItem.getAsgnStaff()));
        addParameter(params, "$$wfTimeBillable$$", taskItem.getBillable());
        addParameter(params, "$$wfTimeOT$$", taskItem.getOverTime());
        addParameter(params, "$$wfHours$$", taskItem.getHoursSpent());
    } else if (wfTask) {        // Load from Globals
        if (typeof (wfStaffUserID) == "undefined") wfStaffUserID = currentUserID;
        addParameter(params, "$$wfTask$$", wfTask);
        addParameter(params, "$$wfProcess$$", wfProcess);
        addParameter(params, "$$wfNote$$", wfNote);
        addParameter(params, "$$wfStatus$$", wfStatus);
        addParameter(params, "$$wfDate$$", wfDateMMDDYYYY);
        addParameter(params, "$$wfDue$$", wfDue);
        addParameter(params, "$$wfComment$$", wfComment);
        addParameter(params, "$$wfStaffUserID$$", wfStaffUserID);
        addParameter(params, "$$wfStaffUserFullName$$", getUserFullName(wfStaffUserID));
        addParameter(params, "$$wfTimeBillable$$", wfTimeBillable);
        addParameter(params, "$$wfTimeOT$$", wfTimeOT);
        addParameter(params, "$$wfHours$$", wfHours);
    }
    return params;
}