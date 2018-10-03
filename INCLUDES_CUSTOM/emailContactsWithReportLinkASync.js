/*
emailContactsWithReportLinkASync
Required Params:
	pSendEmailToContactTypes = comma-separated list of contact types to send to, no spaces. "All" will send to all contacts. "Primary" will send to the contact with the primary flag enabled.
	pEmailTemplate = notification template name
Optional Params:
	vEParams = parameters to be filled in notification template
	reportTemplate = if provided, will run report and attach (per report manager settings) and include a link to it in the email
	vRParams  = report parameters
	vAddAdHocTask = Y/N for adding manual notification task when no email exists (Assigns the task to the department configured by module in the "Manual_Notification_Assign_Dept" standard choice)
	changeReportName = if using reportTemplate, will change the title of the document produced by the report from its default

Sample: 
	emailContactsWithReportLinkASync('OWNER APPLICANT', 'DPD_WAITING_FOR_PAYMENT'); //minimal
	emailContactsWithReportLinkASync('OWNER APPLICANT,BUSINESS OWNER', 'DPD_PERMIT_ISSUED', eParamHashtable, 'Construction Permit', rParamHashtable, 'Y', 'New Report Name'); //full
*/
function emailContactsWithReportLinkASync(pSendEmailToContactTypes, pEmailTemplate, pEParams, pReportTemplate, pRParams, pAddAdHocTask, pChangeReportName) {
	var conTypeArray = [];
	var validConTypes = getConfiguredContactTypes();
	var x = 0;
	var vConType;
	var vAsyncScript = "SEND_EMAIL_TO_CONTACTS_ASYNC_ETECH";
	var envParameters = aa.util.newHashMap();
		
	//Initialize optional parameters	
	var vEParams = aa.util.newHashtable();
	var vReportTemplate = "";
	var vRParams = aa.util.newHashtable();
	var vAddAdHocTask = true;
	var vChangeReportName = "";	

	if (pEParams != undefined && pEParams != null && pEParams != "") {
		logDebug("pEParams is defined");
		vEParams = pEParams;
	}
	
	if (pReportTemplate != undefined && pReportTemplate != null && pReportTemplate != "") {
		logDebug("pReportTemplate is defined");
		vReportTemplate = pReportTemplate;
	}

	if (pRParams != undefined && pRParams != null && pRParams != "") {
		logDebug("pRParams is defined");
		vRParams = pRParams;
	}
	
	if (pAddAdHocTask != undefined && pAddAdHocTask != null && pAddAdHocTask != "") {
		logDebug("pAddAdHocTask is defined");
		if (pAddAdHocTask == "N") {
			vAddAdHocTask = false;
		} else if (pAddAdHocTask == false) {
			vAddAdHocTask = false;
		}
	}
	
	if (pChangeReportName != undefined && pChangeReportName != null && pChangeReportName != "") {
		logDebug("pChangeReportName is defined");
		vChangeReportName = pChangeReportName;
	}
    
    var itemCap = capId;
    if (arguments.length == 8){
        if (arguments[7] != null){
            logDebug("Using capId: " + arguments[7]);
            itemCap = arguments[7];
        }
    }	
	
	logDebug("Provided contact types to send to: " + pSendEmailToContactTypes);

	//Check to see if provided contact type(s) is/are valid
	if (pSendEmailToContactTypes != "All" && pSendEmailToContactTypes != null && pSendEmailToContactTypes != '') {
		conTypeArray = pSendEmailToContactTypes.split(",");
	}
	for (x in conTypeArray) {
		//check all that are not "Primary"
		vConType = conTypeArray[x];
		if (vConType != "Primary" && !exists(vConType, validConTypes)) {
			logDebug(vConType + " is not a valid contact type. No actions will be taken for this type.");
			conTypeArray.splice(x, (x + 1));
		}
	}
	//Check if any types remain. If not, don't continue processing
	if ((pSendEmailToContactTypes != "All" && pSendEmailToContactTypes != null && pSendEmailToContactTypes != '') && conTypeArray.length <= 0) {
		logDebug(vConType + " is not a valid contact type. No actions will be taken for this type.");
		return false;
	} else if ((pSendEmailToContactTypes != "All" && pSendEmailToContactTypes != null && pSendEmailToContactTypes != '') && conTypeArray.length > 0) {
		pSendEmailToContactTypes = conTypeArray.toString();
	}

	logDebug("Validated contact types to send to: " + pSendEmailToContactTypes);
	
	//Save variables to the hash table and call sendEmailASync script. This allows for the email to contain an ACA deep link for the document
	envParameters.put("sendEmailToContactTypes", pSendEmailToContactTypes);
	envParameters.put("emailTemplate", pEmailTemplate);
	envParameters.put("vEParams", vEParams);
	envParameters.put("reportTemplate", vReportTemplate);
	envParameters.put("vRParams", vRParams);
	envParameters.put("vChangeReportName", vChangeReportName);
	envParameters.put("CapId", itemCap);
	envParameters.put("vAddAdHocTask", vAddAdHocTask);

	//Start modification to support batch script
	var vEvntTyp = aa.env.getValue("eventType");
	if (vEvntTyp == "Batch Process") {
		aa.env.setValue("sendEmailToContactTypes", pSendEmailToContactTypes);
		aa.env.setValue("emailTemplate", pEmailTemplate);
		aa.env.setValue("vEParams", vEParams);
		aa.env.setValue("reportTemplate", vReportTemplate);
		aa.env.setValue("vRParams", vRParams);
		aa.env.setValue("vChangeReportName", vChangeReportName);
		aa.env.setValue("CapId", itemCap);
		aa.env.setValue("vAddAdHocTask", vAddAdHocTask);
		//call sendEmailASync script
		logDebug("Attempting to run Non-Async: " + vAsyncScript);
		aa.includeScript(vAsyncScript);
	} else {
		//call sendEmailASync script
		logDebug("Attempting to run Async: " + vAsyncScript);
		aa.runAsyncScript(vAsyncScript, envParameters);
	}
	//End modification to support batch script

	return true;
}
