
function passedMJInspectionAutomation(vCapType) {
	var emailTemplate = "LIC MJ COMPLIANCE #232";

	//check for passed application inspections and email inspection contact with report
	if (vCapType == "Application") {
		if (inspResult == "Passed" || inspResult == "Passed - Minor Violations") {
			var eParams = aa.util.newHashtable();
			addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
			addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
			addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());
			
			if (inspId) {
				addParameter(eParams, "$$inspId$$", inspId);
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
			
			var reportTemplate = "MJ_Compliance_Corrections_Letter";
			var reportParams = aa.util.newHashtable();
			addParameter(reportParams, "InspActNumber", inspId);
			
			//send email with report attachment		
			emailContactsWithReportLinkASync("Inspection Contact", emailTemplate, eParams, reportTemplate, reportParams, "N", "");
		}
	} 
}
