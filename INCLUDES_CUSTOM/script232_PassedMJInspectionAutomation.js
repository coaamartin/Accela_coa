
function passedMJInspectionAutomation() {
	
	// list MJ inspection types
	var inspectionTypesAry = [ "MJ AMED Inspection", "MJ Building Inspection - Electrical", "MJ Building Inspection - Life Safety",
		"MJ Building Inspection - Mechanical", "MJ Building Inspection - Plumbing", "MJ Building Inspection - Structural", "MJ Security Inspection - 3rd Party",
		"MJ Zoning Inspection" ];
	
	//define number of days to schedule next inspection
	var daysToAdd;
		
	
		
	//check for passed inspections, schedule new inspection, and email inspection contact with report
	for (s in inspectionTypesAry) {
		if (inspType == inspectionTypesAry[s] && (inspResult == "Passed" || inspResult == "Passed - minor violation")) {
			
			var vIsMJLicense = false;	
			var vIsRetailStoreLicense = false;
			
			vIsMJLicense = appMatch("Licenses/Marijuana/*/License");		
			vIsMJRetailStoreLicense = appMatch("Licenses/Marijuana/Retail Store/License");
	
			if (vIsMJLicense == true) {
				
				//check if license is Marijuana/Retail Store
				if (vIsMJRetailStoreLicense == true) {
					
					var vChildren = getChildren("Licenses/Marijuana/*/Renewal", capId);
					
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
				emailContacts("Inspection Contact", "LIC MJ COMPLIANCE #232", eParams, reportTemplate, reportParams);		
			
			}			
		
			return true;
		}
	}
	
	return false;
}