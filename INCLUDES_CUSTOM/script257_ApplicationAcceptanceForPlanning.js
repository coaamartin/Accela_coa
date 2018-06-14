
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
		logDebug("*****Enter NEW script257_ApplicationAcceptanceForPlanning function*****");

		
		if (isEmpty(firstReviewDate)) {
		logDebug("**script257: step 1**");
        // If Custom Field "1st Review Comments Due date" is null
        // Then update it with Today + 15 days
        firstReviewDate = dateAdd(new Date(), 15, true);
        editAppSpecific(firstReviewDateASI, firstReviewDate);
        // And update the custom Field "Projected Planning Commission Hearing date" by searching the Planning
        // Commission Meeting Calendar returning the "Planning Commission Meeting" closest to 6.5 weeks from the current date
        
		
		var dToday = new Date();
		dToday = ("0" + (dToday.getMonth() + 1)).slice(-2) + "/" 
				+ ("0" + dToday.getDate()).slice(-2) + "/" 
				+ dToday.getYear();
		var lookForPlanningMtgDate	= aa.date.parseDate(dateAdd("03/01/2018",(7*6.5)));
		var lookForMMDDYYYY = ("0" + lookForPlanningMtgDate.getMonth()).slice(-2) + "/" 
								+ ("0" + lookForPlanningMtgDate.getDayOfMonth()).slice(-2) + "/" 
								+ lookForPlanningMtgDate.getYear();
		logDebug("lookforMMDDYYYY:"+lookForMMDDYYYY);
		//Set up the 'look back' from the target date for searching
		var lookForStartDate		= aa.date.parseDate(aa.date.addDate(lookForMMDDYYYY,0));
		logDebug("you lookForStartDate is:"+lookForStartDate.getMonth()+"/"+lookForStartDate.getDayOfMonth()+"/"+lookForStartDate.getYear());
		
		//Set up the 'look forward' from the target date for searching
		var lookForEndDate			= aa.date.parseDate(aa.date.addDate(lookForMMDDYYYY,+45));
		logDebug("you lookForStartDate is:"+lookForEndDate.getMonth()+"/"+lookForEndDate.getDayOfMonth()+"/"+lookForEndDate.getYear());
		
		var newPlnMtg = getClosestAvailableMeeting("Planning Commission", lookForPlanningMtgDate, lookForStartDate, lookForEndDate, "PLANNING COMMISSION");
		logDebug("**script257: step 2**");

		// now set the ASI values you need to update for this If
		editAppSpecific("1st Review Comments Due date",dateAdd(null,15));
		if (newPlnMtg != null) {
			logDebug("----------------the new planning meet date is:"+newPlnMtg.meetingId+"----------------");
			//printObjProperties(newPlnMtg);
				var newHearingDate = (""+ newPlnMtg.startDate).slice(5,7)+"/" 
								+(""+ newPlnMtg.startDate).slice(8,10)+"/"
								+(""+ newPlnMtg.startDate).slice(0,4);
			logDebug("now updating the date with:"+newHearingDate);
			editAppSpecific("Projected Planning Commission Date",newHearingDate);
		} else {
			logDebug("Script 273: WARNING - there is no planning commission date within 45 days of your target date!");
			comment("<B><Font Color=RED>WARNING - there is no planning commission date within 45 days of your target date!</Font></B>");
		}
		
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

	} else {
		return false;
	}
}