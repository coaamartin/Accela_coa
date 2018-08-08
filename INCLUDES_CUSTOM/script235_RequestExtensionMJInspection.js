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

            var inspResultObj = aa.inspection.getInspections(capId);
            var vInsp;
            var x = 0;
            var inspComments;
            var newInspSchedDate;

            if (inspResultObj.getSuccess()) {

                inspResultObj = inspResultObj.getOutput();

                for (x in inspResultObj) {

                    vInsp = inspResultObj[x];

                    if (vInsp.getInspectionType() == inspType) {

                        //copy comments from existing inspection to new
                        inspComments = vInsp.getInspectionComments();
                        
                        logDebug("Inspection: " + vInsp.getIdNumber());
                        logDebug("Inspection Comments: " + vInsp.getInspectionComments());
                        
                        newInspSchedDate = dateAdd(inspResultDate, daysToAdd);

                        scheduleInspectDate(inspType, newInspSchedDate, null, null, inspComments);
                        break;
                    }
                }
            } else {
                logDebug("Failed to get inspections: " + inspResultObj.getErrorMessage());
            }
        }
    }
}