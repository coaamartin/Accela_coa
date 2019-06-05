// SCRIPTNUMBER: 5113
// SCRIPTFILENAME: 5113_EMailReadyToPay
// PURPOSE: Email for Ready to Pay
// DATECREATED: 05/31/2019
// BY: JMPorter

logDebug('Started script 5113_EMailReadyToPay');

if(appMatch("Licenses/Professional/General/Application"))
{
   var contactType = "License Holder";
   var licenseType = "Qualified Professional";
   var addressType = "Business";

   var vEmailTemplate = "BLD QPL LICENSE READY TO PAY # 106"; 
   var vEParams = aa.util.newHashtable();
      
   var asiValues = new Array();
   loadAppSpecific(asiValues);     
   addParameter(vEParams, "$$LicenseType$$", asiValues["Qualifying Professional Type"]);
}


if(appMatch("Licenses/Contractor/General/Application"))
{   

   var contactType = "Applicant";
   var licenseType = "Contractor";
   var addressType = "Business";
   
   var vEmailTemplate = "BLD CLL LICENSE READY TO PAY # 106"; 
   var vEParams = aa.util.newHashtable();
   
   var asiValues = new Array();
   loadAppSpecific(asiValues);     
   addParameter(vEParams, "$$LicenseType$$", asiValues["Contractor Type"]);
  
}  
   
emailContacts(contactType,vEmailTemplate, vEParams, "", "","N", "");   

logDebug('Ended script 5113_EMailReadyToPay');
