
function scheduleForestryRequestPlantingSiteReview(inspectionTypeForestrySiteReview) {
    var inspectorID = getAssignedStaff();
    
    if (typeof (inspectorID) != "undefined" && inspectorID != null && inspectorID != "")
        scheduleInspection(inspectionTypeForestrySiteReview, 0, inspectorID);
}
