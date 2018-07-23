
/**
 * check all completed inspections on record if result matches inspResult
 * @param inspResult
 * @returns {Boolean} return true if any of inspections has Result = inspResult, false otherwise
 */
function checkAnyInspectionPassed(recordCapId) {
	var n = aa.inspection.getInspections(recordCapId);
	if (n.getSuccess()) {
		var r = n.getOutput();
		for (xx in r)
			if (String("Complete").equals(r[xx].getInspectionStatus()))
				return true;
	}
	return false;
}