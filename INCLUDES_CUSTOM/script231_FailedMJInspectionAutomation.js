 /**
 * reschedule same inspection, 7 days after completed inspection date, if inspection type/result matches
 * @param inspectionTypesAry
 * @param inspReqResult
 * @param daysToAdd
 * @param emailTemplateName
 * @param reportName
 * @param rptParams
 * @returns {Boolean}
 *
 */
function failedMJInspectionAutomation(inspectionTypesAry, inspReqResult, daysToAdd, emailTemplateName, reportName, rptParams) {

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
			//if (inspComment)
			//	addParameter(eParams, "$$inspComment$$", inspComment);
			if (inspResultDate)
				addParameter(eParams, "$$inspResultDate$$", inspResultDate);
			if (inspGroup)
				addParameter(eParams, "$$inspGroup$$", inspGroup);
			if (inspType)
				addParameter(eParams, "$$inspType$$", inspType);
			if (inspSchedDate)
				addParameter(eParams, "$$inspSchedDate$$", inspSchedDate);
			
			//send email with report attachment
			sendNotification("noreply@aurora.gov",applicant.getEmail(),"",emailTemplateName,eParams,"",capId);
			return true;
		}//inspType/Result matched
	}//for all inspection types

	return false;
}