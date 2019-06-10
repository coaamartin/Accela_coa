// SCRIPTNUMBER: 5114
// SCRIPTFILENAME: 5114_EMailDeclineMoreInfo
// PURPOSE: Email for Decline and Need More Info
// DATECREATED: 06/10/2019
// BY: JMPorter

logDebug('Started script 5115_EMailDeclineMoreInfo');
var sendEmail = false;

if(appMatch("Licenses/Professional/General/Application"))
{
   sendEmail = true;
   var contactType = "License Holder";
   var licenseType = "Qualified Professional";
   var addressType = "Business";

   var vEmailTemplate = "BLD_QPL_LICENSE_MOREINFO_DECLINED"; 
   var vEParams = aa.util.newHashtable();
      
   var asiValues = new Array();
   loadAppSpecific(asiValues);     
   addParameter(vEParams, "$$LicenseType$$", asiValues["Qualifying Professional Type"]);
   
   if (wfStatus == "Denied") addParameter(vEParams, "$$LetterReason$$", "it is denied");

   if (wfStatus == "Additional Info Required") addParameter(vEParams, "$$LetterReason$$", "additional information is required");
  
}


if(appMatch("Licenses/Contractor/General/Application"))
{   
 
   sendEmail = true;
   var contactType = "Applicant";
   var licenseType = "Contractor";
   var addressType = "Business";
   
   var vEmailTemplate = "BLD_CLL_LICENSE_MOREINFO_DECLINED"; 
   var vEParams = aa.util.newHashtable();
   
   var asiValues = new Array();
   loadAppSpecific(asiValues);     
   addParameter(vEParams, "$$LicenseType$$", asiValues["Contractor Type"]);
   
   if (wfStatus == "Denied") addParameter(vEParams, "$$LetterReason$$", "it is denied");

   if (wfStatus == "Additional Info Required") addParameter(vEParams, "$$LetterReason$$", "additional information is required");   
  
}  

if (sendEmail)
{   
   if (wfComment != null && typeof wfComment !== 'undefined') 
   {   
     addParameter(vEParams, "$$wfComment$$", wfComment);
      
     emailContacts(contactType,vEmailTemplate, vEParams, "", "", "N", "");  
   
     logDebug('Within logic to send Email');   
   
   }
}

logDebug('Ended script 5115_EMailDeclineMoreInfo');
