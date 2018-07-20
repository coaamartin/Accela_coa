/*Event   WorkflowTaskUpdateAfter   
Criteria   wf step "Final Acceptance" = "Completed" 
Action email the applicant, contractor and owner. 
created by swakil

07/20/2018 updated by JMAIN to include the real email template

*/
if ("Final Acceptance".equals(wfTask) && "Completed".equals(wfStatus))
{
		var contacts = "Applicant,Property Owner Name,Contractor(s)";
		var emailtemplate = "WAT_WUP_FINAL ACCEPT COMPLETE";
		var emailparams = aa.util.newHashtable();
		emailContacts(contacts, emailtemplate, emailparams, "", "", "N", "");		
}

