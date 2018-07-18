/**
 * check if any inspection was finished with result 'Complete', it sends email to owner and applicant and updates an ASI field
 * @param emailTemplateName
 * @param reportName
 * @param rptParams
 * @param asiFieldName
 * @returns {Boolean}
 */
function checkInspectionsResultAndSendEmail(emailTemplateName, reportName, rptParams, asiFieldName) {
	var anyPassedInsp = checkAnyInspectionPassed(capId);
	if (anyPassedInsp) {

		//Update ASI
		var newDate = dateAdd(new Date(), 1095);//1095 = 3 years
		editAppSpecific(asiFieldName, newDate);

		//Send the email
		var ownerEmail = null, applicantEmail = null;
		var owners = aa.owner.getOwnerByCapId(capId);
		if (owners.getSuccess()) {
			owners = owners.getOutput();
			if (owners == null || owners.length == 0) {
				logDebug("**WARN no owners on record " + capId);
				return false;
			}//len=0

			ownerEmail = owners[0].getEmail();
		} else {
			logDebug("**Failed to get owners on record " + capId + " Error: " + owners.getErrorMessage());
			return false;
		}
		var recordApplicant = getContactByType("Applicant", capId);
		if (recordApplicant) {
			applicantEmail = recordApplicant.getEmail();
		}

		if (ownerEmail == null || ownerEmail == "") {
			logDebug("**WARN Owner on record " + capId + " has no email");
			return false
		}

		var emailParams = aa.util.newHashtable();
		addParameter(emailParams, "$$altID$$", cap.getCapModel().getAltID());
		addParameter(emailParams, "$$recordAlias$$", cap.getCapModel().getCapType().getAlias());
		addParameter(emailParams, "$$recordStatus$$", cap.getCapModel().getCapStatus());
		addParameter(emailParams, "$$balance$$", feeBalance(""));

		addParameter(emailParams, "$$inspID$$", inspId);
		addParameter(emailParams, "$$inspResult$$", inspResult);
		addParameter(emailParams, "$$inspComment$$", inspComment);
		addParameter(emailParams, "$$inspResultDate$$", inspResultDate);
		addParameter(emailParams, "$$inspGroup$$", inspGroup);
		addParameter(emailParams, "$$inspType$$", inspType);
		if (inspSchedDate) {
			addParameter(emailParams, "$$inspSchedDate$$", inspSchedDate);
		} else {
			addParameter(emailParams, "$$inspSchedDate$$", "N/A");
		}

		sendEmailWithReport(ownerEmail, applicantEmail, emailTemplateName, reportName, rptParams, emailParams);

	}//anyPassedInsp
	return true;
}