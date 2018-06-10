/*
emailContacts
  Required Params:
     sendEmailToContactTypes = comma-separated list of contact types to send to, no spaces
     emailTemplate = notification template name
  Optional Params: (use blank string, not null, if missing!)
     vEParams = parameters to be filled in notification template
     reportTemplate = if provided, will run report and attach to record and include a link to it in the email
     vRParams  = report parameters
	 vAddAdHocTask = Y/N for adding manual notification task when no email exists
     changeReportName = if using reportTemplate, will change the title of the document produced by the report from its default
Sample: emailContacts('OWNER APPLICANT', 'DPD_WAITING_FOR_PAYMENT'); //minimal
        emailContacts('OWNER APPLICANT,BUSINESS OWNER', 'DPD_PERMIT_ISSUED', eParamHashtable, 'Construction Permit', rParamHashtable, 'Y', 'New Report Name'); //full
 */
function emailContacts(sendEmailToContactTypes, emailTemplate, vEParams, reportTemplate, vRParams) {
	var vChangeReportName = "";
	var conTypeArray = [];
	var validConTypes = getContactTypes();
	var x = 0;
	var vConType;
	var vAsyncScript = "SEND_EMAIL_TO_CONTACTS_ASYNC";
	var envParameters = aa.util.newHashMap();
	var vAddAdHocTask = true;

	//Ad-hoc Task Requested
	if (arguments.length > 5) {
		vAddAdHocTask = arguments[5]; // use provided prefrence for adding an ad-hoc task for manual notification
		if (vAddAdHocTask == "N") {
logDebug("No adhoc task");			
			vAddAdHocTask = false;
		}
	}
	
	//Change Report Name Requested
	if (arguments.length > 6) {
		vChangeReportName = arguments[6]; // use provided report name
	}

logDebug("Provided contact types to send to: " + sendEmailToContactTypes);
	
	//Check to see if provided contact type(s) is/are valid
	if (sendEmailToContactTypes != "All" && sendEmailToContactTypes != null && sendEmailToContactTypes != '') {
		conTypeArray = sendEmailToContactTypes.split(",");
	}
	for (x in conTypeArray) {
		//check all that are not "Primary"
		vConType = conTypeArray[x];
		if (vConType != "Primary" && !exists(vConType, validConTypes)) {
			logDebug(vConType + " is not a valid contact type. No actions will be taken for this type.");
			conTypeArray.splice(x, (x+1));
		}
	}
	//Check if any types remain. If not, don't continue processing
	if ((sendEmailToContactTypes != "All" && sendEmailToContactTypes != null && sendEmailToContactTypes != '') && conTypeArray.length <= 0) {
		logDebug(vConType + " is not a valid contact type. No actions will be taken for this type.");
		return false;	
	}
	else if((sendEmailToContactTypes != "All" && sendEmailToContactTypes != null && sendEmailToContactTypes != '') && conTypeArray.length > 0) {
		sendEmailToContactTypes = conTypeArray.toString();
	}
	
logDebug("Validated contact types to send to: " + sendEmailToContactTypes);	
	//Save variables to the hash table and call sendEmailASync script. This allows for the email to contain an ACA deep link for the document
	envParameters.put("sendEmailToContactTypes", sendEmailToContactTypes);
	envParameters.put("emailTemplate", emailTemplate);
	envParameters.put("vEParams", vEParams);
	envParameters.put("reportTemplate", reportTemplate);
	envParameters.put("vRParams", vRParams);
	envParameters.put("vChangeReportName", vChangeReportName);
	envParameters.put("CapId", capId);
	envParameters.put("vAddAdHocTask", vAddAdHocTask);
	
	//Start modification to support batch script
	var vEvntTyp = aa.env.getValue("eventType");
	if (vEvntTyp == "Batch Process") {
		aa.env.setValue("sendEmailToContactTypes", sendEmailToContactTypes);
		aa.env.setValue("emailTemplate", emailTemplate);
		aa.env.setValue("vEParams", vEParams);
		aa.env.setValue("reportTemplate", reportTemplate);
		aa.env.setValue("vRParams", vRParams);
		aa.env.setValue("vChangeReportName", vChangeReportName);
		aa.env.setValue("CapId", capId);
		aa.env.setValue("vAddAdHocTask", vAddAdHocTask);		
		//call sendEmailASync script
		logDebug("Attempting to run Non-Async: " + vAsyncScript);
		aa.includeScript(vAsyncScript);
	}
	else {
		//call sendEmailASync script
		logDebug("Attempting to run Async: " + vAsyncScript);
		aa.runAsyncScript(vAsyncScript, envParameters);
	}
	//End modification to support batch script
	
	return true;
}