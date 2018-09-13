
function failedMJInspectionAutomation(vCapType) {

	var daysToAdd;
	
	// list MJ inspection types
	var inspectionTypesAry = [ "MJ AMED Inspections", "MJ Building Inspections - Electrical", "MJ Building Inspections - Life Safety",
		"MJ Building Inspections - Mechanical", "MJ Building Inspections - Plumbing", "MJ Building Inspections - Structural", "MJ Security Inspections - 3rd Party",
		"MJ Zoning Inspections", "MJ Building Inspections", "MJ Code Enforcement Inspections", "MJ Planning Inspections", "MJ Security Inspections - Police" ];
	
	//define number of days to schedule next inspection
	if (vCapType == "Application"){
		daysToAdd = 1;
	} else {
		daysToAdd = 7;
	}
	var emailTemplateName = "LIC MJ INSPECTION CORRECTION REPORT # 231";		
			
	//check for failed inspections, schedule new inspection, and email applicant with report
	for (s in inspectionTypesAry) {
		if (inspType == inspectionTypesAry[s] && inspResult == "Failed") {
			var vInspector = getInspector(inspId);
			
			//schedule new inspection 7 days out from failed inspection date
			var newInspSchedDate = dateAdd(inspResultDate, daysToAdd);
			scheduleInspectDate(inspType, newInspSchedDate);
			
			//get sequence ID for most recently created inspection
			var lastInspectionObj = getLastCreatedInspection(capId, inspType);
			if (lastInspectionObj == null) {
				logDebug("Failed to find most recent inspection of type " + inspType);
				continue;
			}
			
			var lastInspectionSeq = lastInspectionObj.getIdNumber();
			
			//assign inspection to inspector
			assignInspection(lastInspectionSeq, vInspector);
			

			var eParams = aa.util.newHashtable();
			addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
			addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
			addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());

			var reportTemplate = "MJ_Compliance_Corrections_Letter";
			var reportParams = aa.util.newHashtable();
			addParameter(reportParams, "InspActNumber", inspId);
			
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
			
			//send email with report attachment
			emailContactsWithReportLinkASync("Applicant,Responsible Party", emailTemplateName, eParams, reportTemplate, reportParams, "N", "");
			
			return true;
		}
	}
	return false;
}

//returns object of most recently scheduled inspection
function getLastCreatedInspection(capId, inspectionType) {
	//get inspections for this cap (of type inspectionType)
	var capInspections = aa.inspection.getInspections(capId);
	if (!capInspections.getSuccess()) {
		return false;
	}
	capInspections = capInspections.getOutput();

	var schedInspWithMaxId = null;
	//find last one (we created)
	for (i in capInspections) {
		if (capInspections[i].getInspectionType() == inspectionType && capInspections[i].getInspectionStatus() == "Scheduled") {

			//if multiple scheduled of same type, make sure to get last one (maxID)
			if (schedInspWithMaxId == null || schedInspWithMaxId.getIdNumber() < capInspections[i].getIdNumber()) {
				schedInspWithMaxId = capInspections[i];
			}
		}
	}
	return schedInspWithMaxId;
}