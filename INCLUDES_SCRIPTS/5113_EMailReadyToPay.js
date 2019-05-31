// SCRIPTNUMBER: 5113
// SCRIPTFILENAME: 5113_EMailReadyToPay
// PURPOSE: Email for Ready to Pay
// DATECREATED: 05/31/2019
// BY: JMPorter

logDebug('Started script 5113_EMailReadyToPay');

   var contactType = "License Holder";
   var licenseType = "Qualified Professional";
   var addressType = "Business";

   var vEmailTemplate = "BLD QPL LICENSE READY TO PAY # 106"; 
   var vEParams = aa.util.newHashtable();
      
   var asiValues = new Array();
   loadAppSpecific(asiValues);     
   addParameter(vEParams, "$$LicenseType$$", asiValues["Qualifying Professional Type"]);
      
   emailContacts(contactType,vEmailTemplate, vEParams, "", "","N", "");
   

logDebug('Ended script 5113_EMailReadyToPay');
