
function passedMJInspectionAutomation() {
	
	// list MJ inspection types
	var inspectionTypesAry = [ "MJ AMED Inspections", "MJ Building Inspections - Electrical", "MJ Building Inspections - Life Safety",
		"MJ Building Inspections - Mechanical", "MJ Building Inspections - Plumbing", "MJ Buidling Inspections - Structural", "MJ Security Inspections - 3rd Party",
		"MJ Zoning Inspections" ];
	
	//define number of days to schedule next inspection
	var daysToAdd;
	var vIsMJLicense;
	var vIsMJRetailStoreLicense;
	var emailTemplate = "LIC MJ COMPLIANCE #232";
		
	//check for passed inspections, schedule new inspection, and email inspection contact with report
	for (s in inspectionTypesAry) {
		vIsMJLicense = false;	
		vIsMJRetailStoreLicense = false;
		vIsMJLicense = appMatch("Licenses/Marijuana/*/License");
		if (vIsMJLicense == true) {
			if (inspType == inspectionTypesAry[s] && (inspResult == "Passed" || inspResult == "Passed - Minor Violations")) {
				vIsMJRetailStoreLicense = appMatch("Licenses/Marijuana/Retail Store/License");
				
				//check if license is Marijuana/Retail Store
				if (vIsMJRetailStoreLicense == true) {
					var vChildren = getRenewalCountByParentCapIDForComplete(capId);
					
					//check if more than one child renewal record exists
					if (vChildren != false && vChildren != null && vChildren > 1) {
						
						//schedule new inspection 6 months out from passed inspection date
						daysToAdd = 180;
						var newInspSchedDate = dateAdd(inspResultDate, daysToAdd);
						scheduleInspectDate(inspType, newInspSchedDate);
					} else {
						
						//schedule new inspection 3 months out from passed inspection date
						daysToAdd = 90;
						var newInspSchedDate = dateAdd(inspResultDate, daysToAdd);
						scheduleInspectDate(inspType, newInspSchedDate);						
					}					
				} else {
					
					//schedule new inspection 3 months out from passed inspection date
					daysToAdd = 90;
					var newInspSchedDate = dateAdd(inspResultDate, daysToAdd);
					scheduleInspectDate(inspType, newInspSchedDate);	
				}
				
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

				return true;
			}			
		}
	}
	return false;
}

function getRenewalCountByParentCapIDForComplete(parentCapid) {
	if (parentCapid == null || aa.util.instanceOfString(parentCapid)) {
		return null;
	}
	//1. Get parent license for analysis
	var result = aa.cap.getProjectByMasterID(parentCapid, "Renewal", "Complete");
	var vRenewalCounter = 0;
	if (result.getSuccess()) {
		projectScriptModels = result.getOutput();
		if (projectScriptModels == null || projectScriptModels.length == 0) {
			logDebug("ERROR: Failed to get renewal CAP by parent CAPID(" + parentCapid + ") for complete");
			return null;
		}
		//2. return number of completed renewals
		 for (i in projectScriptModels) {
			 vRenewalCounter = vRenewalCounter + 1;
		 }
		return vRenewalCounter;
	} else {
		logDebug("ERROR: Failed to get renewal CAP by parent CAP(" + parentCapid + ") for complete: " + result.getErrorMessage());
		return null;
	}
}