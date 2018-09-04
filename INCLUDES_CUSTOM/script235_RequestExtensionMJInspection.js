function requestExtensionMJInspection() {

    // list MJ inspection types
    var inspectionTypesAry = ["MJ AMED Inspections", "MJ Building Inspections - Electrical", "MJ Building Inspections - Life Safety",
        "MJ Building Inspections - Mechanical", "MJ Building Inspections - Plumbing", "MJ Building Inspections - Structural", "MJ Security Inspections - 3rd Party",
        "MJ Zoning Inspections"];

    //define number of days to schedule next inspection
    var daysToAdd = 7;

    //check for extension request and schedule new inspection 7 days out
    for (s in inspectionTypesAry) {
        if (inspType == inspectionTypesAry[s] && inspResult == "Request for Extension") {

            var daysToAdd = 7;
			var newInspSchedDate = dateAdd(inspResultDate, daysToAdd);
			
			var inspResultComment;
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