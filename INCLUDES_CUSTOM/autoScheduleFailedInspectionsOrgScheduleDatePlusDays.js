/**
 * reschedule same inspection, n days after original schedule date, if inspection type/result matches
 * @param inspectionTypesAry
 * @param inspReqResult
 * @param daysToAdd
 * @param emailTemplateName
 * @param reportName
 * @param rptParams
 * @returns {Boolean}
 *
 * 07/25/2018 (evontrapp) - Updated newInspSchedDate to add 7 days from date of result (inspResultDate), rather than date of scheduled inspection (inspSchedDate)
 * 07/25/2018 (evontrpap) - Removed reference to sendEmailWithReport() function, and replaced with sendNotification function
 */
function autoScheduleFailedInspectionsOrgScheduleDatePlusDays(inspectionTypesAry, inspReqResult, daysToAdd, emailTemplateName, reportName, rptParams) {

	for (s in inspectionTypesAry) {
		if (inspType == inspectionTypesAry[s] && inspResult == inspReqResult) {
			
			//schedule new inspection
			var newInspSchedDate = dateAdd(inspResultDate, daysToAdd);
			scheduleInspectDate(inspType, newInspSchedDate);

			//get applicant
			var applicant = getContactByType("Applicant", capId);
			if (!applicant || !applicant.getEmail()) {
				logDebug("**WARN no applicant found on or no email capId=" + capId);
				return false;
			}

			var eParams = aa.util.newHashtable();
			addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
			addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
			addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());

			if (inspId) {
				addParameter(eParams, "$$inspId$$", inspId);
				rptParams.put("inspId", inspId);
			}
			if (inspResult)
				addParameter(eParams, "$$inspResult$$", inspResult);
			if (inspComment)
				addParameter(eParams, "$$inspComment$$", inspComment);
			if (inspResultDate)
				addParameter(eParams, "$$inspResultDate$$", inspResultDate);
			if (inspGroup)
				addParameter(eParams, "$$inspGroup$$", inspGroup);
			if (inspType)
				addParameter(eParams, "$$inspType$$", inspType);
			if (inspSchedDate)
				addParameter(eParams, "$$inspSchedDate$$", inspSchedDate);
			
			//send email with report attachment
			sendNotification("noreply@aurora.gov",applicant.getEmail(),"",emailTemplateName,eParams,"",capID);
			return true;
		}//inspType/Result matched
	}//for all inspection types

	return false;
}