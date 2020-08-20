logDebug("ASA:CityClerk/Incident/NA/NA");
//include("5122_CityClerk_Notifications");
//include("EMSE:ConvertToRealCapAfter");
var altId = capId.getCustomID();
logDebug("Record ID: " + altId);
if (altID.equals("%TMP%")) {
logDebug("Going to have the CTRCA event trigger.");
}
else {
include("5110_CodeTempSignCTRCA");    
}

