
function passedMJInspectionAutomation() {
	var daysToAdd;
	var vIsMJLicense;
	var vIsMJRetailStoreLicense;
	var emailTemplate = "LIC MJ COMPLIANCE #232";
	var inspectionTypesAry = [ "MJ AMED Inspections", "MJ Building Inspections - Electrical", "MJ Building Inspections - Life Safety",
		"MJ Building Inspections - Mechanical", "MJ Building Inspections - Plumbing", "MJ Building Inspections - Structural", "MJ Security Inspections - 3rd Party",
		"MJ Zoning Inspections", "MJ Building Inspections", "MJ Code Enforcement Inspections", "MJ Planning Inspections", "MJ Security Inspections - Police" ];
		
	//check for passed inspections, schedule new inspection, and email inspection contact with report
	//for (s in inspectionTypesAry) {
		vIsMJLicense = false;	
		vIsMJRetailStoreLicense = false;
		vIsMJLicense = appMatch("Licenses/Marijuana/*/License");
		if (vIsMJLicense == true) {
			//if (inspType == inspectionTypesAry[s] && (inspResult == "Passed" || inspResult == "Passed - Minor Violations")) {
			if (inspResult == "Passed" || inspResult == "Passed - Minor Violations") {
				vIsMJRetailStoreLicense = appMatch("Licenses/Marijuana/Retail Store/License");
				var vInspector = getInspectorByInspID(inspId, capId);
				logDebug("vInspector: " + vInspector);
				var vInspType = inspType;
				var vInspStatus = "Scheduled";
				var initialInspSchedDate = getAppSpecific("Initial Inspection Date");
				var newInspSchedDate = getAppSpecific("Next Inspection Date");
				
				initialInspSchedDate = new Date(initialInspSchedDate);
				
				//check if license is Marijuana/Retail Store
				if (vIsMJRetailStoreLicense == true) {
					//var vChildren = getRenewalCountByParentCapIDForComplete(capId);
					
					//check if more than 300 days has passed since the initial inspection
					//if (vChildren != false && vChildren != null && vChildren > 1) {
					if (dateDiff(initialInspSchedDate, today) >= 300) {
						
						logDebug("Switching to 6-month inspection cycle for MJ Store");
						//schedule new inspection 6 months out from passed inspection date
						daysToAdd = 182;
					} else {
						
						//schedule new inspection 3 months out from passed inspection date
						daysToAdd = 91;
					}					
				} else {
					
					//schedule new inspection 3 months out from passed inspection date
					daysToAdd = 91;
				}
				
				scheduleInspectDate(inspType, newInspSchedDate);
				if (checkCompletedMJInspections(newInspSchedDate, initialInspSchedDate, daysToAdd)) {
					//update ASI
					editAppSpecific("Next Inspection Date", dateAdd(newInspSchedDate, daysToAdd));
				}
				
				//get sequence ID for most recently created inspection
				var lastInspectionObj = getLastCreatedInspection(capId, vInspType, vInspStatus);
				if (lastInspectionObj == null) {
					logDebug("Failed to find most recent inspection of type " + vInspType);
					//continue;
				}
				
				var lastInspectionSeq = lastInspectionObj.getIdNumber();
				
				//assign inspection to inspector
				assignInspection(lastInspectionSeq, vInspector);
			
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
				//emailContactsWithReportLinkASync("Inspection Contact", emailTemplate, eParams, reportTemplate, reportParams, "N", "");

				return true;
			}			
		}
	//}
	return false;
}

//returns the number of completed renewals on a parent license
/*function getRenewalCountByParentCapIDForComplete(parentCapid) {
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
}*/

//scans array of inspections from current quarterly inspection cycle, returns true if all 8 inspection types are present
function checkCompletedMJInspections(newInspSchedDate, initialInspSchedDate, daysToAdd) {
	var newInspSchedDate = new Date(newInspSchedDate);
	//var initialInspSchedDate = new Date(initialInspSchedDate);
	var vCapInspections = getInspectionsThisCycle(newInspSchedDate, initialInspSchedDate, daysToAdd);
	var vCapInspType;
	var vCapInspResult;
	var vInspTypeCounter = 0;
	var vInspectionTypesArray = [ "MJ AMED Inspections", "MJ Building Inspections - Electrical", "MJ Building Inspections - Life Safety",
		"MJ Building Inspections - Mechanical", "MJ Building Inspections - Plumbing", "MJ Building Inspections - Structural", "MJ Security Inspections - 3rd Party",
		"MJ Zoning Inspections", "MJ Building Inspections", "MJ Code Enforcement Inspections", "MJ Planning Inspections", "MJ Security Inspections - Police" ];

	for (j in vCapInspections) {
		vCapInspType = vCapInspections[j].getInspectionType();
		vCapInspResult = vCapInspections[j].getInspectionStatus();
		
		for (i in vInspectionTypesArray) {
			if (vCapInspType == vInspectionTypesArray[i]) {

				logDebug("##############");
				logDebug("Inspection Type: " + vInspectionTypesArray[i]);
				logDebug("vCapInspResult: " + vCapInspResult);
				logDebug("inspectionID: " + vCapInspections[j].getIdNumber());
				
				vInspTypeCounter++;	
			}
		}
	}
	if (vInspTypeCounter == 8) {
		return true;
	} else {
		return false;
	}
}

