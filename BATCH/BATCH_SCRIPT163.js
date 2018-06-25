/*
Title : Certificate of Insurance Expiration Notification (Batch)

Purpose : If the custom field Certificate of Insurance Expiration Date is 60 days away then send an email
notification(Email template to be provided by Aurora) to the owner and the Insurance Agency contact on the record letting
them know they need to upload a new Certificate of Insurance.

Author: Yazan Barghouth
 
Functional Area : Records

BATCH Parameters:
	- EMAIL_TEMPLATE (Required): template to be used to send email
	- DAYS_AHEAD (Optional): value to check if n days away, if not set, default 60

Notes:
	- Email to Owner, CC Insurance Agency
	- Email Variables: $$altID$$,$$recordAlias$$,$$recordStatus$$
*/

function getScriptText(e) {
	var t = aa.getServiceProviderCode();
	if (arguments.length > 1)
		t = arguments[1];
	e = e.toUpperCase();
	var n = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		var r = n.getScriptByPK(t, e, "ADMIN");
		return r.getScriptText() + ""
	} catch (i) {
		return ""
	}
}

var SCRIPT_VERSION = 3.0;
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));

var capId = null;
try {
	var emailTemplateName = aa.env.getValue("EMAIL_TEMPLATE");
	if (!emailTemplateName || emailTemplateName == null || emailTemplateName == "") {
		emailTemplateName = 'PW LIC AGR RENEWAL #163';
	//	logDebug("**ERROR Parameter 'EMAIL_TEMPLATE' not defined");
	} else {

		var daysAhead = aa.env.getValue("DAYS_AHEAD");
		if (!daysAhead) {
			daysAhead = 60;
		}

		sendCertificateofInsuranceExpirationNotification(emailTemplateName, daysAhead, "Certificate of Insurance Expiration Date");
	}
} catch (ex) {
	logDebug("**ERROR batch failed, error: " + ex);
}

/**
 * sends email to Owner and 'Insurance Agency' contact if asiField value is n days away
 * @param emailTemplateName
 * @param daysAhead
 * @param asiFieldName to get Date value and compare with
 */
function sendCertificateofInsuranceExpirationNotification(emailTemplateName, daysAhead, asiFieldName) {
	var currDate = aa.util.parseDate(dateAdd(null, 0));
	var cutoffDate = aa.util.parseDate(dateAdd(null, daysAhead));
	logDebug("Looking for records that will expire in 60 days on the date " +  formatDateToMMDDYYYY(cutoffDate));

	var capListResult = aa.cap.getByAppType("PublicWorks", "Real Property", "License Agreement", "NA");
	if(!capListResult.getSuccess()) {LogBatchDebug("DEBUG", "Unable to get records " + capListResult.getErrorMessage(), true); return ; }
	
	capIdScriptModelList = capListResult.getOutput();
	
	logDebug("**INFO total records=" + capIdScriptModelList.length);
	var olduseAppSpecificGroupName = useAppSpecificGroupName;
	useAppSpecificGroupName = false;
	for (r in capIdScriptModelList) {
		capId = capIdScriptModelList[r].getCapID();
		logDebug("**INFO -------------- " + capId);
		var certInsExpDate = getAppSpecific(asiFieldName);
		if (certInsExpDate == null || certInsExpDate == "") {
			logDebug("**WARN 'Certificate of Insurance Expiration Date' is null, SKIP...");
			continue;
		}
		
        certInsExpDate = aa.util.parseDate(certInsExpDate);
		if (expDiff == cutoffDate) {
			var cc = getContactByType("Insurance Agency", capId);
			if (!cc) {
				cc = "";
			} else {
				cc = cc.getEmail();
			}
			
			var projOwner = getContactByType("Project Owner", capId);
			if (!projOwner) {
				projOwner = "";
			} else {
				projOwner = projOwner.getEmail();
			}
			
			var acaURLDefault = lookup("ACA_CONFIGS", "ACA_SITE");
            acaURLDefault = acaURLDefault.substr(0, acaURLDefault.toUpperCase().indexOf("/ADMIN"));
            var recordURL = getACARecordURL(acaURLDefault);
			
			var thisCap = aa.cap.getCap(capId).getOutput();
			var eParams = aa.util.newHashtable();
			addParameter(eParams, "$$altID$$", thisCap.getCapModel().getAltID());
			//addParameter(eParams, "$$recordAlias$$", thisCap.getCapType().getAlias());
			//addParameter(eParams, "$$recordStatus$$", thisCap.getCapStatus());
            addParameter(eParams, "$$acaRecordUrl$$", recordURL);
			

			var sent = aa.document.sendEmailByTemplateName("", projOwner, cc, emailTemplateName, eParams, null);
			if (!sent.getSuccess()) {
				logDebug("**WARN sending email failed, error:" + sent.getErrorMessage());
			}
			else
				LogBatchDebug("LOG", "Email Sent successfully for record " + thisCap.getCapModel().getAltID());
		}//60 days
	}//for all caps
	useAppSpecificGroupName = olduseAppSpecificGroupName;
}



function LogBatchDebug(etype, edesc, createEventLog) {

	var msg = etype + " : " + edesc;

	if (etype == "ERROR") {
		msg = "<font color='red' size=2>" + msg + "</font><BR>"
	} else {
		msg = "<font color='green' size=2>" + msg + "</font><BR>"
	}
	if (etype == "DEBUG") {

		aa.print(msg);

	} else {
		aa.print(msg);
	}
	debug += msg;
}

function formatDateToMMDDYYYY (date) {
	var yyyy = date.getFullYear().toString(),
		mm = (date.getMonth() + 1).toString(),
		dd = date.getDate().toString();

	// CONVERT mm AND dd INTO chars
	var mmChars = mm.split(''),
		ddChars = dd.split('');

	// CONCAT THE STRINGS IN YYYY-MM-DD FORMAT
	return datestring = (mmChars[1] ? mm : "0" + mmChars[0]) + '/' + (ddChars[1] ? dd : "0" + ddChars[0]) + '/' + yyyy;
};
