logDebug("ASA:CityClerk/Incident/NA/NA");
include("5110_CodeTempSignCTRCA");
checkACARun();

function checkACARun() {
var altId = capId;
var altId2 = capId.getCustomID();
var tempCheck = altId.substring(2, 5);
logDebug("TempCheck: " + tempCheck);


if (tempCheck === "TMP"){
    logDebug("Temp check came back with: " + tempCheck);
    logDebug("altId: " + altId);
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
}