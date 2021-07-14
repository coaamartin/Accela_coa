/*
Title : //WTUA:Building/Permit/OTC/*

Purpose : Send Permit Email if manually issued.

Author: Keith
 
Functional Area : Records - Issue Permit Email


*/

var applicant = getContactByType("Applicant", capId);
var applicantEmail = getContactEmailAddress("Applicant", capId);
var issuedEmlTemplate = "BLD PERMIT ISSUED # 35";    
var reportTemplate = "Building Permit"
var reportParams = aa.util.newHashtable();
addParameter(reportParams, "RecordID", capIDString);

var reportTemplate = "Building Permit";
var reportParams = aa.util.newHashtable();
addParameter(reportParams, "RecordID", capIDString);

var acaURLDefault = lookup("ACA_CONFIGS", "ACA_SITE");
acaURLDefault = acaURLDefault.substr(0, acaURLDefault.toUpperCase().indexOf("/ADMIN"));
var recordURL = getACARecordURL(acaURLDefault);
    
var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
var reportFile = [];

var eParams = aa.util.newHashtable();
addParameter(eParams, "$$altID$$", capIDString);
addParameter(eParams, "$$ContactFullName$$", applicant.getFullName());
addParameter(eParams, "$$recordAlias$$", appTypeAlias);
addParameter(eParams, "$$acaRecordUrl$$", recordURL);

   
if(wfTask == "Permit Issuance" && wfStatus == "Issued"){

    //send email()
    //need to also send the permit to the customer once fees have been paid
			logDebug("Starting to kick off event to send permit to customer");
			var altID2 = capId.getCustomID();
			appType2 = cap.getCapType().toString();
			var vAsyncScript2 = "SEND_EMAIL_BLD_OTC_PERMIT";
			var envParameters2 = aa.util.newHashMap();
			envParameters2.put("altID", altID2);
			envParameters2.put("capId", capId);
			envParameters2.put("cap", cap);
			envParameters2.put("appType", appType2);
			logDebug("Starting to kick off ASYNC event for OTC Permit issuance. Params being passed: " + envParameters2);
			aa.runAsyncScript(vAsyncScript2, envParameters2);
    // var lpEmail = getPrimLPEmailByCapId(capId);
    // addParameter(eParams, "$$LicenseProfessionalEmail$$", lpEmail);
    // emailContacts("Applicant", issuedEmlTemplate, eParams, reportTemplate, reportParams);
    // if(lpEmail != null)
		// {
		// emailContactsIncludesLP("PRIMARYLP", issuedEmlTemplate, eParams, reportTemplate, reportParams);
		//}            
}

if(wfStatus == "Cancelled"){
    logDebug("Building Permit OTC, Cancelled.");
	include("5135_BLD_Withdrawn");
	logDebug("Email was sent for cancelled.");
}