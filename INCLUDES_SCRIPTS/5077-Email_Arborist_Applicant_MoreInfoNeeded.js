/* #5077 - 5077-Email_Arborist_Applicant_MoreInfoNeeded

10/22/2018 updated by JMPorter to include the real email template

*/

logDebug("JMPorter JMPorter Alert: ------------------------>> Script Item #5077 - 5077_Email_Arborist_Applicant_MoreInfoNeeded");

if ("Application Intake".equals(wfTask) && "Additional Info Needed".equals(wfStatus)) 
{
   if (wfComment != null && typeof wfComment !== 'undefined') 
      
   {
      //var thisCap = aa.cap.getCap(capId).getOutput();
      
      //Get the capId type needed for the email function
		var capId4Email = aa.cap.createCapIDScriptModel(capId.getID1(), capId.getID2(), capId.getID3());
      var altId = capId.getCustomID();
      var recordApplicant = getContactByType("Arborist Applicant", capId);
      var applicantEmail = null;
      
      var cap = aa.cap.getCap(capId).getOutput();
      var capName = cap.getSpecialText();
      
      if (!recordApplicant || recordApplicant.getEmail() == null || recordApplicant.getEmail() == "") 
      {
        logDebug("**WARN no applicant or applicant has no email, capId=" + capId);
      } else 
      {
        applicantEmail = recordApplicant.getEmail(); logDebug("Applicant Email = " + applicantEmail);
      }
      
      var eParams = aa.util.newHashtable();
      var emailtemplate = "ARBORIST LICENSE NEEDS MORE INFO # 77";
      
      if(applicantEmail)
      {      
         addParameter(eParams, "$$wfComment$$", wfComment);   //Not included in update template 
         addParameter(eParams, "$$altid$$", altId);
         addParameter(eParams, "$$todayDate$$", dateAdd(null, 0));
         addParameter(eParams, "$$capAlias$$", capName);
         addParameter(eParams, "$$FirstName$$", recordApplicant.getFirstName());
         addParameter(eParams, "$$LastName$$", recordApplicant.getLastName());
         
         //emailContacts(contacts, emailtemplate, eParams, "", "", "N", "");

         logDebug("Email Sent: " + aa.document.sendEmailAndSaveAsDocument("noreply@aurora.gov", applicantEmail, "", emailtemplate, eParams, capId4Email, null).getSuccess());
      }
   }
}

