function requestExtensionMJInspection() {

    // list MJ inspection types
    var inspectionTypesAry = ["MJ AMED Inspection", "MJ Building Inspection - Electrical", "MJ Building Inspection - Life Safety",
        "MJ Building Inspection - Mechanical", "MJ Building Inspection - Plumbing", "MJ Building Inspection - Structural", "MJ Security Inspection - 3rd Party",
        "MJ Zoning Inspection"];

    //define number of days to schedule next inspection
    var daysToAdd = 7;

    //check for extension request and schedule new inspection 7 days out
    for (s in inspectionTypesAry) {
        if (inspType == inspectionTypesAry[s] && inspResult == "Request for Extension") {

            var daysToAdd = 7;
			var newInspSchedDate = dateAdd(inspResultDate, daysToAdd);
			
			var vInspComments;
			
			if (inspResultComment != "" || inspResultComment != null) {
				vInspComments = inspResultComment;				
			} else {
				vInspComments = inspComment;
			}
			
			//Schedule the inspection with the result comments from the current inspection.
			scheduleInspectDate(inspType, newInspSchedDate, currentUserID, null, vInspComments);
        }
    }
}