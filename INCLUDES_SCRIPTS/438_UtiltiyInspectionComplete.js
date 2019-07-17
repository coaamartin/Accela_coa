	/*Event   WorkflowTaskUpdateAfter   
Criteria   wf step "Utility Inspection" = "Completed" 
Action email the Developer and LP. 
created by swakil  
*/
if ("Utility Inspection".equals(wfTask) && "Completed".equals(wfStatus))
{
		var files = new Array();
		var acaSite = lookup("ACA_CONFIGS", "ACA_SITE"); 
		acaSite = acaSite.substr(0, acaSite.toUpperCase().indexOf("/ADMIN"));  
		var recURL = acaSite + getACAUrl();
		var appTypeAlias = cap.getCapType().getAlias();
		var emailTemplate = "WAT_UTILITY_INSPECTIONS_COMPLETE";
		var eParams = aa.util.newHashtable();
		eParams.put("$$altid$$", capId.getCustomID());
		eParams.put("$$todayDate$$", wfDate);
		eParams.put("$$capAlias$$", appTypeAlias);
		eParams.put("$$acaRecordURL$$", recURL);

		var devContact = getContactByType("Developer", capId);
		if (devContact && devContact.getEmail() != null && devContact.getEmail() != "") {
		    var sent = sendNotification("noreply@auroragov.org", devContact.getEmail(), "", emailTemplate, eParams, files);
		}
		var lpEml = getPrimLPEmailByCapId(capId);
		if (lpEml) {
		    var sent = sendNotification("noreply@auroragov.org", lpEml, "", emailTemplate, eParams, files);
		}

}
