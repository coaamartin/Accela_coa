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
logDebug("appType: " + appTypeString);


//Donation Bins code
if ("CityClerk/Incident/DonationBin/NA".equals(appTypeString)) {
    logDebug("Starting to send notifications");
    var emailTo = "rprovinc@auroragov.org;bwatkins@auroragov.org;cmariano@auroragov.org";
    var vEmailTemplate = "CC PLANNING DIRECTOR EMAIL REVIEW";
    var capAlias = cap.getCapModel().getAppTypeAlias();
    var firstName = recordApplicant.getFirstName();
    var lastName = recordApplicant.getLastName();
    var today = new Date();
    var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
    var altId = capId.getCustomID();
    var appDate = "Testing";
    logDebug("Testing to see if I get a temp record id before a new if statement. This is before. Altid: " + altId);
    if (recordApplicant != null) {
        var tParams = aa.util.newHashtable();
        tParams.put("$$todayDate$$", thisDate);
        tParams.put("$$altid$$", altId);
        tParams.put("$$capAlias$$", capAlias);
        tParams.put("$$FirstName$$", firstName);
        tParams.put("$$LastName$$", lastName);
        tParams.put("$$appDate$$", appDate);
        logDebug("EmailTo: " + emailTo);
        logDebug("Table Parameters: " + tParams);
        sendNotification("noreply@auroragov.org", emailTo, "", vEmailTemplate, tParams, null);
        logDebug("End of Script 5122_CityClerk_notifications.js");
    }
    else if (recordApplicant == null) {
        logDebug("Email could not be sent as there is no Applicant email address.")
    }
}

//Temp Use code
else if ("CityClerk/Incident/TempUse/NA".equals(appTypeString)) {
    logDebug("Starting to send notifications");
    var emailTo = "rprovinc@auroragov.org;bwatkins@auroragov.org;cmariano@auroragov.org";
    var vEmailTemplate = "CC PLANNING DIRECTOR EMAIL REVIEW";
    var capAlias = cap.getCapModel().getAppTypeAlias();
    var firstName = recordApplicant.getFirstName();
    var lastName = recordApplicant.getLastName();
    var today = new Date();
    var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
    var altId = capId.getCustomID();
    var appDate = "Testing";
    logDebug("Testing to see if I get a temp record id before a new if statement. This is before. Altid: " + altId);
    if (recordApplicant != null) {
        var tParams = aa.util.newHashtable();
        tParams.put("$$todayDate$$", thisDate);
        tParams.put("$$altid$$", altId);
        tParams.put("$$capAlias$$", capAlias);
        tParams.put("$$FirstName$$", firstName);
        tParams.put("$$LastName$$", lastName);
        tParams.put("$$appDate$$", appDate);
        logDebug("EmailTo: " + emailTo);
        logDebug("Table Parameters: " + tParams);
        sendNotification("noreply@auroragov.org", emailTo, "", vEmailTemplate, tParams, null);
        logDebug("End of Script 5122_CityClerk_notifications.js");
    }
    else if (recordApplicant == null) {
        logDebug("Email could not be sent as there is no Applicant email address.")
    }
}

//Temp Sign code
else if ("CityClerk/Incident/TempSign/NA".equals(appTypeString)) {
    logDebug("Starting to send notifications");
    var emailTo = "rprovinc@auroragov.org;bwatkins@auroragov.org;cmariano@auroragov.org";
    var vEmailTemplate = "CC PLANNING DIRECTOR EMAIL REVIEW";
    var capAlias = cap.getCapModel().getAppTypeAlias();
    var firstName = recordApplicant.getFirstName();
    var lastName = recordApplicant.getLastName();
    var today = new Date();
    var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
    var altId = capId.getCustomID();
    var appDate = "Testing";
    logDebug("Testing to see if I get a temp record id before a new if statement. This is before. Altid: " + altId);
    if (recordApplicant != null) {
        var tParams = aa.util.newHashtable();
        tParams.put("$$todayDate$$", thisDate);
        tParams.put("$$altid$$", altId);
        tParams.put("$$capAlias$$", capAlias);
        tParams.put("$$FirstName$$", firstName);
        tParams.put("$$LastName$$", lastName);
        tParams.put("$$appDate$$", appDate);
        logDebug("EmailTo: " + emailTo);
        logDebug("Table Parameters: " + tParams);
        sendNotification("noreply@auroragov.org", emailTo, "", vEmailTemplate, tParams, null);
        logDebug("End of Script 5122_CityClerk_notifications.js");
    }
    else if (recordApplicant == null) {
        logDebug("Email could not be sent as there is no Applicant email address.")
    }
}