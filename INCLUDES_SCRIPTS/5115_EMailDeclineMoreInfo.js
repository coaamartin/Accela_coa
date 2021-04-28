// SCRIPTNUMBER: 5114
// SCRIPTFILENAME: 5114_EMailDeclineMoreInfo
// PURPOSE: Email for Decline and Need More Info
// DATECREATED: 06/10/2019
// BY: JMPorter

logDebug('Started script 5115_EMailDeclineMoreInfo');
var sendEmail = false;
appTypeResult = cap.getCapType(); //create CapTypeModel object
appTypeString = appTypeResult.toString();
appTypeArray = appTypeString.split("/");
logDebug("appType: " + appTypeString);

if(appMatch("Licenses/Professional/General/Application"))
{
   // sendEmail = true;
   // var contactType = "License Holder";
   // var licenseType = "Qualified Professional";
   // var addressType = "Business";

   // var vEmailTemplate = "BLD_QPL_LICENSE_MOREINFO_DECLINED"; 
   // var vEParams = aa.util.newHashtable();
      
   // var asiValues = new Array();
   // loadAppSpecific(asiValues);     
   // addParameter(vEParams, "$$LicenseType$$", asiValues["Qualifying Professional Type"]);
   

   logDebug("Starting to send notifications");
   var vEmailTemplate = "BLD_PLANNING_RESUBMITTAL";
   var capAlias = cap.getCapModel().getAppTypeAlias();
   var recordApplicant = getContactByType("Applicant", capId);
   var firstName = recordApplicant.getFirstName();
   var lastName = recordApplicant.getLastName();
   var emailTo = recordApplicant.getEmail();
   var wfcomment = wfComment;
   var today = new Date();
   var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
   var tParams = aa.util.newHashtable();
   if (wfStatus == "Denied") addParameter(tParams, "$$LetterReason$$", "it is denied");
   if (wfStatus == "Additional Info Required") addParameter(tParams, "$$LetterReason$$", "additional information is required");
   tParams.put("$$todayDate$$", thisDate);
   tParams.put("$$altid$$", capId.getCustomID());
   tParams.put("$$Record Type$$", "Qualified Professional");
   tParams.put("$$capAlias$$", capAlias);
   tParams.put("$$FirstName$$", firstName);
   tParams.put("$$LastName$$", lastName);
   tParams.put("$$wfComment$$", wfComment);
   logDebug("EmailTo: " + emailTo);
   logDebug("Table Parameters: " + tParams);
   sendNotification("noreply@auroragov.org", emailTo, "", vEmailTemplate, tParams, null);
   logDebug("End of Script 5115_EMailDeclineMoreInfo.js");
}


if(appMatch("Licenses/Contractor/General/Application"))
{   
 
   // sendEmail = true;
   // var contactType = "Applicant";
   // var licenseType = "Contractor";
   // var addressType = "Business";
   
   // var vEmailTemplate = "BLD_CLL_LICENSE_MOREINFO_DECLINED"; 
   // var vEParams = aa.util.newHashtable();
   
   // var asiValues = new Array();
   // loadAppSpecific(asiValues);     
   // addParameter(vEParams, "$$LicenseType$$", asiValues["Contractor Type"]);
   
   // if (wfStatus == "Denied") addParameter(vEParams, "$$LetterReason$$", "it is denied");

   // if (wfStatus == "Additional Info Required") addParameter(vEParams, "$$LetterReason$$", "additional information is required");   
  
   logDebug("Starting to send notifications");
   var vEmailTemplate = "BLD_PLANNING_RESUBMITTAL";
   var capAlias = cap.getCapModel().getAppTypeAlias();
   var recordApplicant = getContactByType("Applicant", capId);
   var firstName = recordApplicant.getFirstName();
   var lastName = recordApplicant.getLastName();
   var emailTo = recordApplicant.getEmail();
   var wfcomment = wfComment;
   var today = new Date();
   var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
   var tParams = aa.util.newHashtable();
   if (wfStatus == "Denied") addParameter(tParams, "$$LetterReason$$", "it is denied");
   if (wfStatus == "Additional Info Required") addParameter(tParams, "$$LetterReason$$", "additional information is required");
   tParams.put("$$todayDate$$", thisDate);
   tParams.put("$$altid$$", capId.getCustomID());
   tParams.put("$$Record Type$$", "Quailified Contractor");
   tParams.put("$$capAlias$$", capAlias);
   tParams.put("$$FirstName$$", firstName);
   tParams.put("$$LastName$$", lastName);
   tParams.put("$$wfComment$$", wfComment);
   logDebug("EmailTo: " + emailTo);
   logDebug("Table Parameters: " + tParams);
   sendNotification("noreply@auroragov.org", emailTo, "", vEmailTemplate, tParams, null);
   logDebug("End of Script 5115_EMailDeclineMoreInfo.js");
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
