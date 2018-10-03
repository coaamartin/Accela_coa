/*
emailWithReportLinkASync
Required Params:
	pSendToEmailAddresses = comma-separated list of email addresses to send to, no spaces.
	pEmailTemplate = notification template name
Optional Params:
	vEParams = parameters to be filled in notification template
	reportTemplate = if provided, will run report and attach (per report manager settings) and include a link to it in the email
	vRParams  = report parameters
	changeReportName = if using reportTemplate, will change the title of the document produced by the report from its default

Sample: 
	emailWithReportLinkASync('ewylam@etechconsultingllc.com', 'DPD_WAITING_FOR_PAYMENT'); //minimal
	emailWithReportLinkASync('ewylam@etechconsultingllc.com, jschillo@etechconsultingllc.com', 'DPD_PERMIT_ISSUED', eParamHashtable, 'Construction Permit', rParamHashtable, 'New Report Name'); //full
*/
function emailWithReportLinkASync(pSendToEmailAddresses, pEmailTemplate, pEParams, pReportTemplate, pRParams, pAddAdHocTask, pChangeReportName) {
	var x = 0;
	var vAsyncScript = "SEND_EMAIL_ASYNC_ETECH";
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

	//Save variables to the hash table and call sendEmailASync script. This allows for the email to contain an ACA deep link for the document
	envParameters.put("sendToEmailAddresses", pSendToEmailAddresses);
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
		aa.env.setValue("sendToEmailAddresses", pSendToEmailAddresses);
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
