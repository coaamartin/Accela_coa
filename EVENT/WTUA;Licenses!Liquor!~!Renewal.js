if (currentUserID == "ACHARLTO"){
showDebug = 3;
}

if (wfStatus == "Issue License") {
	aa.runScript("APPLICATIONSUBMITAFTER4RENEW");
	include("2053_RenewalUpdateLicense");
}