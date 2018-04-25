function addInspectionFeeAndSendEmail(workFlowTask, workflowStatusArray, asiFieldName, emailTemplateName, reportName, rptParams) {

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

		//Get ASI value:
		var olduseAppSpecificGroupName = useAppSpecificGroupName;
		useAppSpecificGroupName = false;
		var asiValue = getAppSpecific(asiFieldName);
		useAppSpecificGroupName = olduseAppSpecificGroupName;

		//Add Fees
		var feeAmt = 0;
		if (asiValue == "Commercial") {
			feeAmt = 138;
		} else if (asiValue == "Residential") {
			feeAmt = 30.75;
		}

		addFee("WAT_IPLAN_01", "WAT_IPLAN", "FINAL", feeAmt, "Y");

		var ownerEmail = null, applicantEmail = null;
		var owners = aa.owner.getOwnerByCapId(capId);
		if (owners.getSuccess()) {
			owners = owners.getOutput();
			if (owners == null || owners.length == 0) {
				logDebug("**WARN no owners on record " + capId);
				ownerEmail = "";
			} else {
				ownerEmail = owners[0].getEmail();
			}//len=0

		} else {
			logDebug("**Failed to get owners on record " + capId + " Error: " + owners.getErrorMessage());
			return false;
		}
		var recordApplicant = getContactByType("Applicant", capId);
		if (recordApplicant) {
			applicantEmail = recordApplicant.getEmail();
		} else {
			applicantEmail = "";
			logDebug("**WARN no Applicant on record " + capId);
		}

		if ((ownerEmail == null || ownerEmail == "") && (applicantEmail == null || applicantEmail == "")) {
			logDebug("**WARN owner and applicant has no emails, capId=" + capId);
			return false;
		}

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

		sendEmailWithReport(ownerEmail, applicantEmail, emailTemplateName, reportName, rptParams, eParams);

	} else {
		return false;
	}

	return true;
}