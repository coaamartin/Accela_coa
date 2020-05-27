//Get environmental variables pass into the script
// var sendEmailToAddresses = aa.env.getJobParam("emailSendTo");
// var emailTemplate = "Report_Test_Email";
// var vEParams = aa.env.getValue("vEParams");
// var reportTemplate = getJobParam("reportName");
// var vRParams = aa.env.getValue("vRParams");
// var vChangeReportName = aa.env.getValue("vChangeReportName");
// var capId = aa.env.getValue("CapId");
// var adHocTaskContactsList = aa.env.getValue("adHocTaskContactsList");

//Testing script without getJobParam
var sendEmailToAddresses = "rprovinc@auroragov.org";
var emailTemplate = "Report_Test_Email";
//var vEParams = aa.env.getValue("vEParams");
//var reportTemplate = getJobParam("reportName");
//var vRParams = aa.env.getValue("vRParams");
//var vChangeReportName = aa.env.getValue("vChangeReportName");
//ar capId = aa.env.getValue("CapId");
//var adHocTaskContactsList = aa.env.getValue("adHocTaskContactsList");

//Constant variables used in the script
var CONST_ADHOC_PROCESS = "ADHOC_WORKFLOW";
var CONST_ADHOC_TASK = "Manual Notification";



/*------------------------------------------------------------------------------------------------------/
| INCLUDE SCRIPTS (Core functions, batch includes, custom functions)
/------------------------------------------------------------------------------------------------------*/
SCRIPT_VERSION = 3.0;
var useSA = false;
var SA = null;
var SAScript = null;
var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_FOR_EMSE");
if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") {
	useSA = true;
	SA = bzr.getOutput().getDescription();
	bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_INCLUDE_SCRIPT");
	if (bzr.getSuccess()) {
		SAScript = bzr.getOutput().getDescription();
	}
}

if (SA) {
	eval(getMasterScriptText("INCLUDES_ACCELA_FUNCTIONS", SA));
	eval(getMasterScriptText(SAScript, SA));
} else {
	eval(getMasterScriptText("INCLUDES_ACCELA_FUNCTIONS"));
}

eval(getScriptText("INCLUDES_BATCH"));
//eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));
//eval(getScriptText("INCLUDES_CUSTOM", null, true));
eval(getMasterScriptText("INCLUDES_CUSTOM"));
/*------------------------------------------------------------------------------------------------------/
| <===========internal functions - do not modify ================>
/-----------------------------------------------------------------------------------------------------*/
function getMasterScriptText(vScriptName) {
	var servProvCode = aa.getServiceProviderCode();
	if (arguments.length > 1)
		servProvCode = arguments[1]; // use different serv prov code
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
		return emseScript.getScriptText() + "";
	} catch (err) {
		return "";
	}
}

function getScriptText(vScriptName) {
	var servProvCode = aa.getServiceProviderCode();
	if (arguments.length > 1)
		servProvCode = arguments[1]; // use different serv prov code
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		var emseScript = emseBiz.getScriptByPK(servProvCode, vScriptName, "ADMIN");
		return emseScript.getScriptText() + "";
	} catch (err) {
		return "";
	}
}


/*------------------------------------------------------------------------------------------------------/
| CORE EXPIRATION BATCH FUNCTIONALITY
/------------------------------------------------------------------------------------------------------*/
try {
	showMessage = false;
	showDebug = true;
	if (String(aa.env.getValue("showDebug")).length > 0) {
		showDebug = aa.env.getValue("showDebug").substring(0, 1).toUpperCase().equals("Y");
	}

	sysDate = aa.date.getCurrentDate();
	var startDate = new Date();
	var startTime = startDate.getTime(); // Start timer
	var systemUserObj = aa.person.getUser("ADMIN").getOutput();

	sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(), sysDate.getDayOfMonth(), sysDate.getYear(), "");
	batchJobResult = aa.batchJob.getJobID();
	batchJobName = "" + aa.env.getValue("BatchJobName");
	batchJobID = 0;

	if (batchJobResult.getSuccess()) {
		batchJobID = batchJobResult.getOutput();
		logDebug("Batch Job " + batchJobName + " Job ID is " + batchJobID);
	} else {
		logDebug("Batch job ID not found " + batchJobResult.getErrorMessage());
	}

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

	//2. Send Email, if needed
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
