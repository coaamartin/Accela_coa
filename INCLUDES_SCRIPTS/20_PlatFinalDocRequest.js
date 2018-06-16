/*Event   WorkflowTaskUpdateAfter  
Criteria   When wf task "plans coordination" = "request final documents"
then email the applicant requesting final documents - need email template - deliver mylars to real property
created by swakil
*/

if ("Plans Coordination".equals(wfTask) && "Request Final Documents".equals(wfStatus))
{
        var contacts = "Applicant";
        var emailtemplate = "JD_TEST_TEMPLATE";
        
        var emailparams = aa.util.newHashtable();
        emailparams.put("$$wfComment$$", wfComment+"");
        emailparams.put("$$Joke$$", "requesting final documents");
        
        logDebug("about to send the email...")
        emailContacts(contacts, emailtemplate, emailparams, "", "", "N", "");     
}