// SCRIPTNUMBER: 5114
// SCRIPTFILENAME: 5114_EMailReadyLicenseIssue
// PURPOSE: Email for Ready to Pay
// DATECREATED: 06/06/2019
// BY: JMPorter

logDebug('Started script 5114_EMailReadyLicenseIssue');

if(appMatch("Licenses/Professional/General/Application"))
{
   var contactType = "License Holder";
   var licenseType = "Qualified Professional";
   var addressType = "Business";

   var vEmailTemplate = "BLD_QPL_LICENSE_ISSUANCE_#_64-65"; 
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
   
   var vEmailTemplate = "BLD_CLL_LICENSE_ISSUANCE_#111"; 
   var vEParams = aa.util.newHashtable();
   
   var asiValues = new Array();
   loadAppSpecific(asiValues);     
   addParameter(vEParams, "$$LicenseType$$", asiValues["Contractor Type"]);
  
}  
   
emailContacts(contactType,vEmailTemplate, vEParams, "", "", "N", "");   

logDebug('Ended script 5114_EMailReadyLicenseIssue');
