logDebug("ASA:CityClerk/Incident/NA/NA");
include("5110_CodeTempSignCTRCA");
var altId = capId;
var altId2 = capId.getCustomID();
var tempCheck = altId.indexOf("TMP");
logDebug("TempCheck: " + tempCheck);
if (tempCheck.equals(1)){
    logDebug("Temp check came back with: " + tempCheck);
    bug("altId: " + altId);
    logDebug("altId2: " + altId2);
} else {
    logDebug("Going to have 5110 script tirgger.")
//     include("5110_CodeTempSignCTRCA");
}


// logDebug("altId: " + altId);
// logDebug("altId2: " + altId2);

// if (ifTracer(altId2.equals("*TMP*"))) {
//      logDebug("Going to have the CTRCA event trigger.");
// } else {
//     
// }