//returns array of the most recent inspections from the given inspection cycle
function getInspectionsThisCycle(newInspSchedDate, initialInspSchedDate, daysToAdd) {

	var retInspections = [];
	
	var priArray = aa.inspection.getInspections(capId);
	var secArray = aa.inspection.getInspections(capId);
	
	var vCapInspDate;
	var vCompInspDate;
	var vCapInspSchedDate;
	var vCapCompSchedDate;
	var vBeginCycle =  new Date();
	var vFirstCycle = false;
	
	if (dateDiff(fileDate, newInspSchedDate) <= 175) {
		vFirstCycle = true;
	}
	
	if (vFirstCycle) {
		vBeginCycle.setMonth(initialInspSchedDate.getMonth());
		vBeginCycle.setFullYear(initialInspSchedDate.getFullYear());
		vBeginCycle.setDate(initialInspSchedDate.getDate() - 1);
		vBeginCycle.setHours(0);
		vBeginCycle.setMinutes(0);
		vBeginCycle.setSeconds(0);
		vBeginCycle = new Date(vBeginCycle);
	} else {
		vBeginCycle.setMonth(newInspSchedDate.getMonth());
		vBeginCycle.setFullYear(newInspSchedDate.getFullYear());
		vBeginCycle.setDate(newInspSchedDate.getDate() - daysToAdd);
		vBeginCycle.setHours(0);
		vBeginCycle.setMinutes(0);
		vBeginCycle.setSeconds(0);
		vBeginCycle = new Date(vBeginCycle);
	}
	
	logDebug("vBeginCycle: " + vBeginCycle);
	
	if (priArray.getSuccess()) {
		
		var inspArray = priArray.getOutput();
		var compArray = secArray.getOutput();

		for (i in inspArray) {
			for (j in compArray) {		
				vCapInspDate = inspArray[i].getInspectionDate();
				vCompInspDate = compArray[j].getInspectionDate();
				vCapInspSchedDate = inspArray[i].getScheduledDate();
				vCapCompSchedDate = compArray[j].getScheduledDate();
				
				if (vCapInspDate != null) {
					vCapInspDate = convertDate(vCapInspDate);
				}
				if (vCompInspDate != null) {
					vCompInspDate = convertDate(vCompInspDate);
				}
				if (vCapInspSchedDate != null) {
					vCapInspSchedDate = convertDate(vCapInspSchedDate);
				}
				if (vCapCompSchedDate != null) {
					vCapCompSchedDate = convertDate(vCapCompSchedDate);
				}

				if (vCapInspSchedDate >= vBeginCycle && vCapCompSchedDate >= vBeginCycle && vCapInspSchedDate <= newInspSchedDate && vCapCompSchedDate <= newInspSchedDate) {
					if ((inspArray[i].getInspectionType() == compArray[j].getInspectionType())) {
						if (vCapInspDate <= newInspSchedDate && vCapInspDate >= vCapInspSchedDate && vCapInspDate != null && vCompInspDate <= newInspSchedDate && vCompInspDate >= vCapCompSchedDate && vCompInspDate != null) {	
							
							logDebug("##############");
							logDebug("Inspection Type: " + inspArray[i].getInspectionType());
							logDebug("Inspection Type: " + compArray[j].getInspectionType());
							logDebug("vCapInspDate: " + vCapInspDate);
							logDebug("vCapInspSchedDate: " + vCapInspSchedDate);
							logDebug("vCompInspDate: " + vCompInspDate);
							logDebug("vCapCompSchedDate: " + vCapCompSchedDate);
							logDebug("newInspSchedDate: " + newInspSchedDate);
							logDebug("inspectionID: " + inspArray[i].getIdNumber());
							logDebug("inspectionID: " + compArray[j].getIdNumber());
							
							var inspID = inspArray[i].getIdNumber();
							var compID = compArray[j].getIdNumber();
							var pos = -1;
							
							for (p in retInspections) {
								pos = retInspections[p].getInspectionType().indexOf(inspArray[i].getInspectionType());
								if (pos == 0) {
									pos = p;
									break;
								}							
							}
							if (pos == -1) {
								if (inspID >= compID) {
									retInspections.push(inspArray[i]);
								} else {
									retInspections.push(compArray[j]);
								}
							} else {
								if (retInspections[pos].getIdNumber() < inspID ||  retInspections[pos].getIdNumber() < compID) {
									if (inspID > compID) {
										retInspections[pos] = inspArray[i];
									} else {
										retInspections[pos] = compArray[j];
									}							
								}
							}
						}
					}
				}
			}
		}
	} 
	return retInspections;
}