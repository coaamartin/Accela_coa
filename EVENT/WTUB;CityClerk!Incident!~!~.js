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

// if(ifTracer(wfTask == "City Manager's Office Approval" && wfStatus == "Approved")){
//     //Script to verify that the payment has been processed
//     if(balanceDue > 0){
//         cancel = true;
//         showMessage = true;
//         comment("All fees need to be paid before issuing application");
//     }
// }
// logDebug("Starting to send notification to the planning director");
// if(wfTask == "Planning Director Approval") {
//     logDebug("Starting to send notification to the Planning Director");
//     include("5122_CityClerk_Notifications");
//     logDebug("Finished sending notification to the Planning Director");
// }