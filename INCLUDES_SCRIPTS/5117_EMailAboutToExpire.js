// SCRIPTNUMBER: 5117
// SCRIPTFILENAME: 5114_EMailAboutToExpire
// PURPOSE: Email for About to Expire
// DATECREATED: 06/19/2019
// BY: JMPorter

logDebug('Started script 5117_EMailAboutToExpire');

if(appMatch("Licenses/Professional/General/License"))
{
   var contactType = "License Holder";
   var licenseType = "Qualified Professional";
   var addressType = "Business";

   var vEmailTemplate = "MESSAGE_NOTICE_LICENSE_EXPIRED"; 
   var vEParams = aa.util.newHashtable();
      
   var asiValues = new Array();
   loadAppSpecific(asiValues);     
   addParameter(vEParams, "$$LicenseType$$", asiValues["Qualifying Professional Type"]);
}


if(appMatch("Licenses/Contractor/General/License"))
{   

   var contactType = "Applicant";
   var licenseType = "Contractor";
   var addressType = "Business";
   
   var vEmailTemplate = "MESSAGE_NOTICE_LICENSE_EXPIRED"; 
   var vEParams = aa.util.newHashtable();
   
   var asiValues = new Array();
   loadAppSpecific(asiValues);     
   addParameter(vEParams, "$$LicenseType$$", asiValues["Contractor Type"]);
  
}  
   
emailContacts(contactType,vEmailTemplate, vEParams, "", "", "N", "");   

logDebug('Ended script 5117_EMailAboutToExpire');
