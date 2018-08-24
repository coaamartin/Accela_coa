//script195_ActivateFeeIrrPermit
//Record Types:	Water/Water/Lawn Irrigation/Permit
//Event: WTUA - WorkflowTaskUpdateAfter
//Desc: When the wfStatus = “Application Fee Submitted” then send email to the applicant that the fees are invoiced and ready to be paid.

logDebug("script195_ActivateFeeIrrPermit started.");
try{
	if (wfTask=="Application Submittal" && wfStatus =="Application Fee Submitted") {
		var emailTemplate="IP LAWN IRRIGATION ACCEPTED # 195"
		var acaUrl = lookup("ACA_CONFIGS","OFFICIAL_WEBSITE_URL");
		var appName = cap.getSpecialText();
		var eParams = aa.util.newHashtable();
		addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
		addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
		addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());
		addParameter(eParams, "$$wfTask$$", wfTask);
		addParameter(eParams, "$$wfStatus$$", wfStatus);
		addParameter(eParams, "$$wfDate$$", wfDate);
		addParameter(eParams, "$$wfComment$$", wfComment);
		addParameter(eParams, "$$acaRecordUrl$$", acaUrl);
		addParameter(eParams, "$$ApplicationName$$", appName);
		
		//send email to applicant
		emailContactsWithReportLinkASync("Applicant", emailTemplate, eParams, "", "", "N", "");
		
	}
} catch(err){
	showMessage = true;
	comment("Error on custom function script195_ActivateFeeIrrPermit. Please contact administrator. Err: " + err);
	logDebug("Error on custom function script195_ActivateFeeIrrPermit. Please contact administrator. Err: " + err);
	logDebug("A JavaScript Error occurred: script195_ActivateFeeIrrPermit: " + err.message);
	logDebug(err.stack)
}
logDebug("script195_ActivateFeeIrrPermit ended.");


