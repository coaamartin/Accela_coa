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

var vASIValue = getAppSpecific("Non Profit");
var appTypeString = getAppSpecific("Application Type");
var nonProfit = vASIValue;
logDebug("appType: " + appTypeString);//undefinded here...

if (nonProfit = "No") {
    logDebug("appType before next step in code: " + appTypeString);
    
    if (appTypeString = "CityClerk/Incident/DonationBins/NA") {
        logDebug("appType: " + appTypeString);
        logDebug("Starting to invoice fee on record.");
        var feecode = "CC_DB";
        var feeschedule = "CC_DB";
        var thefee = "1";
        //feeseqnum =    addFee(feecode, feeschedule, 'FINAL', parseFloat(thefee), 'Y');
        updateFee(feecode, feeschedule, "FINAL", parseFloat(thefee), "Y", "N");
        logDebug("End of Script 5121_CityClerk.js");
    }
    //Temp Use code
    else if (appTypeString = "CityClerk/Incident/TempUse/NA") {
        logDebug("appType" + appTypeString);
        logDebug("Starting to invoice fee on record.");
        var feecode = "CC_TU";
        var feeschedule = "CC_TU";
        var thefee = "1";
        //feeseqnum =    addFee(feecode, feeschedule, 'FINAL', parseFloat(thefee), 'Y');
        updateFee(feecode, feeschedule, "FINAL", parseFloat(thefee), "Y", "N");
        logDebug("End of Script 5121_CityClerk.js");
    }

    //Temp Sign code
    else if (appTypeString = "CityClerk/Incident/TempSign/NA") {
        logDebug("appType" + appTypeString);
        logDebug("Starting to invoice fee on record.");
        var feecode = "CC_TS";
        var feeschedule = "CC_TS";
        var thefee = "1";
        //feeseqnum =    addFee(feecode, feeschedule, 'FINAL', parseFloat(thefee), 'Y');
        updateFee(feecode, feeschedule, "FINAL", parseFloat(thefee), "Y", "N");
        logDebug("End of Script 5121_CityClerk.js");
    }
}