// SCRIPTNUMBER: 5113
// SCRIPTFILENAME: 5113_EMailReadyToPay
// PURPOSE: Email for Ready to Pay
// DATECREATED: 05/31/2019
// BY: JMPorter

logDebug('Started script 5113_EMailReadyToPay');
var balanceDue;
balanceDue = capDetail.getBalance();
logDebug("Balance Due: " + balanceDue);

if (appMatch("Licenses/Professional/General/Application")) {
   if (balanceDue > 0) {
      var asiValues = getAppSpecific("Qualifying Professional Type");
      licenseType = asiValues;
      var altID = capId.getCustomID();
      appType = cap.getCapType().toString();
      var invoiceNbrObj = getLastInvoice({});
      var invNbr = invoiceNbrObj.getInvNbr();
      var vAsyncScript = "SEND_EMAIL_LIC_QPL_CLL";
      var emailTo = getEmailString(); 
	   var recordApplicant = getContactByType("License Holder", capId);
	   var firstName = recordApplicant.getFirstName();
      var lastName = recordApplicant.getLastName();
      var envParameters = aa.util.newHashMap();
      envParameters.put("altID", altID);
      envParameters.put("capId", capId);
      envParameters.put("cap", cap);
      envParameters.put("INVOICEID", String(invNbr));
      envParameters.put("licenseType", licenseType);
      envParameters.put("emailTo", emailTo);
      envParameters.put("recordApplicant", recordApplicant);
      envParameters.put("firstName", firstName);
      envParameters.put("lastName", lastName);
      envParameters.put("vemailTemplate", "BLD QPL LICENSE READY TO PAY # 106");
      logDebug("Starting to kick off ASYNC event for BLD Master Invoice. Params being passed: " + envParameters);
      aa.runAsyncScript(vAsyncScript, envParameters);
      logDebug("---------------------> 5113_EMailReadyToPay.js ended.");
   }
   //    var contactType = "License Holder";
   //    var licenseType = "Qualified Professional";
   //    var addressType = "Business";

   //    var vEmailTemplate = "BLD QPL LICENSE READY TO PAY # 106"; 
   //    var vEParams = aa.util.newHashtable();

   //    var asiValues = new Array();
   //    loadAppSpecific(asiValues);     
   //    addParameter(vEParams, "$$LicenseType$$", asiValues["Qualifying Professional Type"]);
}


if (appMatch("Licenses/Contractor/General/Application")) {
   if (balanceDue > 0) {
      var asiValues = getAppSpecific("Contractor Type");
      licenseType = asiValues;
      var altID = capId.getCustomID();
      appType = cap.getCapType().toString();
      var invoiceNbrObj = getLastInvoice({});
      var invNbr = invoiceNbrObj.getInvNbr();
      var vAsyncScript = "SEND_EMAIL_LIC_QPL_CLL";
      var envParameters = aa.util.newHashMap();
      envParameters.put("altID", altID);
      envParameters.put("capId", capId);
      envParameters.put("cap", cap);
      envParameters.put("INVOICEID", String(invNbr));
      envParameters.put("licenseType", licenseType);
      envParameters.put("vemailTemplate", "BLD CLL LICENSE READY TO PAY # 106");
      logDebug("Starting to kick off ASYNC event for BLD Master Invoice. Params being passed: " + envParameters);
      aa.runAsyncScript(vAsyncScript, envParameters);
      logDebug("---------------------> 5113_EMailReadyToPay.js ended.");
   }

   // var contactType = "Applicant";
   // var licenseType = "Contractor";
   // var addressType = "Business";

   // var vEmailTemplate = "BLD CLL LICENSE READY TO PAY # 106"; 
   // var vEParams = aa.util.newHashtable();

   // var asiValues = new Array();
   // loadAppSpecific(asiValues);     
   // addParameter(vEParams, "$$LicenseType$$", asiValues["Contractor Type"]);

}

//emailContacts(contactType,vEmailTemplate, vEParams, "", "", "N", "");   

logDebug('Ended script 5113_EMailReadyToPay');