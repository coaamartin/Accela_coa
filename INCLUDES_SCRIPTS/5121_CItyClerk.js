//Written by rprovinc   
//
//include("5121_CityClerkWTUA.js");

//*****************************************************************************
//Script WTUA;CityClerk!Incident!~!~.js
//Record Types:	CityClerk\Incident\*\* 
//Event: 		WTUA
//Desc:			Going to update the fee when ever a CityClerk record is open and Non-Profit is set to No.
//
//Created By: Rprovinc
//******************************************************************************


//var envParameters = aa.util.newHashMap();
//var nonProfit = AInfo["Non Profit"];
var vASIValue = getAppSpecific("Non Profit");
var nonProfit = vASIValue;
var envParameters = aa.util.newHashMap();
envParameters.put("capId", capId);
envParameters.put("cap", cap);
envParameters.put("appType", appTypeString);

var appGroup = getJobParam("appGroup"); //   app Group to process {Licenses}
var appTypeType = getJobParam("appTypeType"); //   app type to process {Rental License}
var appSubtype = getJobParam("appSubtype"); //   app subtype to process {NA}
var appCategory = getJobParam("appCategory");
if (!appMatchArray) {
    appGroup = appGroup == "" ? "*" : appGroup;
    appTypeType = appTypeType == "" ? "*" : appTypeType;
    appSubtype = appSubtype == "" ? "*" : appSubtype;
    appCategory = appCategory == "" ? "*" : appCategory;
    var appType = appGroup + "/" + appTypeType + "/" + appSubtype + "/" + appCategory;
    appMatchArray = [appType];
}


if ((nonProfit = "No") && (appMatchArray = "CityClerk/Incident/DonationBins/NA")) {
    var vASIValue = getAppSpecific("Non Profit");
    var nonProfit = vASIValue;
    var envParameters = aa.util.newHashMap();
    envParameters.put("capId", capId);
    envParameters.put("cap", cap);
    envParameters.put("appType", appMatchArray);
    logDebug("CapID: " + capId);
    logDebug("Cap: " + cap);
    logDebug("appType", appMatchArray);
    logDebug("Starting to invoice fee on record.");
    var feecode = "CC_DB";
    var feeschedule = "CC_DB";
    var thefee = "1";
    //feeseqnum =    addFee(feecode, feeschedule, 'FINAL', parseFloat(thefee), 'Y');
    updateFee(feecode, feeschedule, "FINAL", parseFloat(thefee), "Y", "N");
    logDebug("End of Script 5121_CityClerkWTUA.js");
}

//Temp Use code
else if ((nonProfit = "No") && (appMatchArray = "CityClerk/Incident/TempUse/NA")) {
    var vASIValue = getAppSpecific("Non Profit");
    var nonProfit = vASIValue;
    var envParameters = aa.util.newHashMap();
    envParameters.put("capId", capId);
    envParameters.put("cap", cap);
    envParameters.put("appType", appMatchArray);
    logDebug("CapID: " + capId);
    logDebug("Cap: " + cap);
    logDebug("appType", appMatchArray);
    logDebug("Starting to invoice fee on record.");
    var feecode = "CC_DB";
    var feeschedule = "CC_DB";
    var thefee = "1";
    //feeseqnum =    addFee(feecode, feeschedule, 'FINAL', parseFloat(thefee), 'Y');
    updateFee(feecode, feeschedule, "FINAL", parseFloat(thefee), "Y", "N");
    logDebug("End of Script 5121_CityClerkWTUA.js");
}

//Temp Sign code
else if ((nonProfit = "No") && (appMatchArray = "CityClerk/Incident/TempSign/NA")) {
    var vASIValue = getAppSpecific("Non Profit");
    var nonProfit = vASIValue;
    var envParameters = aa.util.newHashMap();
    envParameters.put("capId", capId);
    envParameters.put("cap", cap);
    envParameters.put("appType", appMatchArray);
    logDebug("CapID: " + capId);
    logDebug("Cap: " + cap);
    logDebug("appType", appMatchArray);
    logDebug("Starting to invoice fee on record.");
    var feecode = "CC_DB";
    var feeschedule = "CC_DB";
    var thefee = "1";
    //feeseqnum =    addFee(feecode, feeschedule, 'FINAL', parseFloat(thefee), 'Y');
    updateFee(feecode, feeschedule, "FINAL", parseFloat(thefee), "Y", "N");
    logDebug("End of Script 5121_CityClerkWTUA.js");
}