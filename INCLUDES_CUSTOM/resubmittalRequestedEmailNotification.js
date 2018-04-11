function resubmittalRequestedEmailNotification(workFlowTask, workflowStatusArray, emailTemplate) {

	if (workFlowTask == null || wfTask == workFlowTask) {

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

		var contacts = getContactArray();
		if (!contacts) {
			logDebug("**WARN no contacts found on cap " + capId);
			return false;
		}

		var toEmails = new Array();
		for (c in contacts) {
			if (contacts[c]["email"] && contacts[c]["email"] != null && contacts[c]["email"] != "") {
				toEmails.push(contacts[c]["email"]);
			}
		}

		if (toEmails.length == 0) {
			logDebug("**WARN no contacts with valid email on cap " + capId);
			return false;
		}

		var eParams = aa.util.newHashtable();
		addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
		addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
		addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());
		addParameter(eParams, "$$balance$$", feeBalance(""));
		addParameter(eParams, "$$wfTask$$", wfTask);
		addParameter(eParams, "$$wfStatus$$", wfStatus);
		addParameter(eParams, "$$wfDate$$", wfDate);
		if (wfComment)
			addParameter(eParams, "$$wfComment$$", wfComment);
		addParameter(eParams, "$$wfStaffUserID$$", wfStaffUserID);
		addParameter(eParams, "$$wfHours$$", wfHours);

		for (t in toEmails) {
			aa.document.sendEmailByTemplateName("", toEmails[t], "", emailTemplate, eParams, null);
		}

	} else {
		return false;
	}

	return true;
}