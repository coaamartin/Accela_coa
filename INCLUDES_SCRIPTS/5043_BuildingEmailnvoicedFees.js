/*
When any fees are Invoiced in the Fee Tab, it needs to email the applicant and the contractor (including license professionals)
that fees are owed and they can click the link to go online to login to their account to view and pay their fees. 

Written by JMAIN
*/
logDebug("Start of 5043_BuildingEmailInvoicedFees.js");

//if (balanceDue > 0) {
  
  //email the applicant
  var recordApplicant = getContactByType("Applicant", capId);
	var applicantEmail = null;
	if (!recordApplicant || recordApplicant.getEmail() == null || recordApplicant.getEmail() == "") {
		logDebug("**WARN no applicant or applicant has no email, capId=" + capId);
	} else {
		applicantEmail = recordApplicant.getEmail();
	}
var emailTo = applicantEmail;
logDebug("Email to: " + emailTo);
var emailTo1 = emailTo;
  //var contacts = "Applicant,Contractor(s)";
  //var lptypes = "Contractor";
  var vEmailTemplate = "BLD_INVOICEDFEES";
  //emailContactsWithReportLinkASync(contacts, emailtemplate, "", "", "", "N", "");
  //coa_emailLicenseProfessionals(lptypes, emailtemplate, "", "", "", capId);
  sendNotification("noreply@auroragov.org", emailTo1, "", vEmailTemplate, "", null);
  logDebug("End of email to send");
//}
logDebug("End of 5043_BuildingEmailInvoicedFees.js");