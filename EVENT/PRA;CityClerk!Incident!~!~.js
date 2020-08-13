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


if(ifTracer(wfTask == "City Manager's Office Approval" && wfStatus == "Approved")){
    //Script to verify that the payment has been processed
    if(balanceDue == 0){
        include("5127_CityClerk_PRA.js");
    }
}