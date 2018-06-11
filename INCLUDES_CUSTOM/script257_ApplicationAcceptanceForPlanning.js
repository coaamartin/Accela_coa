
/**
 * Check wfTask and wfStatus if matched, update ASI field from meeting date in meetingType and send email to Applicant
 * @param workFlowTaskToCheck
 * @param workflowStatusArray
 * @param meetingType
 * @param asiFieldName
 * @param emailTemplate
 * @returns {Boolean}
 */
function script257_ApplicationAcceptanceForPlanning(workFlowTask, workFlowStatus, firstReviewDateASI, meetingType, planningCommissionDateASI, emailTemplate, recordURL) {

if (cap.getCapModel().getCapType().getSubType().equalsIgnoreCase("Address")) {
		return false;
	}

if (matches(wfTask, workFlowTask) && matches(wfStatus, workFlowStatus)) {
		var firstReviewDate = getAppSpecific(firstReviewDateASI);
		logDebug("*****Enter script257_ApplicationAcceptanceForPlanning function*****");

		
		if (isEmpty(firstReviewDate)) {
        // If Custom Field "1st Review Comments Due date" is null
        // Then update it with Today + 15 days
        firstReviewDate = dateAdd(new Date(), 15, true);
        editAppSpecific(firstReviewDateASI, firstReviewDate);
        // And update the custom Field "Projected Planning Commission Hearing date" by searching the Planning
        // Commission Meeting Calendar returning the "Planning Commission Meeting" closest to 6.5 weeks from the current date
        closesMeetingDate = getClosesMeetingDate(6.5, meetingType);
        editAppSpecific(planningCommissionDateASI, aa.util.formatDate(closesMeetingDate, "MM/dd/yyyy"));
    }
		
/*
		meetings = meetings.getOutput().toArray();
		for (m in meetings) {
			if (meetings[m].getMeeting().getMeetingType() != null && meetings[m].getMeeting().getMeetingType().equalsIgnoreCase(meetingType)) {
				//Edit ASI
				var meetingDate = new Date(meetings[m].getMeeting().getStartDate().getTime());
				meetingDate = aa.util.formatDate(meetingDate, "MM/DD/YYYY");
				var olduseAppSpecificGroupName = useAppSpecificGroupName;
				useAppSpecificGroupName = false;
				editAppSpecific(asiFieldName, meetingDate);
				useAppSpecificGroupName = olduseAppSpecificGroupName;
				
				//Send email
				var recordApplicant = getContactByType("Applicant", capId);
				var applicantEmail = null;
				if (!recordApplicant || recordApplicant.getEmail() == null || recordApplicant.getEmail() == "") {
					logDebug("**WARN no applicant or applicant has no email, capId=" + capId);
				} else {
					applicantEmail = recordApplicant.getEmail();

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
*/
	} else {
		return false;
	}
}