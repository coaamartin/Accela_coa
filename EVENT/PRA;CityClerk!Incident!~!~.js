//Written by rprovinc   
//
//include("5127_CityClerk_PRA.js");

//*****************************************************************************
//Script PRA;CityClerk!Incident!~!~.js
//Record Types:	CityClerk\Incident\*\* 
//Event: 		PRA
//Desc:			Sending emails to citizen letting them know that there permit was Approved after payment has been recieved.
//
//Created By: Rprovinc
//******************************************************************************

logDebug("Starting PRA;CityClerk!Incident!~!~.js ");
logDebug("Checking to see if City Manager's Office Approval status = Approved");
if(ifTracer(wfTask == "City Manager's Office Approval" && wfStatus == "Approved")){
    //Script to verify that the payment has been processed
    logDebug("Checking balance")
    if(balanceDue == 0){
        logDebug("Starting 5127_CityClerk_PRA.js");
        include("5127_CityClerk_PRA.js");
        logDebug("End of 5127_CityClerk_PRA.js");
    }
}
logDebug("End of PRA;CityClerk!Incident!~!~.js ");