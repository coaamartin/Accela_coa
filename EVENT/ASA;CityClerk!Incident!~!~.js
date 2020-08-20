logDebug("ASA:CityClerk/Incident/NA/NA");
//include("5122_CityClerk_Notifications");
//include("EMSE:ConvertToRealCapAfter");
var altId = capId;
var altId2 = capId.getCustomID();
logDebug("altId: " + altId);
logDebug("altId2: " + altId2);

if (altId == "*tmp*") {
logDebug("Going to have the CTRCA event trigger.");
}
else {
include("5110_CodeTempSignCTRCA");    
}

