function checkWorkflowDeactivateTaskAndSendEmail(workFlowTask, workflowStatusArray, wfTaskDeactivate, emailTemplateName) {

	if (wfTask == workFlowTask) {

		var statusMatch = false;

		for (s in workflowStatusArray) {
			if (wfStatus == workflowStatusArray[s]) {
				statusMatch = true;
				break;
			}
		}//for all status options

		if (!statusMatch) {
			return false;
		}

		deactivateTask(wfTaskDeactivate);

		var applicant = getContactByType("Applicant", capId);
		if (!applicant || !applicant.getEmail()) {
			logDebug("**WARN no applicant found on or no email capId=" + capId);
			return false;
		}
		var toEmail = applicant.getEmail();
		var firstName = applicant.getFirstName();   
		var middleName =applicant.getMiddleName();   
		var lastName = applicant.getLastName(); 
		var fullName = buildFullName(firstName, middleName,lastName);
		
		
		var iNameResult = aa.person.getUser(currentUserID);
		var iName = iNameResult.getOutput();
		var userEmail=iName.getEmail();
		var userName = iName.getFullName();
	  //  var userPhone = iName.getPhone(); // " Phone: " + userPhone +
	   var userTitle = iName.getTitle(); 

		//prepare Deep URL:
		var acaSiteUrl = lookup("ACA_CONFIGS", "ACA_SITE");
		var subStrIndex = acaSiteUrl.toUpperCase().indexOf("/ADMIN");
		var acaCitizenRootUrl = acaSiteUrl.substring(0, subStrIndex);

		var deepUrl = "/urlrouting.ashx?type=1000";
		deepUrl = deepUrl + "&Module=" + cap.getCapModel().getModuleName();
		deepUrl = deepUrl + "&capID1=" + capId.getID1();
		deepUrl = deepUrl + "&capID2=" + capId.getID2();
		deepUrl = deepUrl + "&capID3=" + capId.getID3();
		deepUrl = deepUrl + "&agencyCode=" + aa.getServiceProviderCode();
		deepUrl = deepUrl + "&HideHeader=true";

		var recordDeepUrl = acaCitizenRootUrl + deepUrl;

		var eParams = aa.util.newHashtable();
		addParameter(eParams, "$$recordDeepUrl$$", recordDeepUrl);
		addParameter(eParams, "$$ContactFullName$$",fullName); 
		addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
		addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
		addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());
		addParameter(eParams, "$$userName$$", userName);
		addParameter(eParams, "$$userEmail$$", userEmail);
		addParameter(eParams, "$$userTitle$$", userTitle);

		var sent = aa.document.sendEmailByTemplateName("", toEmail, "", emailTemplateName, eParams, null);
		if (!sent.getSuccess()) {
			logDebug("**WARN sending email failed, error:" + sent.getErrorMessage());
			return false;
		}
	} else {
		return false;
	}
	return true;
}