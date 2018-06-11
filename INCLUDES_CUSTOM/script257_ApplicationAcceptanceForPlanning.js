
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
		var closesMeetingDate;
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
	var applicantEmail = null;
    var recordApplicant = getContactByType("Applicant", capId);
    if (recordApplicant) {
        applicantEmail = recordApplicant.getEmail();
    }
    if (applicantEmail == null) {
        logDebug("**WARN Applicant on record " + capId + " has no email");
        return false
    }
    var files = new Array();
    var emailParams = aa.util.newHashtable();
    addParameter(emailParams, "$$altID$$", cap.getCapModel().getAltID());
    addParameter(emailParams, "$$recordAlias$$", cap.getCapModel().getCapType().getAlias());
    addParameter(emailParams, "$$recordStatus$$", cap.getCapModel().getCapStatus());
    addParameter(emailParams, "$$wfComment$$", wfComment);
    addParameter(emailParams, "$$wfTask$$", wfTask);
    addParameter(emailParams, "$$wfStatus$$", wfStatus);
    addParameter(emailParams, "$$acaRecordUrl$$", recordURL);
    var sent = aa.document.sendEmailByTemplateName("", applicantEmail, "", emailTemplate, emailParams, files);
    if (!sent.getSuccess()) {
        logDebug("**ERROR sending email failed, error:" + sent.getErrorMessage());
        return false;
    }
*/
	} else {
		return false;
	}
}