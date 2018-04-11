
function cancelForestryInspection(workFlowTask, workflowStatusArray, inspTypeToCancel) {

	if (wfTask == workFlowTask) {

		var statusMatch = false;

		for (s in workflowStatusArray) {
			if (wfStatus == workflowStatusArray[s]) {
				statusMatch = true;
				break;
			}
		}//for all status options

		if (!statusMatch) {
			return false;
		}

		var inspections = aa.inspection.getInspections(capId);
		if (!inspections.getSuccess()) {
			logDebug("**WARN get inspection failed capId=" + capId + " Error:" + inspections.getErrorMessage());
			return false;
		}

		inspections = inspections.getOutput();
		for (i in inspections) {
			if (inspections[i].getInspectionType() == inspTypeToCancel && inspections[i].getInspectionStatus() == "Scheduled") {
				var canceled = aa.inspection.cancelInspection(capId, inspections[i].getIdNumber());
				if (!canceled.getSuccess()) {
					logDebug("**WARN cancelInspection failed capId=" + capId + " InspectionId=" + inspections[i].getIdNumber() + " Error:" + inspections.getErrorMessage());
				}
				return canceled.getSuccess();
			}//Scheduled inspection found
		}//for all inspections
	} else {
		return false;
	}

	return false;
}