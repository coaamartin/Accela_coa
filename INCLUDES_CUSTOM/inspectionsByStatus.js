
/**
 * check record if any inspection with the given statu exists
 * @param recordCapId record capId to check
 & @param inspectionStatus status to check inspections for
 * @returns {Boolean} true if all inspections were completed, false otherwise
 */
function inspectionsByStatus(recordCapId, inspectionStatus) {
	var t = aa.inspection.getInspections(recordCapId);
	if (t.getSuccess()) {
		var n = t.getOutput();
		for (xx in n)
			if (n[xx].getInspectionStatus().toUpperCase().equals(inspectionStatus.toUpperCase()))
				return true;
	} else {
		logDebug("**ERROR failed to get inspections, error: " + t.getErrorMessage());
		return false;
	}
	return false;
}