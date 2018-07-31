try {
	//Get environmental variables passed into the script
	var sendToEmailAddresses = aa.env.getValue("sendToEmailAddresses");
	var emailTemplate = aa.env.getValue("emailTemplate");
	var vEParams = aa.env.getValue("vEParams");
	var reportTemplate = aa.env.getValue("reportTemplate");
	var vRParams = aa.env.getValue("vRParams");
	var vChangeReportName = aa.env.getValue("vChangeReportName");
	var capId = aa.env.getValue("CapId");

	//Set variables used in the script
	var tmpl;
	var emailArray = sendToEmailAddresses.split(",");
	var v = 0;
	var w = 0;
	var x = 0;
	var y = 0;
	var z = 0;
	var conEmail;
	var mailFrom;
	var capId4Email;
	var vReportName;
	var vReportNameString;
	var vExtStart;
	var vFileExtension = "";	
	var vDocumentList;
	var vDocumentModel;
	var vDocumentName;
	var vDocumentNumber;
	var vACAUrl;
	var vDocumentACAUrl;
	var vEParamsToSend;
	var vModule;
	var vEmailResult;

	//Start modification to support batch script, if not batch then grab globals, if batch do not.
	if (aa.env.getValue("eventType") != "Batch Process") {
		/* Begin Code needed to call master script functions ---------------------------------------------------*/
		function getScriptText(vScriptName, servProvCode, useProductScripts) {
			if (!servProvCode)
				servProvCode = aa.getServiceProviderCode();
			vScriptName = vScriptName.toUpperCase();
			var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
			try {
				if (useProductScripts) {
					var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
				} else {
					var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
				}
				return emseScript.getScriptText() + "";
			} catch (err) {
				return "";
			}
		}
		var SCRIPT_VERSION = 3.0;
		aa.env.setValue("CurrentUserID", "ADMIN");
		eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, true));
		eval(getScriptText("INCLUDES_ACCELA_GLOBALS", null, true));
		eval(getScriptText("INCLUDES_CUSTOM", null, true));
	} else {
		var balanceDue;
		var capDetailObjResult = aa.cap.getCapDetail(capId);
		if (capDetailObjResult.getSuccess()) {
			capDetail = capDetailObjResult.getOutput();
			balanceDue = capDetail.getBalance();
		}
	}
	/* End Code needed to call master script functions -----------------------------------------------------*/

	logDebug("1) Here in SEND_EMAIL_ASYNC: " + aa.env.getValue("eventType"));
	logDebug("2) sendToEmailAddresses: " + sendToEmailAddresses);
	logDebug("3) emailTemplate: " + emailTemplate);
	logDebug("4) reportTemplate: " + reportTemplate);
	logDebug("5) balanceDue: " + balanceDue);
	
	//Add standard email variables from record information
	vEParams = addStdVarsToEmail(vEParams, capId);

	//get From email from template configuration
	if (emailTemplate && emailTemplate != '') {
		tmpl = aa.communication.getNotificationTemplate(emailTemplate).getOutput();
		mailFrom = tmpl.getEmailTemplateModel().getFrom();
	}

	//Get the capId type needed for the email function
	capId4Email = null;
	capId4Email = aa.cap.createCapIDScriptModel(capId.getID1(), capId.getID2(), capId.getID3());

	//Get ACA Url
	vACAUrl = lookup("ACA_CONFIGS", "ACA_SITE");
	vACAUrl = vACAUrl.substr(0, vACAUrl.toUpperCase().indexOf("/ADMIN"));

	//Generate report and get report name
	vReportName = false;
	if (reportTemplate != '' && reportTemplate != null) {
		//generate and get report file
		vReportName = generateReportForASyncEmail(capId, reportTemplate, aa.getServiceProviderCode(), vRParams);

		//update the report name if one was provided. this will be used to update the saved report's name
		if (vReportName != false && vChangeReportName != null && vChangeReportName != "") {
			vReportNameString = vReportName + "";
			vExtStart = vReportNameString.indexOf(".");
			if (vExtStart != -1) {
				vFileExtension = vReportNameString.substr(vExtStart, vReportNameString.length);
				vChangeReportName = vChangeReportName + vFileExtension;
			}

			if (editDocumentName(vReportName, vChangeReportName) == true) {
				vReportName = vChangeReportName;
			}
		}
	}

	//Get document deep link URL
	if (vReportName != null && vReportName != false) {
		vDocumentList = aa.document.getDocumentListByEntity(capId, "CAP");
		if (vDocumentList != null) {
			vDocumentList = vDocumentList.getOutput();
		}
	}

	if (vDocumentList != null) {
		for (y = 0; y < vDocumentList.size(); y++) {
			vDocumentModel = vDocumentList.get(y);
			vDocumentName = vDocumentModel.getFileName();
			if (vDocumentName == vReportName) {
				//Add the document url to the email parameters using the name: $$acaDocDownloadUrl$$
				getACADocDownloadParam4Notification(vEParams, vACAUrl, vDocumentModel);
				logDebug("including document url: " + vEParams.get('$$acaDocDownloadUrl$$'));
				//aa.print("including document url: " + vEParams.get('$$acaDocDownloadUrl$$'));
				break;
			}
		}
	}

	//Loop through the contact objects with email and send to each
	for (w in emailArray) {
		conEmail = emailArray[w];
		//get clean email parameters
		vEParamsToSend = vEParams;
		//Send email
		vEmailResult = aa.document.sendEmailAndSaveAsDocument(mailFrom, conEmail, "", emailTemplate, vEParamsToSend, capId4Email, null);
		if (vEmailResult.getSuccess()) { 
			logDebug("SEND_EMAIL_ASYNC: " + capId.getCustomID() + ": Sending " + emailTemplate + " from " + mailFrom + " to " + conEmail);
		} else {
			logDebug("Failed to send email " + emailTemplate + " to " + conEmail + " from " + mailFrom);
			logDebug("Error Message: " + vEmailResult.getErrorMessage());
		}
	}
} catch (err) {
	logDebug("Error in SEND_EMAIL_TO_CONTACTS_ASYNC : " + err.message);
}
