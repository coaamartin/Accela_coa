/**
 * If any WF Task is updated to a status of Resubmittal Requested or if workflow task Accept Plans is updated to a status of
Accepted, update the Custom Field Application Expiration Date (now + 180 days)
 */
function updateExpirationDateAsi() {
	var asiFieldName = "Application Expiration Date";
	var numOfDays = 180;
	
	var now = formatDateX(aa.date.getCurrentDate());
    appExpDate = aa.date.addDate(now, numOfDays);
    editAppSpecific(asiFieldName, appExpDate);
}

/**
 * Format a ScriptDate mm/dd/yyyy
 * @param scriptDate
 * @returns {String} formatted date
 */
function formatDateX(scriptDate) {
	var ret = "";
	ret += scriptDate.getMonth().toString().length == 1 ? "0" + scriptDate.getMonth() : scriptDate.getMonth();
	ret += "/";
	ret += scriptDate.getDayOfMonth().toString().length == 1 ? "0" + scriptDate.getDayOfMonth() : scriptDate.getDayOfMonth();
	ret += "/";
	ret += scriptDate.getYear();
	return ret;
}
