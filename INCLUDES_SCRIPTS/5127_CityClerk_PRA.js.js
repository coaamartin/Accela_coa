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
logDebug("appType: " + appTypeString);
var emailTo = recordApplicant.getEmail();
logDebug("Email to: " + emailTo);

//Donation Bins code
if ("CityClerk/Incident/DonationBin/NA".equals(appTypeString)) {
    include("5124_CityClerk_Approval");
    updateAppStatus("Approved","Status updated via script 5127_CityClerk_PRA.js");
    //updateTask("Final Step", "Approved", "Updated via script 5127_CityClerk_PRA.js");				
} else if (recordApplicant == null) {
    logDebug("Email could not be sent as there is no Applicant email address.")
}

//Temp Use code
else if ("CityClerk/Incident/TempUse/NA".equals(appTypeString)) {
    include("5124_CityClerk_Approval");
    updateAppStatus("Approved","Status updated via script");
    //updateTask("Final Step", "Approved", "Updated via script 5127_CityClerk_PRA.js");	
} else if (recordApplicant == null) {
    logDebug("Email could not be sent as there is no Applicant email address.")
}

//Temp Sign code
else if ("CityClerk/Incident/TempSign/NA".equals(appTypeString)) {
    include("5124_CityClerk_Approval");
    updateAppStatus("Approved","Status updated via script");
    //updateTask("Final Step", "Approved", "Updated via script 5127_CityClerk_PRA.js");	
} else if (recordApplicant == null) {
    logDebug("Email could not be sent as there is no Applicant email address.")
}