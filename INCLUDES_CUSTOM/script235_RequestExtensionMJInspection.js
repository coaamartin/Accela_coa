
function requestExtensionMJInspection(vCapType) {

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

    //check for extension request and schedule new inspection
    for (s in inspectionTypesAry) {
        if (inspType == inspectionTypesAry[s] && inspResult == "Request for Extension") {
			var vInspector = getInspectorByInspID(inspId, capId);
			var vInspType = inspType;
			var vInspStatus = "Scheduled";
		
			var newInspSchedDate = dateAddHC3(inspSchedDate, daysToAdd, "Y");
			
			var inspResultComment;
			var vInspComments;
			
			if (inspResultComment != "" || inspResultComment != null) {
				vInspComments = inspResultComment;				
			} else {
				vInspComments = inspComment;
			}
			
			//Schedule the inspection with the result comments from the current inspection.
			scheduleInspectDate(inspType, newInspSchedDate, null, null, vInspComments);
			var newInspId = getScheduledInspId(inspType);
			if (newInspId) {
				copyGuideSheetItemsByStatus(inspId, newInspId);
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
    }
}