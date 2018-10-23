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
      var urlstring = "http://img-s-msn-com.akamaized.net/tenant/amp/entityid/BBOK9ZF.img?h=488&w=799&m=6&q=60&o=f&l=f&x=916&y=734"
      
      addParameter(eParams, "$$wfComment$$", wfComment);
      //addParameter(eParams, "$$altID$$", altId);
      addParameter(eParams, "$$todayDate$$", dateAdd(null, 0));
      addParameter(eParams, "$$scriptid$$", "77");
      //addParameter(eParams, "$$testpic$$", urlstring);
      
      emailContacts(contacts, emailtemplate, eParams, "", "", "N", "");

   }
}

