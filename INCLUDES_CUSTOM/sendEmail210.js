function sendEmail210(){
	//Use the provided template name 
	var emailTemplate="LIC MJ ADDITIONAL INFO # 210"
	var applicant = getContactByType("Applicant", capId);
	if (!applicant || !applicant.getEmail()) {
		logDebug("**WARN no applicant found or no email capId=" + capId);
		return false;
	}
	var toEmail = applicant.getEmail();
	var files = new Array();
	// use the correct parameters related to the email template provided + wfComment
	var eParams = aa.util.newHashtable();
	addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
	addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
	addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());
	addParameter(eParams, "$$wfTask$$", wfTask);
	addParameter(eParams, "$$wfStatus$$", wfStatus);
	addParameter(eParams, "$$wfDate$$", wfDate);
	addParameter(eParams, "$$wfComment$$", wfComment);

	var sent = aa.document.sendEmailByTemplateName("", toEmail, "", emailTemplate, eParams, files);
	if (!sent.getSuccess()) {
		logDebug("**WARN sending email failed, error:" + sent.getErrorMessage());
		return false;
	}
	
}