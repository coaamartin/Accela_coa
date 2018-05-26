
function scheduleForestryRequestPlantingSiteReview(inspectionTypeForestrySiteReview) {
    var inspectorID = getInspectorID();

    if (typeof (inspectorID) != "undefined" && inspectorID != null && inspectorID != "")
        scheduleInspection(inspectionTypeForestrySiteReview, 0, inspectorID);
}
