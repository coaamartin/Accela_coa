
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
					var initialInspSchedDate = getAppSpecific("Initial Inspection Date");
					scheduleInspectDate(inspType, newInspSchedDate);
					
					//logDebug("checkCompletedMJInspections result: " + checkCompletedMJInspections(newInspSchedDate));
					if (checkCompletedMJInspections(newInspSchedDate, initialInspSchedDate)) {
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


function checkCompletedMJInspections(newInspSchedDate, initialInspSchedDate) {
	var newInspSchedDate = new Date(newInspSchedDate);
	var initialInspSchedDate = new Date(initialInspSchedDate);
	var vCapInspections = getInspectionsThisCycle(newInspSchedDate, initialInspSchedDate);
	var vCapInspType;
	var vCapInspResult;
	var vCapInspSchedDate;
	var vCapInspDate;
	var vInspectionTypesArray = [ "MJ AMED Inspections", "MJ Building Inspections - Electrical", "MJ Building Inspections - Life Safety",
		"MJ Building Inspections - Mechanical", "MJ Building Inspections - Plumbing", "MJ Building Inspections - Structural", "MJ Security Inspections - 3rd Party",
		"MJ Zoning Inspections", "MJ Building Inspections", "MJ Code Enforcement Inspections", "MJ Planning Inspections", "MJ Security Inspections - Police" ];
	
	//var vAllInspPass = false;
	var vInspTypeCounter = 0;
	
	for (j in vCapInspections) {
		vCapInspType = vCapInspections[j].getInspectionType();
		vCapInspResult = vCapInspections[j].getInspectionStatus();
		//vCapInspDate = vCapInspections[j].getInspectionDate();
		//vCapInspSchedDate = vCapInspections[j].getScheduledDate();
		
		/*if (vCapInspDate != null) {
			vCapInspDate = convertDate(vCapInspDate);
		}
		if (vCapInspSchedDate != null) {
			vCapInspSchedDate = convertDate(vCapInspSchedDate);
		}*/
		
		for (i in vInspectionTypesArray) {
			if (vCapInspType == vInspectionTypesArray[i]) {

					logDebug("##############");
					logDebug("Inspection Type: " + vInspectionTypesArray[i]);
					//logDebug("vCapInspDate: " + vCapInspDate);
					//logDebug("vCapInspSchedDate: " + vCapInspSchedDate);
					//logDebug("newInspSchedDate: " + newInspSchedDate);
					logDebug("vCapInspResult: " + vCapInspResult);
					logDebug("inspectionID: " + vCapInspections[j].getIdNumber());
					logDebug("##############");
					
					if (!(vCapInspResult == "Passed" || vCapInspResult == "Passed - Minor Violations")) {
						logDebug("Failed the check");
						//vAllInspPass = false;
					} 
				vInspTypeCounter++;	
			}
			
		}
	}
	logDebug("vInspTypeCounter: " + vInspTypeCounter);
	//logDebug("vAllInspPass: " + vAllInspPass);
	if (vInspTypeCounter == 8) {
		return true;
	} else {
		return false;
	}
}

//returns array of the most recent inspections from the given inspection cycle
function getInspectionsThisCycle(newInspSchedDate, initialInspSchedDate) {

	var retInspections = [];
	
	var priArray = aa.inspection.getInspections(capId);
	var secArray = aa.inspection.getInspections(capId);
	
	var vCapInspDate;
	var vCompInspDate;
	var vCapInspSchedDate;
	var vCapCompSchedDate;
	
	var vFirstCycle = false;
	
	logDebug("dateDiff(newInspSchedDate, initialInspSchedDate): " + dateDiff(newInspSchedDate, initialInspSchedDate));
	
	if (dateDiff(fileDate, newInspSchedDate) <= 175) {
		vFirstCycle = true;
		logDebug("vFirstCycle = true");
	}
	
	var vBeginCycle =  new Date();
	vBeginCycle.setMonth(newInspSchedDate.getMonth());
	vBeginCycle.setFullYear(newInspSchedDate.getFullYear());
	vBeginCycle.setDate(newInspSchedDate.getDate() - 91);
	vBeginCycle = new Date(vBeginCycle);
	
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
				
				if (vFirstCycle == true) {
					logDebug("vFirstCycle = true");
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
								logDebug("##############");
								
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
									logDebug("This type has been found in the array");
									if (retInspections[pos].getIdNumber() <= inspID ||  retInspections[pos].getIdNumber() <= compID) {
										if (inspID >= compID) {
											retInspections[pos] = inspArray[i];
										} else {
											retInspections[pos] = compArray[j];
										}							
									}
								}
							}
						}
				
				} else {
					if (vCapInspSchedDate >= vBeginCycle && vCapCompSchedDate >= vBeginCycle && vCapInspSchedDate < newInspSchedDate && vCapCompSchedDate < newInspSchedDate) {
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
								logDebug("##############");
								
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
									logDebug("This type has been found in the array");
									if (retInspections[pos].getIdNumber() <= inspID ||  retInspections[pos].getIdNumber() <= compID) {
										if (inspID >= compID) {
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
	} 
	return retInspections;
}





















