//Part of Script 401 - Re Link to Parent after record is converted from a TMP to a real record
var permitNumber = getAppSpecific("Water Utility Permit Number");
if (permitNumber != null) {
	var parentCapId = aa.cap.getCapID(permitNumber).getOutput();
	addParent(parentCapId);
}