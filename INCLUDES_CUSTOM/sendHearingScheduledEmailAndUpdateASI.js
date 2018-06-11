
/**
 * Check wfTask and wfStatus if matched, update ASI field from meeting date in meetingType and send email to Applicant
 * @param workFlowTaskToCheck
 * @param workflowStatusArray
 * @param meetingType
 * @param asiFieldName
 * @param emailTemplate
 * @returns {Boolean}
 */
function sendHearingScheduledEmailAndUpdateASI(workFlowTaskToCheck, workflowStatusArray, meetingType, asiFieldName, emailTemplate) {
    logDebug("sendHearingScheduledEmailAndUpdateASI() started.");
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
				meetingDate = dateAdd(meetingDate, 0);
				var olduseAppSpecificGroupName = useAppSpecificGroupName;
				useAppSpecificGroupName = false;
				editAppSpecific(asiFieldName, meetingDate);
				var noOfSigns = getAppSpecific("Number of Signs");
				useAppSpecificGroupName = olduseAppSpecificGroupName;
				
				if(noOfSigns == undefined || noOfSigns == null || noOfSigns == "") noOfSigns = "";
				//Send email
				var recordApplicant = getContactByType("Applicant", capId);
				var applicantEmail = null;
				if (!recordApplicant || recordApplicant.getEmail() == null || recordApplicant.getEmail() == "") {
					logDebug("**WARN no applicant or applicant has no email, capId=" + capId);
				} else {
					applicantEmail = recordApplicant.getEmail();
					var applicantName = recordApplicant.getFullName();
					var caseManagerEmail = getAssignedStaffEmail();
					var caseManagerPhone = getAssignedStaffPhone();
					if(isBlankOrNull(caseManagerEmail)==true) caseManagerEmail = "";

					var files = new Array();
					var eParams = aa.util.newHashtable();
					addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
					addParameter(eParams, "$$ContactEmail$$", applicantEmail);
					addParameter(eParams, "$$ContactFullName$$", applicantName);
					addParameter(eParams, "$$pcDate$$", meetingDate);
					addParameter(eParams, "$$10dayspriortopcDate$$", dateAdd(meetingDate, -10));
					addParameter(eParams, "$$numberofSigns$$", noOfSigns);
					addParameter(eParams, "$$StaffPhone$$", caseManagerPhone);
					addParameter(eParams, "$$StaffEmail$$", caseManagerEmail);
					
					//addParameter(eParams, "$$recordAlias$$", cap.getCapModel().getCapType().getAlias());
					//addParameter(eParams, "$$recordStatus$$", cap.getCapModel().getCapStatus());
					//addParameter(eParams, "$$balance$$", feeBalance(""));
					//addParameter(eParams, "$$wfTask$$", wfTask);
					//addParameter(eParams, "$$wfStatus$$", wfStatus);
					//addParameter(eParams, "$$wfDate$$", wfDate);
					//if (wfComment != null && typeof wfComment !== 'undefined') {
					//	addParameter(eParams, "$$wfComment$$", wfComment);
					//}
					//addParameter(eParams, "$$wfStaffUserID$$", wfStaffUserID);
					//addParameter(eParams, "$$wfHours$$", wfHours);

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