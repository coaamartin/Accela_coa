//Written by rprovinc   
//
//include("5127_CityClerk_PRA.js");

//*****************************************************************************
//Script PRA;CityClerk!Incident!~!~.js
//Record Types:	CityClerk\Incident\*\* 
//Event: 		PRA
//Desc:			Payment Receive after.Sending emails to citizen letting them know that there permit was Approved.
//
//Created By: Rprovinc
//******************************************************************************
appTypeResult = cap.getCapType(); //create CapTypeModel object
appTypeString = appTypeResult.toString();
appTypeArray = appTypeString.split("/");
logDebug("Check to see what type of record it running and then update app status, task status and send email of permit approval.");


//Donation Bins code
if ("CityClerk/Incident/DonationBin/NA".equals(appTypeString)) {
    logDebug("Starting DB approval email and updating statues");
    include("5124_CityClerk_Approval");
    activateTask("Application Close");
    updateAppStatus("PERMIT ISSUED","Status updated via script 5127_CityClerk_PRA.js");
    updateTask("Application Close", "Approved", "Updated via script 5127_CityClerk_PRA.js");				
} 

//Temp Use code
else if ("CityClerk/Incident/TempUse/NA".equals(appTypeString)) {
    logDebug("Starting TU approval email and updating statues");
    include("5124_CityClerk_Approval");
    activateTask("Application Close");
    updateAppStatus("PERMIT ISSUED","Status updated via script 5127_CityClerk_PRA.js");
    updateTask("Application Close", "Approved", "Updated via script 5127_CityClerk_PRA.js");	
}

//Temp Sign code
else if ("CityClerk/Incident/TempSign/NA".equals(appTypeString)) {
    logDebug("Starting TS approval email and updating statues");
    include("5124_CityClerk_Approval");
    activateTask("Application Close");
    updateAppStatus("PERMIT ISSUED","Status updated via script 5127_CityClerk_PRA.js");
    updateTask("Application Close", "Approved", "Updated via script 5127_CityClerk_PRA.js");	
}
logDebug("End of 5127_CityClerk_PRA script"); 