//Written by rprovinc   
//
//include("5122_CityClerk_notifications.js");

//*****************************************************************************
//Script ASA;CityClerk!~!~!~.js
//Record Types:	CityClerk\Incident\*\* 
//Event: 		ASA
//Desc:			Sending emails to all deparments that need to approve Temp Use/Temp Sign/Donation Bin permits.
//
//Created By: Rprovinc
//******************************************************************************
appTypeResult = cap.getCapType(); //create CapTypeModel object
appTypeString = appTypeResult.toString();
appTypeArray = appTypeString.split("/");
// logDebug("Non Profit: " + nonProfit);
logDebug("Non-Profit: " + vASIValue);
logDebug("appType: " + appTypeString);
    if ("CityClerk/Incident/DonationBin/NA".equals(appTypeString)) {
        //Donation Bins code
        logDebug("Starting to send notifications");
        //Send email to all individuals that need to sign off on Donation Bins
        logDebug("End of Script 5122_CityClerk_notifications.js");
    }
    //Temp Use code
    else if ("CityClerk/Incident/TempUse/NA".equals(appTypeString)) {
        logDebug("Starting to send notifications");
        //Send email to all individuals that need to sign off on TempUse
        logDebug("End of Script 5122_CityClerk_notifications.js");
    }

    //Temp Sign code
    else if ("CityClerk/Incident/TempSign/NA".equals(appTypeString)) {
        logDebug("Starting to send notifications");
        //Send email to all individuals that need to sign off on TempSign
        logDebug("End of Script 5122_CityClerk_notifications.js");
    }