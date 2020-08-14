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
if (wfTask == "Planning Director Approval" && wfStatus != "") {

    // Script 5121_CityClerk
    include("5128_CityClerk_CityManager_email");

}
//Need logic below that will send communication out to citizen if more info is needed to proceed
if (wfStatus == "Additional Information Required") {

    include("5123_CityClerk_AddInfoEmail");
}

if (wfTask == "City Manager's Office Approval" && wfStatus == "Approved") {

    // Script 5124_CityClerk
    //include("5124_CityClerk_Approval");
    include("5121_CityClerk");

}


if (wfTask == "City Manager's Office Approval" && wfStatus == "Denied") {

    //Script 5125_CityClerk_Denial
    include("5125_CityClerk_Denial");

}

//Below is going to be logic for an email to be sent to the Planning Director after all other WFtasks have been statused with anything or to not empty status.
//Each workflow has different steps. Going to need to call each record type seperatly. 

//Below is the logic for donation bin
if ("CityClerk/Incident/DonationBin/NA".equals(appTypeString)) {
    if ((wfTask == "Housing and Community Services" && wfStatus != "") && (wfTask == "City Managers Office" && wfStatus != "") && (wfTask == "Zoning" && wfStatus != "") &&
        (wfTask == "Risk Mgmt" && wfStatus != "") && (wfTask == "Pw Traffic" && wfStatus != "") && (wfTask == "Finance" && wfStatus != "")) {
        logDebug("Starting to send notification to the Planning Director");
        include("5122_CityClerk_Notifications");
        logDebug("Finished sending notification to the Planning Director");
    }
}

//Below is the logic for Temp Use
if ("CityClerk/Incident/TempUse/NA".equals(appTypeString)) {
    if ((wfTask == "Housing and Community Services" && wfStatus != "") && (wfTask == "Finance" && wfStatus != "") && (wfTask == "PROS" && wfStatus != "") && (wfTask == "Pw Traffic" && wfStatus != "") && 
        (wfTask == "Zoning" && wfStatus != "") && (wfTask == "Library" && wfStatus != "") && (wfTask == "Water" && wfStatus != "") && (wfTask == "Communications" && wfStatus != "") && 
        (wfTask == "Police Patrol" && wfStatus != "") && (wfTask == "Police Traffic" && wfStatus != "") && (wfTask == "Fire" && wfStatus != "") && (wfTask == "Licensing" && wfStatus != "") && 
        (wfTask == "Building" && wfStatus != "") && (wfTask == "Risk" && wfStatus != "")) {
        logDebug("Starting to send notification to the Planning Director");
        include("5122_CityClerk_Notifications");
        logDebug("Finished sending notification to the Planning Director");
    }
}

//Below is the logic for Temp Sign
if ("CityClerk/Incident/TempSign/NA".equals(appTypeString)) {
    if ((wfTask == "Housing and Community Services" && wfStatus != "") && (wfTask == "City Managers Office" && wfStatus != "") && (wfTask == "Zoning" && wfStatus != "") &&
        (wfTask == "Risk Mgmt" && wfStatus != "") && (wfTask == "Pw Traffic" && wfStatus != "") && (wfTask == "Finance" && wfStatus != "")) {
        logDebug("Starting to send notification to the Planning Director");
        include("5122_CityClerk_Notifications");
        logDebug("Finished sending notification to the Planning Director");
    }
}