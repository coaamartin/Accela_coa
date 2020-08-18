//Written by rprovinc   
//
//include("");

//*****************************************************************************
//Script WTUB;CityClerk!Incident!~!~.js
//Record Types:	CityClerk\Incident\*\* 
//Event: 		Workflow task update before
//Desc:			Going to verify the fee has been paid before processing the record.
//
//Created By: Rprovinc
//******************************************************************************

if (wfTask == "Planning Director Approval" && wfStatus == "In Progress") {
        logDebug("Starting to send notification to the Planning Director");
        include("5122_CityClerk_Notifications");
        logDebug("Finished sending notification to the Planning Director");
    }
