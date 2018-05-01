/*Event   WorkflowTaskUpdateAfter   
Criteria   wf step "Final Acceptance" = "Completed" 
Action email the applicant, contractor and owner. 
created by swakil
*/
if ("Final Acceptance".equals(wfTask) && "Completed".equals(wfStatus))
{
		var contact = "Applicant,Property Owner Name,Contractor(s)";
		var template = "JD_TEST_TEMPLATE";
		var emailparams = aa.util.newHashtable();
		emailparams.put("$$anyParm$$", "AAA");
		emailContacts(contact, template, emailparams, "", "", "N", "");		
}

