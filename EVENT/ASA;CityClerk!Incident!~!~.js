logDebug("ASA:CityClerk/Incident/NA/NA");

var altId = capId;
var altId2 = capId.getCustomID();
logDebug("altId: " + altId);
logDebug("altId2: " + altId2);

if (ifTracer(altId2 = "*TMP*")) {
     logDebug("Going to have the CTRCA event trigger.");
} else {
    logDebug("Going to have 5110 script tirgger.")
   //include("5110_CodeTempSignCTRCA");
}