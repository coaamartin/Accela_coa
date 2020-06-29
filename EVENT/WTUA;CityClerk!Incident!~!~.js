//Written by rprovinc   
//
//include("5121_CityClerk.js");

//*****************************************************************************
//Script WTUA;CityClerk!Incident!~!~.js
//Record Types:	CityClerk\Incident\*\* 
//Event: 		ASA
//Desc:			Going to update the fee when ever a CityClerk record is open and Non-Profit is set to No.
//
//Created By: Rprovinc
//******************************************************************************
logDebug("Starting WTUA;CityClerk!Incident!~!~.js");
if (wfTask == "Planning Director Approval" && wfStatus == "Approved") {

	// Script 5121_CityClerk
    include("5121_CityClerk");
	
}
