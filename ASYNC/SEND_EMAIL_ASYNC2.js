//THIS IS SAME AS SEN_EMAIL_ASYNC BUT IT HAS THE FOLOWING ADDITON:
//  IF !sendEmailToAddresses && emailTemplate THEN USE TO ADDRESS FROM EMAIL NOTIFICATION TEMPLATE

//Get environmental variables pass into the script
var sendEmailToAddresses = aa.env.getValue("sendEmailToAddresses");
var emailTemplate = aa.env.getValue("emailTemplate");
var vEParams = aa.env.getValue("vEParams");
var reportTemplate = aa.env.getValue("reportTemplate");
var vRParams = aa.env.getValue("vRParams");
var vChangeReportName = aa.env.getValue("vChangeReportName");
var capId = aa.env.getValue("CapId");
var adHocTaskContactsList = aa.env.getValue("adHocTaskContactsList");

//Constant variables used in the script
var CONST_ADHOC_PROCESS = "ADHOC_WORKFLOW";
var CONST_ADHOC_TASK = "Manual Notification";

try {
	//Start modification to support batch script, if not batch then grab globals, if batch do not.
	if (aa.env.getValue("eventType") != "Batch Process") {
		// Begin Code needed to call master script functions ---------------------------------------------------
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
	}
	//End Code needed to call master script functions -----------------------------------------------------

	logDebug("1) Here in SEND_EMAIL_ASYNC. Event Type: " + aa.env.getValue("eventType"));
	logDebug("2) sendEmailToAddresses: " + sendEmailToAddresses);
	logDebug("3) emailTemplate: " + emailTemplate);
	logDebug("4) reportTemplate: " + reportTemplate);
	logDebug("5) adHocTaskContactsList: " + adHocTaskContactsList);

	//1. Handle report, if needed
	if (reportTemplate != null && reportTemplate != '') {
		//Generate report and get report name
		if (vRParams == null) {
			vRParams = aa.util.newHashtable();
		}
		var vReportName = generateReportForEmail(capId, reportTemplate, aa.getServiceProviderCode(), vRParams);
		//logDebug("Generated report " + vReportName);
		if (vReportName != null && vReportName != false) {
			//Update the report name if one was provided.
			if (vChangeReportName != null && vChangeReportName != "") {
				logDebug("Renaming generated report document name from " + vReportName + " to " + vChangeReportName);
				if (editDocumentName(vReportName, vChangeReportName) == true) {
					vReportName = vChangeReportName;
				}
			}
			//Get document deep link URL, add to email params
			var vACAUrl = lookup("ACA_CONFIGS", "ACA_SITE");
			vACAUrl = vACAUrl.substr(0, vACAUrl.toUpperCase().indexOf("/ADMIN"));
			var vDocumentList = aa.document.getDocumentListByEntity(capId, "CAP").getOutput();
			if (vDocumentList != null) {
				for (y = 0; y < vDocumentList.size(); y++) {
					var vDocumentModel = vDocumentList.get(y);
					if (vDocumentModel.getFileName() == vReportName) {
						//Add the document url to the email paramaters using the name: $$acaDocDownloadUrl$$
						getACADocDownloadParam4Notification(vEParams, vACAUrl, vDocumentModel);
						//logDebug("including document url: " + vEParams.get('$$acaDocDownloadUrl$$'));
						break;
					}
				}
			}
		}
    }
    
    //2.1 Get Email TO from template, if not specified
	if (!sendEmailToAddresses) {
		if (emailTemplate && emailTemplate != '') {
			var tmpl = aa.communication.getNotificationTemplate(emailTemplate).getOutput();
            sendEmailToAddresses = tmpl.getEmailTemplateModel().getTo();
            if(sendEmailToAddresses) {
                //this part replaces semicolons with commas (its commmon to deliminate with semicolons, but this function expects comma deliminated)
                sendEmailToAddresses = sendEmailToAddresses.replace(";", "'")
            }
		}
    }

	//2.2 Send Email, if needed
	if (sendEmailToAddresses && sendEmailToAddresses != '') {
		//Get From email from template configuration
		var mailFrom;
		if (emailTemplate && emailTemplate != '') {
			var tmpl = aa.communication.getNotificationTemplate(emailTemplate).getOutput();
			mailFrom = tmpl.getEmailTemplateModel().getFrom();
		}
		logDebug("mailFrom = " + mailFrom);

		//Add standard email variables from record information
		vEParams = addStdVarsToEmail(vEParams, capId);

		logDebug("added standard vars to email");

		//Get the capId type needed for the email function
		var capId4Email = aa.cap.createCapIDScriptModel(capId.getID1(), capId.getID2(), capId.getID3());

		//Loop through the email addresses and send to each
		var arEmails = sendEmailToAddresses.split(',');
		logDebug("arEmails.length = " + arEmails.length);
		var sentTo = []; //Prevent duplicates
		for (var i = 0; i < arEmails.length; i++) {
			var thisEmail = arEmails[i];
			if (!exists(thisEmail.toUpperCase(), sentTo)) {
				logDebug("SEND_EMAIL_ASYNC: " + capId.getCustomID() + ": Sending " + emailTemplate + " from " + mailFrom + " to " + thisEmail);
				//**Note we won't have contact specific email parameters like contact name, since we have no contact object, just email address
				//vEParamsToSend = vConObj.getEmailTemplateParams(vEParams);
				logDebug("Email Sent: " + aa.document.sendEmailAndSaveAsDocument(mailFrom, thisEmail, "", emailTemplate, vEParams, capId4Email, null).getSuccess());
				sentTo.push(thisEmail.toUpperCase());
			}
		}
	}

} catch (err) {
	logDebug("Error in Send_Email_ASYNC.js");
}
