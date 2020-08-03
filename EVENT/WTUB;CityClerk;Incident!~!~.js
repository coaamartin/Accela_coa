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

if(ifTracer(wfTask == "City Manager's Office Approval" && wfStatus == "Approved")){
    //Script to verify that the payment has been processed
    if(balanceDue > 0){
        cancel = true;
        showMessage = true;
        comment("All fees need to be paid before issuing application");
    }
}