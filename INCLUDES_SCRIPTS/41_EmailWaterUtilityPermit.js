/*Event   WorkflowTaskUpdateAfter   
Criteria   wf step "Final Acceptance" = "Completed" 
Action email the applicant, contractor and owner. 
created by swakil

07/20/2018 updated by JMAIN to include the real email template

*/
if ("Final Acceptance".equals(wfTask) && "Completed".equals(wfStatus))
{
		var contacts = "Developer,Consultant,Geo Tech";
		var emailtemplate = "WAT_WUP_FINAL ACCEPT COMPLETE";
		 //build ACA URL
		var acaSite = lookup("ACA_CONFIGS", "ACA_SITE");
		acaSite = acaSite.substr(0, acaSite.toUpperCase().indexOf("/ADMIN"));  
		var recURL = acaSite + getACAUrl();
		var appTypeAlias = cap.getCapType().getAlias();

		var emailparams = aa.util.newHashtable();
		emailparams.put("$$altid$$", capId.getCustomID());
		emailparams.put("$$todayDate$$", wfDate);
		emailparams.put("$$capAlias$$", appTypeAlias);
		emailparams.put("$$ContactFullName$$", "");
		emailparams.put("$$acaRecordURL$$", recURL);
		emailContacts(contacts, emailtemplate, emailparams, "", "", "N", "");		
}

