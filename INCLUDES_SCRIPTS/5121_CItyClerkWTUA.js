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
if (nonProfit = "No") {
    logDebug("Starting to invoice fee on record.");	 
    var feecode = "CC_CIE";
    var feeschedule = "CC_CIE";
    var thefee = "62";
    //feeseqnum =    addFee(feecode, feeschedule, 'FINAL', parseFloat(thefee), 'Y');
    updateFee(feecode, feeschedule, "FINAL", parseFloat(thefee), "Y", "N");
    logDebug("End of Script 5121_CityClerkWTUA.js");
    }
