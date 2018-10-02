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
		
		var emailTemplateName = 'PW LIC AGR RENEWAL #163', daysAhead = 60;

		aa.env.setValue("EMAIL_TEMPLATE", 'PW LIC AGR RENEWAL #163');
		aa.env.setValue("DAYS_AHEAD", 60);
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
			emailTemplateName = "PW LIC AGR RENEWAL #163";
		} 
		var daysAhead = aa.env.getValue("DAYS_AHEAD");
		if (!daysAhead) {
				daysAhead = 60;
		}
		sendCertificateofInsuranceExpirationNotification(emailTemplateName, daysAhead, "Certificate of Insurance Expiration Date");

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
	LogBatchDebug("LOG", "Looking for records that will expire in 60 days on the date " +  dateAdd(null, daysAhead), true);
	var capListResult = aa.cap.getByAppType("PublicWorks", "Real Property", "License Agreement", "NA");
	if(!capListResult.getSuccess()) {LogBatchDebug("DEBUG", "Unable to get records " + capListResult.getErrorMessage(), true); return ; }
	
	capIdScriptModelList = capListResult.getOutput();
	
	LogBatchDebug("LOG", "**INFO Total Records = " + capIdScriptModelList.length, true);
	var olduseAppSpecificGroupName = useAppSpecificGroupName;
	useAppSpecificGroupName = false;
	for (r in capIdScriptModelList) {
		capId = capIdScriptModelList[r].getCapID();
		var capOutput = aa.cap.getCap(capId).getOutput();
		var capStatus = capOutput.getCapStatus();
		LogBatchDebug("LOG", "**INFO Processing Record: " + capOutput.getCapModel().getAltID(), true);
		if(capStatus != "Withdrawn") {
		   var certInsExpDate = getAppSpecific(asiFieldName);
		   if (certInsExpDate == null || certInsExpDate == "") {
				   LogBatchDebug("LOG", "**WARN 'Certificate of Insurance Expiration Date' is null, SKIP...", true);
				   continue;
			}
		   
			var currDate = aa.util.parseDate(dateAdd(null, 0));
			certInsExpDate = aa.util.parseDate(certInsExpDate);
			var expDiff = days_between(certInsExpDate, currDate);
			expDiff = parseInt(expDiff);
			if (expDiff == daysAhead) {

				//Send the email  -- owners don't have emails all the time so making applicant the Toemail and adding owner email to cc email
				var applicantEmail = null, projectOwnerEmail = null, insuranceAgencyEmail = null;
				
				//find applicant email
				var recordApplicant = getContactByType("Applicant", capId);
				if (recordApplicant) {
					applicantEmail = recordApplicant.getEmail();
					//LogBatchDebug("LOG", "Applicant Email: " + applicantEmail, true);
				}
				
				//find insurance agency email
				var recordInsuranceAgency = getContactByType("Insurance Agency", capId);
				if (recordInsuranceAgency) {
					insuranceAgencyEmail = recordInsuranceAgency.getEmail();
					//LogBatchDebug("LOG", "Insurance Agency Email: " + insuranceAgencyEmail);
				}
				
				//find project owner email
				var recordProjectOwner = getContactByType("Project Owner", capId);
				if (recordProjectOwner) {
					projectOwnerEmail = recordProjectOwner.getEmail();
					//LogBatchDebug("LOG", "Project Owner Email: " + projectOwnerEmail);
				}

				//build CC email list
				var ccEmail = "";
				if (insuranceAgencyEmail != null && insuranceAgencyEmail != "") {
					ccEmail = insuranceAgencyEmail;
				}
				if (applicantEmail != null && applicantEmail != "") {
					if (ccEmail != "") {
						ccEmail += ";" + applicantEmail;
					} else {
						ccEmail = applicantEmail;
					}
				}
					   
				var acaURLDefault = lookup("ACA_CONFIGS", "ACA_SITE");
				acaURLDefault = acaURLDefault.substr(0, acaURLDefault.toUpperCase().indexOf("/ADMIN"));
				var recordURL = getACARecordURL(acaURLDefault);
					   
				var thisCap = aa.cap.getCap(capId).getOutput();
				var eParams = aa.util.newHashtable();
				addParameter(eParams, "$$altID$$", thisCap.getCapModel().getAltID());
				addParameter(eParams, "$$acaRecordUrl$$", recordURL);
				//addParameter(eParams, "$$recordAlias$$", thisCap.getCapType().getAlias());
				//addParameter(eParams, "$$recordStatus$$", thisCap.getCapStatus());					   
				
				var sent = sendNotification("",projectOwnerEmail, ccEmail, emailTemplateName, eParams, null); 
				if (!sent) {
					LogBatchDebug("LOG", "**WARN sending email failed, error:" + sent.getErrorMessage(), true);
				}
				else {
					LogBatchDebug("LOG", "Email Sent successfully for record " + thisCap.getCapModel().getAltID(), true);
				}				
						
				//var sent = aa.document.sendEmailByTemplateName("", projOwner, cc, emailTemplateName, eParams, null);
				//if (!sent.getSuccess()) {
					//logDebug("**WARN sending email failed, error:" + sent.getErrorMessage());
				//}
				// else
					//LogBatchDebug("LOG", "Email Sent successfully for record " + thisCap.getCapModel().getAltID());
			} else {
				LogBatchDebug("LOG", "**WARN 'Certificate of Insurance Expiration Date' is not 60 days out, SKIP...", true);
			}
		}
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