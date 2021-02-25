var diff = new Date(inspResultDate) - new Date(inspSchedDate);

if (diff < 0) {
	cancel = true;
	showMessage = true;
	message = "You can only result the inspection on or after Inspection Scheduled Date.";
	logDebug("You can only result the inspection on or after Inspection Scheduled Date.");
}