function sendEmailNotification(emailTemplate,reportName){

	// Get the Applicant's email
	var recordApplicant = getContactByType("Applicant", capId);
	var applicantEmail = null;
	if (!recordApplicant || recordApplicant.getEmail() == null || recordApplicant.getEmail() == "") {
		logDebug("**WARN no applicant or applicant has no email, capId=" + capId);
	} else {
		applicantEmail = recordApplicant.getEmail();
	}
	// Get the Developer's email
	var recordDeveloper = getContactByType("Developer", capId);
	var developerEmail = null;
	if (!recordDeveloper || recordDeveloper.getEmail() == null || recordDeveloper.getEmail() == "") {
		logDebug("**WARN no developer or developer has no email, capId=" + capId);
	} else {
		developerEmail = recordDeveloper.getEmail();
	}
	
	// Get the Case Manager's email
	var caseManagerEmail=getAssignedStaffEmail();
	
	var cc="";
	if (isBlankOrNull(developerEmail)==false){
		cc=developerEmail;
	}
	if (isBlankOrNull(caseManagerEmail)==false){
		if (cc!=""){
			cc+= ";" +caseManagerEmail;
		}else{
			cc=caseManagerEmail;
		}
	}
	
	var eParams = aa.util.newHashtable();
	addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
	addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
	addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());
	addParameter(eParams, "$$balance$$", feeBalance(""));
	addParameter(eParams, "$$wfTask$$", wfTask);
	addParameter(eParams, "$$wfStatus$$", wfStatus);
	addParameter(eParams, "$$wfDate$$", wfDate);
	addParameter(eParams, "$$wfComment$$", wfComment);
	addParameter(eParams, "$$wfStaffUserID$$", wfStaffUserID);
	addParameter(eParams, "$$wfHours$$", wfHours);

	//Based on report, fill report parameters here
	var rptParams = aa.util.newHashtable();
	rptParams.put("RECORD_MODULE", "PLANNING");
	
	var sent =sendEmailWithReport(applicantEmail,cc, emailTemplate, reportName, rptParams, eParams);
	if (sent==false) {
		logDebug("**WARN sending email failed");
	}
  
}
