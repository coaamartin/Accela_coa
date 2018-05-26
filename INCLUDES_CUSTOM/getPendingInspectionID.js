
function getPendingInspectionID() {
    var inspID;
    var objInspResult = aa.inspection.getInspections(capId);
    if (objInspResult.getSuccess()) {
        var listInspection = objInspResult.getOutput();
        for (l in listInspection) {
            var inspectionType = listInspection[l].getInspectionType();
            var inspectionStatus = listInspection[l].getInspectionStatus();
            if (typeof (inspectionType) != "undefined" && inspectionType != null && inspectionType != "" && typeof (inspectionStatus) != "undefined" && inspectionStatus != null && inspectionStatus != "") {
                if (inspectionType.toLowerCase() == "forestry inspection" && inspectionStatus.toLowerCase() == "pending") {
                    var inspID = listInspection[l].getIdNumber();
                    break;
                }
            }
        }
    }

    return inspID;
}
