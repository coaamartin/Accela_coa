
function passedMJInspectionAutomation() {
	
	// list MJ inspection types
	var inspectionTypesAry = [ "MJ AMED Inspections", "MJ Building Inspections - Electrical", "MJ Building Inspections - Life Safety",
		"MJ Building Inspections - Mechanical", "MJ Building Inspections - Plumbing", "MJ Building Inspections - Structural", "MJ Security Inspections - 3rd Party",
		"MJ Zoning Inspections", "MJ Building Inspections", "MJ Code Enforcement Inspections", "MJ Planning Inspections", "MJ Security Inspections - Police" ];
	
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
				var vInspector = getInspectorByInspID(inspId, capId);
				logDebug("vInspector: " + vInspector);
				var vInspType = inspType;
				var vInspStatus = "Scheduled";
				
				//check if license is Marijuana/Retail Store
				if (vIsMJRetailStoreLicense == true) {
					var vChildren = getRenewalCountByParentCapIDForComplete(capId);
					
					//check if more than one child renewal record exists
					if (vChildren != false && vChildren != null && vChildren > 1) {
						
						//schedule new inspection 6 months out from passed inspection date
						daysToAdd = 182;
						var newInspSchedDate = dateAdd(inspSchedDate, daysToAdd);
						scheduleInspectDate(inspType, newInspSchedDate);
						
						//get sequence ID for most recently created inspection
						var lastInspectionObj = getLastCreatedInspection(capId, vInspType, vInspStatus);
						if (lastInspectionObj == null) {
							logDebug("Failed to find most recent inspection of type " + vInspType);
							continue;
						}
						
						var lastInspectionSeq = lastInspectionObj.getIdNumber();
						
						//assign inspection to inspector
						assignInspection(lastInspectionSeq, vInspector);
					} else {
						
						//schedule new inspection 3 months out from passed inspection date
						daysToAdd = 91;
						var newInspSchedDate = dateAdd(inspSchedDate, daysToAdd);
						scheduleInspectDate(inspType, newInspSchedDate);	

						//get sequence ID for most recently created inspection
						var lastInspectionObj = getLastCreatedInspection(capId, vInspType, vInspStatus);
						if (lastInspectionObj == null) {
							logDebug("Failed to find most recent inspection of type " + vInspType);
							continue;
						}
						
						var lastInspectionSeq = lastInspectionObj.getIdNumber();
						
						//assign inspection to inspector
						assignInspection(lastInspectionSeq, vInspector);
					}					
				} else {
					
					//schedule new inspection 3 months out from passed inspection date
					//var newInspSchedDate = dateAdd(inspSchedDate, daysToAdd);
					daysToAdd = 91;
					var newInspSchedDate = getAppSpecific("Next Inspection Date");
					scheduleInspectDate(inspType, newInspSchedDate);
					
					//logDebug("checkCompletedMJInspections result: " + checkCompletedMJInspections(newInspSchedDate));
					if (checkCompletedMJInspections(newInspSchedDate)) {
						//update ASI
						editAppSpecific("Next Inspection Date", dateAdd(newInspSchedDate, daysToAdd));
					}
					
					//get sequence ID for most recently created inspection
					var lastInspectionObj = getLastCreatedInspection(capId, vInspType, vInspStatus);
					if (lastInspectionObj == null) {
						logDebug("Failed to find most recent inspection of type " + vInspType);
						continue;
					}
					
					var lastInspectionSeq = lastInspectionObj.getIdNumber();
					
					//assign inspection to inspector
					assignInspection(lastInspectionSeq, vInspector);
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




function checkCompletedMJInspections(newInspSchedDate) {
	var newInspSchedDate = new Date(newInspSchedDate);
	var vCapInspections = getInspections();
	var vCapInspType;
	var vCapInspResult;
	var vCapInspSchedDate;
	var vCapInspDate;
	var vInspectionTypesArray = [ "MJ AMED Inspections", "MJ Building Inspections - Electrical", "MJ Building Inspections - Life Safety",
		"MJ Building Inspections - Mechanical", "MJ Building Inspections - Plumbing", "MJ Building Inspections - Structural", "MJ Security Inspections - 3rd Party",
		"MJ Zoning Inspections", "MJ Building Inspections", "MJ Code Enforcement Inspections", "MJ Planning Inspections", "MJ Security Inspections - Police" ];
	
	var vAllInspPass = true;
	
	for (j in vCapInspections) {
		vCapInspType = vCapInspections[j].getInspectionType();
		vCapInspResult = vCapInspections[j].getInspectionStatus();
		vCapInspDate = vCapInspections[j].getInspectionDate();
		vCapInspSchedDate = vCapInspections[j].getScheduledDate();
		
		vCapInspDate = convertDate(vCapInspDate);
		vCapInspSchedDate = convertDate(vCapInspSchedDate);
		
		
		
		for (i in vInspectionTypesArray) {
			if (vCapInspType == vInspectionTypesArray[i]) {
				if (vCapInspDate != null) {
					logDebug("##############");
					logDebug("Inspection Type: " + vInspectionTypesArray[i]);
					logDebug("vCapInspDate: " + vCapInspDate);
					logDebug("vCapInspSchedDate: " + vCapInspSchedDate);
					logDebug("newInspSchedDate: " + newInspSchedDate);
					logDebug("vCapInspResult: " + vCapInspResult);
					logDebug("##############");
					
					if (!(vCapInspDate <= newInspSchedDate && vCapInspDate >= vCapInspSchedDate && (vCapInspResult == "Passed" || vCapInspResult == "Passed - Minor Violations"))) {
						logDebug("Failed the check");
						vAllInspPass = false;
					} 
				}
			}
			
		}
	}
	logDebug("vAllInspPass: " + vAllInspPass);
	if (vAllInspPass == true) {
		return true;
	} else {
		return false;
	}
}






















