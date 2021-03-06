/*
When any fees are Invoiced in the Fee Tab, it needs to email the applicant and the contractor (including license professionals)
that fees are owed and they can click the link to go online to login to their account to view and pay their fees. 

Written by JMAIN
*/
var balanceDue;
balanceDue = capDetail.getBalance();
logDebug("Balance Due: " + balanceDue);

if (balanceDue > 0) {
  // //email the applicant
  // // logDebug("Email to: " + emailTo);
  // //   var emailTo1 = emailTo;
  // var contacts = "Applicant";
  // //var lptypes = "Contractor";
  // var emailtemplate = "BLD_INVOICEDFEES";
  // emailContactsWithReportLinkASync("Applicant", emailtemplate, "", "", "", "N", "");
  // //coa_emailLicenseProfessionals(lptypes, emailtemplate, "", "", "", capId);
  // logDebug("End of email to send");
  var altID = capId.getCustomID();
		appType = cap.getCapType().toString();
		var invoiceNbrObj = getLastInvoice({});
		var invNbr = invoiceNbrObj.getInvNbr();
		var vAsyncScript = "SEND_EMAIL_BLDMST_INVOICE";
		var envParameters = aa.util.newHashMap();
		envParameters.put("altID", altID);
		envParameters.put("capId", capId);
		envParameters.put("cap", cap);
		envParameters.put("INVOICEID", String(invNbr));
		logDebug("Starting to kick off ASYNC event for BLD Master Invoice. Params being passed: " + envParameters);
		aa.runAsyncScript(vAsyncScript, envParameters);
		logDebug("---------------------> 5043_BuildingEmailInvoicedFees.js ended.");
}
logDebug("End of 5043_BuildingEmailInvoicedFees.js");


// if (balanceDue > 0) {
//   //Donation Bins code
//   logDebug("Starting to send emails to Applicant");
//   //Send Notification
//   logDebug("Starting to send notifications for fee processing");
//   var emailTemplate = "BLD_INVOICEDFEES";
//   var capAlias = cap.getCapModel().getAppTypeAlias();
//   var recordApplicant = getContactByType("Applicant", capId);
//   var firstName = recordApplicant.getFirstName();
//   var lastName = recordApplicant.getLastName();
//   var emailTo = recordApplicant.getEmail();
//   var altId = capId.getCustomID();
//   var today = new Date();
//   var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
//   var tParams = aa.util.newHashtable();
//   tParams.put("$$todayDate$$", thisDate);
//   tParams.put("$$altID$$", altId);
//   tParams.put("$$capAlias$$", capAlias);
//   tParams.put("$$FirstName$$", firstName);
//   tParams.put("$$LastName$$", lastName);
//   logDebug("EmailTo: " + emailTo);
//   logDebug("Table Parameters: " + tParams);
//   sendNotification("noreply@auroragov.org", emailTo, "", emailTemplate, tParams, null);
//   logDebug("End of Script 5043_BuildingEmailInfoicedFees.js");
// }