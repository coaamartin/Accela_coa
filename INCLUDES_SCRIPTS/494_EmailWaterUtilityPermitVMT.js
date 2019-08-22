if ("Verify Materials Testing".equals(wfTask) && "Approved".equals(wfStatus))
{
		var contacts = "Applicant";
		var emailtemplate = "JD_TEST_TEMPLATE";
		 //build ACA URL
		var acaSite = lookup("ACA_CONFIGS", "ACA_SITE");
		acaSite = acaSite.substr(0, acaSite.toUpperCase().indexOf("/ADMIN"));  
		var recURL = acaSite + getACAUrl();
		var appTypeAlias = cap.getCapType().getAlias();

		var emailparams = aa.util.newHashtable();
		emailparams.put("$$altid$$", capId.getCustomID());
		emailparams.put("$$todayDate$$", wfDate);
		emailparams.put("$$capAlias$$", appTypeAlias);
		emailparams.put("$$acaRecordURL$$", recURL);
		emailContacts(contacts, emailtemplate, emailparams, "", "", "N", "");		
}