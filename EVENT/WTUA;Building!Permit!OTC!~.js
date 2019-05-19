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
    var lpEmail = getPrimLPEmailByCapId(capId);
    addParameter(eParams, "$$LicenseProfessionalEmail$$", lpEmail);
    emailContacts("Applicant", issuedEmlTemplate, eParams, reportTemplate, reportParams);
    if(lpEmail != null)
		{
		emailContactsIncludesLP("PRIMARYLP", issuedEmlTemplate, eParams, reportTemplate, reportParams);
		}            
}