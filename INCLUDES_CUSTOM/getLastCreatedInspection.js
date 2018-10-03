
//returns object of most recently scheduled inspection
function getLastCreatedInspection(capId, inspectionType, inspectionStatus) {
	//get inspections for this cap (of type inspectionType)
	var capInspections = aa.inspection.getInspections(capId);
	if (!capInspections.getSuccess()) {
		return false;
	}
	capInspections = capInspections.getOutput();

	var schedInspWithMaxId = null;
	//find last one (we created)
	for (i in capInspections) {
		if (capInspections[i].getInspectionType() == inspectionType && capInspections[i].getInspectionStatus() == inspectionStatus) {

			//if multiple scheduled of same type, make sure to get last one (maxID)
			if (schedInspWithMaxId == null || schedInspWithMaxId.getIdNumber() < capInspections[i].getIdNumber()) {
				schedInspWithMaxId = capInspections[i];
			}
		}
	}
	return schedInspWithMaxId;
}