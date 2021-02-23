/*
When any fees are Invoiced in the Fee Tab, it needs to email the applicant and the contractor (including license professionals)
that fees are owed and they can click the link to go online to login to their account to view and pay their fees. 

Written by JMAIN
*/
logDebug("Kicking off 5043_BuildingEmailInvoicedFees.js");
if (balanceDue > 0) {
  //email the applicant
  // var contacts = "Applicant,Contractor(s)";
  // var lptypes = "Contractor";
  // var emailtemplate = "BLD_INVOICEDFEES";

  // emailContactsWithReportLinkASync(contacts, emailtemplate, "", "", "", "N", "");
  //coa_emailLicenseProfessionals(lptypes, emailtemplate, "", "", "", capId);
  logDebug("Starting to send notifications");
  var emailTo = getContactByType("Applicant", capId);
  var vEmailTemplate = "BLD_INVOICEDFEES";
  var capAlias = cap.getCapModel().getAppTypeAlias();
  var firstName = recordApplicant.getFirstName();
  var lastName = recordApplicant.getLastName();
  var today = new Date();
  var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
  var altId = capId.getCustomID();
  var tParams = aa.util.newHashtable();
  //tParams.put("$$todayDate$$", thisDate);
  //tParams.put("$$altid$$", altId);
  //tParams.put("$$capAlias$$", capAlias);
  //tParams.put("$$FirstName$$", firstName);
  //tParams.put("$$LastName$$", lastName);
  //tParams.put("$$appDate$$", appDate);
  logDebug("EmailTo: " + emailTo);
  //logDebug("Table Parameters: " + tParams);
  sendNotification("noreply@auroragov.org", emailTo, "", vEmailTemplate, tParams, null);
}
logDebug("End off 5043_BuildingEmailInvoicedFees.js");