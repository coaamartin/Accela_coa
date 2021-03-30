/*
When any fees are Invoiced in the Fee Tab, it needs to email the applicant and the contractor (including license professionals)
that fees are owed and they can click the link to go online to login to their account to view and pay their fees. 

Written by JMAIN
*/
if (balanceDue > 0) {
  //email the applicant
// logDebug("Email to: " + emailTo);
//   var emailTo1 = emailTo;
  var contacts = "Applicant";
  var emailTo = contacts;
  var lptypes = "Contractor";
  var emailtemplate = "BLD_INVOICEDFEES";
  var tParams = aa.util.newHashtable();
	tParams.put("$$todayDate$$", thisDate);
    tParams.put("$$altid$$", recordID);
    tParams.put("$$Record Type$$", capAlias);
    tParams.put("$$capAlias$$", capAlias);
    tParams.put("$$FirstName$$", firstName);
    tParams.put("$$LastName$$", lastName);
  //emailContactsWithReportLinkASync(contacts, emailtemplate, "", "", "", "N", "");
  sendNotification("noreply@auroragov.org", emailTo, "", emailtemplate, tParams, null);
  //coa_emailLicenseProfessionals(lptypes, emailtemplate, "", "", "", capId);
  logDebug("End of email to send");
}
logDebug("End of 5043_BuildingEmailInvoicedFees.js");

