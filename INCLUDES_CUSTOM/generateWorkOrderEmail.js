function generateWorkOrderEmail(workFlowTask, workflowStatusArray, asiFieldName, emailTemplateName, reportName, rptParams, emailTo, seqType, seqName, maskName) {

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

		//Update ASI value
		var autoGenNumber = getNextSequence(seqType, seqName, maskName);
		var olduseAppSpecificGroupName = useAppSpecificGroupName;
		useAppSpecificGroupName = false;
		editAppSpecific(asiFieldName, autoGenNumber);
		useAppSpecificGroupName = olduseAppSpecificGroupName;

		//Send the email with attached report
		var eParams = aa.util.newHashtable();
		addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
		addParameter(eParams, "$$recordAlias$$", cap.getCapModel().getCapType().getAlias());
		addParameter(eParams, "$$recordStatus$$", cap.getCapModel().getCapStatus());
		addParameter(eParams, "$$balance$$", feeBalance(""));
		addParameter(eParams, "$$wfTask$$", wfTask);
		addParameter(eParams, "$$wfStatus$$", wfStatus);
		addParameter(eParams, "$$wfDate$$", wfDate);
		if (wfComment != null && typeof wfComment !== 'undefined') {
			addParameter(eParams, "$$wfComment$$", wfComment);
		}
		addParameter(eParams, "$$wfStaffUserID$$", wfStaffUserID);
		addParameter(eParams, "$$wfHours$$", wfHours);

		sendEmailWithReport(emailTo, emailTemplateName, reportName, rptParams, eParams);
	} else {
		return false;
	}
	return true;
}
