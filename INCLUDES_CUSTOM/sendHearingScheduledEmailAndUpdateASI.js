function sendHearingScheduledEmailAndUpdateASI(workFlowTaskToCheck, workflowStatusArray, meetingType, asiFieldName, emailTemplate) {
	logDebug("sendHearingScheduledEmailAndUpdateASI() started.");
	logDebug("Meeting Type" + meetingType);
	logDebug("workflow " + workFlowTaskToCheck);
    logDebug("ASI " + asiFieldName);

	if (cap.getCapModel().getCapType().getSubType().equalsIgnoreCase("Address")) {
		return false;
	}

	if (wfTask == workFlowTaskToCheck) {

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

		//Update ASI
		var meetings = aa.meeting.getMeetingsByCAP(capId, true);
		if (!meetings.getSuccess()) {
			logDebug("**ERROR could not get meeting capId=" + capId + " error:" + meetings.getErrorMessage());
			return;
		}
		meetings = meetings.getOutput().toArray();
		for (m in meetings) {
			if (meetings[m].getMeeting().getMeetingType() != null && meetings[m].getMeeting().getMeetingType().equalsIgnoreCase(meetingType)) {
				//Edit ASI
				var meetingDate = new Date(meetings[m].getMeeting().getStartDate().getTime());
				meetingDate = aa.util.formatDate(meetingDate, "MM/DD/YYYY");
				var olduseAppSpecificGroupName = useAppSpecificGroupName;
				useAppSpecificGroupName = false;
				logDebug("Meeting Date " + meetingDate);
				editAppSpecific(asiFieldName, meetingDate);
				useAppSpecificGroupName = olduseAppSpecificGroupName;

				//Send email
				var recordApplicant = getContactByType("Applicant", capId);
				var applicantEmail = null;
				if (!recordApplicant || recordApplicant.getEmail() == null || recordApplicant.getEmail() == "") {
					logDebug("**WARN no applicant or applicant has no email, capId=" + capId);
				} else {
					applicantEmail = recordApplicant.getEmail();
					logDebug("Applicant Email" + applicantEmail);
					var files = new Array();
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

					var sent = aa.document.sendEmailByTemplateName("", applicantEmail, "", emailTemplate, eParams, files);
					if (!sent.getSuccess()) {
						logDebug("**WARN sending email failed, error:" + sent.getErrorMessage());
						return false;
					}
				}//applicant OK
				return true;
			}//meetingType match
		}//for all meetings
		logDebug("**WARN no meeting of type=" + meetingType + " capId=" + capId);
		return false;
	} else {
		return false;
	}
}