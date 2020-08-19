if (currentUserID == "ACHARLTO"){
showDebug = 3;
}
logDebug("Starting WTUA Renewal for Supplemental");
if (wfStatus == "Issue License") {
	include("2053_RenewalUpdateLicense");
}
logDebug("End of WTUA Renewal for Supplemental");