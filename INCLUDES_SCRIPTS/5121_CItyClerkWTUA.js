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

if (wfTask == "Review Application" && wfStatus == "Complete") {
    logDebug("Starting to invoice fee on record.");	 
    var feecode = "";
    var feeschedule = "";
    var thefee = "";
    //feeseqnum =    addFee(feecode, feeschedule, 'FINAL', parseFloat(thefee), 'Y');
    updateFee(feecode, feeschedule, "FINAL", parseFloat(thefee), "Y", "N");
    logDebug("End of Script 5120_HOAReferenceFile.js");
    
    }
