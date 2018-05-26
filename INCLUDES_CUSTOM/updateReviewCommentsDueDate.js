function updateReviewCommentsDueDate(workFlowTask, workFlowStatus, firstReviewDateASI, secondReviewDateASI, thirdReviewDateASI, meetingType, planningCommissionDateASI,
    applicant2ndSubmissionDateASI, applicant3rdSubmissionDateASI, emailTemplate, recordURL) {

// Stories
if (matches(wfTask, workFlowTask) && matches(wfStatus, workFlowStatus)) {
    var firstReviewDate = getAppSpecific(firstReviewDateASI);
    var secondReviewDate = getAppSpecific(secondReviewDateASI);
    var thirdReviewDate = getAppSpecific(thirdReviewDateASI);
    var closesMeetingDate;

    if (isEmpty(firstReviewDate)) {
        // If Custom Field "1st Review Comments Due date" is null
        // Then update it with Today + 15 days
        firstReviewDate = dateAdd(new Date(), 15, true);
        editAppSpecific(firstReviewDateASI, firstReviewDate);
        // And update the custom Field "Projected Planning Commission Hearing date" by searching the Planning
        // Commission Meeting Calendar returning the "Planning Commission Meeting" closest to 6.5 weeks from the current date
        closesMeetingDate = getClosesMeetingDate(6.5, meetingType);
        editAppSpecific(planningCommissionDateASI, aa.util.formatDate(closesMeetingDate, "MM/dd/yyyy"));
    } else if (!isEmpty(firstReviewDate) && isEmpty(secondReviewDate)) {
        // If custom field "1st Review Comments Due date" is not null and
        // custom field "2nd Review Comments Due date" is null 
        // Then update the field "2nd Review Comments Due date" with Today + 15 days
        secondReviewDate = dateAdd(new Date(), 15);
        editAppSpecific(secondReviewDateASI, secondReviewDate);
        // And update the custom Field "Projected Planning Commission Hearing date" by searching the Planning
        // Commission Meeting Calendar returning the "Planning Commission Meeting" closest to 6 weeks from the current date
        closesMeetingDate = getClosesMeetingDate(6, meetingType);
        editAppSpecific(planningCommissionDateASI, aa.util.formatDate(closesMeetingDate, "MM/dd/yyyy"));
        // Also update the Custom Field "Applicant 2nd Submission Date" to Today + 20 days
        var appSecondSubmissionDate = dateAdd(new Date(), 20);
        editAppSpecific(applicant2ndSubmissionDateASI, appSecondSubmissionDate);
    } else if (!isEmpty(firstReviewDate) && !isEmpty(secondReviewDate) && isEmpty(thirdReviewDate)) {
        // If custom field "1st Review Comments Due date" is not null and
        // custom field "2nd Review Comments Due date" is not null and 
        // custom field "3rd Review Comments Due Date" is null
        // Then update the field "3rd Review Comments Due Date" with Today + 10 days
        thirdReviewDate = dateAdd(new Date(), 10);
        editAppSpecific(thirdReviewDateASI, thirdReviewDate);
        // And update the custom Field "Projected Planning Commission Hearing date" by searching the Planning
        // Commission Meeting Calendar returning the "Planning Commission Meeting" closest to 5 weeks from the current date
        closesMeetingDate = getClosesMeetingDate(5, meetingType);
        editAppSpecific(planningCommissionDateASI, aa.util.formatDate(closesMeetingDate, "MM/dd/yyyy"));
        // Also update the Custom Field "Applicant 3rd Submission Date" to Today + 15 days
        var appthirdSubmissionDate = dateAdd(new Date(), 15);
        editAppSpecific(applicant3rdSubmissionDateASI, appthirdSubmissionDate);
    } else if (!isEmpty(firstReviewDate) && !isEmpty(secondReviewDate) && !isEmpty(thirdReviewDate)) {
        closesMeetingDate = getClosesMeetingDate(5, meetingType);
        editAppSpecific(planningCommissionDateASI, aa.util.formatDate(closesMeetingDate, "MM/dd/yyyy"));
        var appthirdSubmissionDate = dateAdd(new Date(), 15);
        editAppSpecific(applicant3rdSubmissionDateASI, appthirdSubmissionDate);
    }
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
}
}
