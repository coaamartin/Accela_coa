
function createAndAssignPendingInspection(inspectionGroupCode, inspectionTypeForestryInspection) {
    createPendingInspection(inspectionGroupCode, inspectionTypeForestryInspection);
    var assignedStaff = getAssignedStaff();
    var inspectionID = getPendingInspectionID();

    if (inspectionID != null && inspectionID != "" && assignedStaff != null && assignedStaff != "")
        assignInspection(inspectionID, assignedStaff);
}