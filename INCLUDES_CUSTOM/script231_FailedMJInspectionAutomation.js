
function failedMJInspectionAutomation() {
	
	// list MJ inspection types
	var inspectionTypesAry = [ "MJ AMED Inspection", "MJ Building Inspection - Electrical", "MJ Building Inspection - Life Safety",
		"MJ Building Inspection - Mechanical", "MJ Building Inspection - Plumbing", "MJ Building Inspection - Structural", "MJ Security Inspection - 3rd Party",
		"MJ Zoning Inspection" ];
	
	//define number of days to schedule next inspection
	var daysToAdd = 7;
	var emailTemplateName = "LIC MJ INSPECTION CORRECTION REPORT # 231";
		
	//check for failed inspections, schedule new inspection, and email applicant with report
	for (s in inspectionTypesAry) {
		if (inspType == inspectionTypesAry[s] && inspResult == "Failed") {
			
			//schedule new inspection 7 days out from failed inspection date
			var newInspSchedDate = dateAdd(inspResultDate, daysToAdd);
			scheduleInspectDate(inspType, newInspSchedDate);

			var eParams = aa.util.newHashtable();
			addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
			addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
			addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());

			var reportTemplate = "MJ_License";
			var reportParams = aa.util.newHashtable();
			addParameter(reportParams, "Record_ID", capIDString);
			
			if (inspId) {
				addParameter(eParams, "$$inspId$$", inspId);
				reportParams.put("inspId", inspId);
			}
			if (inspResult)
				addParameter(eParams, "$$inspResult$$", inspResult);
			if (inspResultDate)
				addParameter(eParams, "$$inspResultDate$$", inspResultDate);
			if (inspGroup)
				addParameter(eParams, "$$inspGroup$$", inspGroup);
			if (inspType)
				addParameter(eParams, "$$inspType$$", inspType);
			if (inspSchedDate)
				addParameter(eParams, "$$inspSchedDate$$", inspSchedDate);
			
			//send email with report attachment
			//emailContacts("Applicant", "LIC MJ INSPECTION CORRECTION REPORT # 231", eParams, reportTemplate, reportParams);
			emailContactsWithReportLinkASync("Applicant", emailTemplateName, eParams, reportTemplate, reportParams, "N", "");
			
			return true;
		}
	}

	return false;
}