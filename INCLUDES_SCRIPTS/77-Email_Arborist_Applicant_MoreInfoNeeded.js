/* #77 - 77-Email_Arborist_Applicant_MoreInfoNeeded

10/22/2018 updated by JMP to include the real email template

*/

logDebug("JMP JMP Alert: ------------------------>> Script Item #77 - 77_Email_Arborist_Applicant_MoreInfoNeeded");

if ("Application Intake".equals(wfTask) && "Additional Info Needed".equals(wfStatus)) 
{
   if (wfComment != null && typeof wfComment !== 'undefined') 
      
   {
       //var thisCap = aa.cap.getCap(capId).getOutput();
      
      var eParams = aa.util.newHashtable();
      var contacts = "All";
      var emailtemplate = "JMP EMAIL TEMPLATE";
      
      addParameter(eParams, "$$wfComment$$", wfComment);
      addParameter(eParams, "$$altID$$", altId);
      addParameter(eParams, "$$todayDate$$", dateAdd(null, 0));
      addParameter(eParams, "$$scriptid$$", "77");
      
      emailContacts(contacts, emailtemplate, eParams, "", "", "N", "");

   }
}

