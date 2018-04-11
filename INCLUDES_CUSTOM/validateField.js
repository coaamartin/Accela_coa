function validateField(asiFieldReceived, specialInspections) {
	for (xx in specialInspections) {

		if (specialInspections[xx].getCheckboxDesc() != asiFieldReceived) {
			continue;
		}

		if (typeof (specialInspections[xx].getChecklistComment()) != "undefined" && !isBlankOrNull(specialInspections[xx].getChecklistComment())) {
			return true;
		} else {
			return false;
		}
	}
	return false;
}
