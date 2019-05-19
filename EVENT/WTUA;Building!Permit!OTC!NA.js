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