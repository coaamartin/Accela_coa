logDebug("ASA:CityClerk/Incident/NA/NA");
//include("5122_CityClerk_Notifications");
//include("EMSE:ConvertToRealCapAfter");
//var altId = capId;
logDebug("Record ID: " + capID);
if (capID.equals("%TMP%")) {
logDebug("Going to have the CTRCA event trigger.");
}
else {
include("5110_CodeTempSignCTRCA");    
}

