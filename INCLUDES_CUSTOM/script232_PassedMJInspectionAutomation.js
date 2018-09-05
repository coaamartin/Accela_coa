
function passedMJInspectionAutomation() {
	logDebug("***INFO: Beginning Script 232***");
	// list MJ inspection types
	var inspectionTypesAry = [ "MJ AMED Inspections", "MJ Building Inspections - Electrical", "MJ Building Inspections - Life Safety",
		"MJ Building Inspections - Mechanical", "MJ Building Inspections - Plumbing", "MJ Building Inspections - Structural", "MJ Security Inspections - 3rd Party",
		"MJ Zoning Inspections" ];
	
	//define number of days to schedule next inspection
	var daysToAdd;
		
	
		
	//check for passed inspections, schedule new inspection, and email inspection contact with report
	for (s in inspectionTypesAry) {
		if (inspType == inspectionTypesAry[s] && (inspResult == "Passed" || inspResult == "Passed - Minor Violations")) {

			var vIsMJLicense = false;	
			var vIsRetailStoreLicense = false;
			
			vIsMJLicense = appMatch("Licenses/Marijuana/*/License");		
			vIsMJRetailStoreLicense = appMatch("Licenses/Marijuana/Retail Store/License");
	
			if (vIsMJLicense == true) {
				logDebug("Inspection Type: " + inspType);
				logDebug("Inspection Result: " + inspResult);
				//check if license is Marijuana/Retail Store
				if (vIsMJRetailStoreLicense == true) {
					
					//var vChildren = getChildren("Licenses/Marijuana/*/Renewal", capId);
					var vChildren = getRenewalCountByParentCapIDForComplete(capId);
					
					
					logDebug("vChildren Value: " + vChildren);
					//check if more than one child renewal record exists
					if (vChildren != false && vChildren != null && vChildren.length > 1) {
						
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
					//schedule new inspection 3 months out from passed inspection date
					daysToAdd = 90;
					var newInspSchedDate = dateAdd(inspResultDate, daysToAdd);
					scheduleInspectDate(inspType, newInspSchedDate);	
				}
				
				//get inspection contact
				var inspectionContact = getContactByType("Inspection Contact", capId);
				if (!inspectionContact || !inspectionContact.getEmail()) {
					logDebug("**WARN no inspection contact found on or no email capId=" + capId);
					return false;
				}

				var eParams = aa.util.newHashtable();
				addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
				addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
				addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());

				var reportTemplate = "";
				var reportParams = aa.util.newHashtable();
				addParameter(reportParams, "RecordID", capIDString);
				
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
				emailContacts(inspectionContact, "LIC MJ COMPLIANCE #232", eParams, reportTemplate, reportParams);		
				logDebug("***INFO: Ending Script 232***");
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
	//1. Get parent license for review
	var result = aa.cap.getProjectByMasterID(parentCapid, "Renewal", "Complete");
	var vRenewalCounter = 0;
	if (result.getSuccess()) {
		projectScriptModels = result.getOutput();
		if (projectScriptModels == null || projectScriptModels.length == 0) {
			logDebug("ERROR: Failed to get renewal CAP by parent CAPID(" + parentCapid + ") for complete");
			return null;
		}
		//2. return parent CAPID.
		//projectScriptModel = projectScriptModels[0];
		 for (i in projectScriptModels) {
			 vRenewalCounter = vRenewalCounter + 1;
		 }
		
		return vChildrenCounter;
	} else {
		logDebug("ERROR: Failed to get renewal CAP by parent CAP(" + parentCapid + ") for complete: " + result.getErrorMessage());
		return null;
	}
}