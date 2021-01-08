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

var recordApplicant = getContactByType("Applicant", capId);
var applicantEmail = null;
if (!recordApplicant || recordApplicant.getEmail() == null || recordApplicant.getEmail() == "") {
    logDebug("**WARN no applicant or applicant has no email, capId=" + capId);
} else {
    applicantEmail = recordApplicant.getEmail();
}
var emailTo = applicantEmail;
logDebug("Email to: " + emailTo);

//Donation Bins code
if ("Building/Permit/DonationBin/NA".equals(appTypeString)) {
    logDebug("Starting to send notifications");
    //var emailTo = "bcammara@auroragov.org;hlamboy@auroragov.org;gadams@auroragov.org";
    //var emailTo = "rprovinc@auroragov.org;bwatkins@auroragov.org;cmariano@auroragov.org";
    var emailTo = "DB_Final_Approvers@auroragov.org";
    var vEmailTemplate = "CC PLANNING DIRECTOR EMAIL REVIEW";
    var capAlias = cap.getCapModel().getAppTypeAlias();
    var firstName = recordApplicant.getFirstName();
    var lastName = recordApplicant.getLastName();
    var today = new Date();
    var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
    var altId = capId.getCustomID();
    var appDate = "Testing";
    logDebug("Testing to see if I get a temp record id before a new if statement. This is before. Altid: " + altId);
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


//Temp Use code
else if ("Building/Permit/TempUse/NA".equals(appTypeString)) {
    logDebug("Starting to send notifications");
    //var emailTo = "ncampbel@auroragov.org;sswan@auroragov.org";
    //var emailTo = "rprovinc@auroragov.org;bwatkins@auroragov.org;cmariano@auroragov.org";
    var emailTo = "TUP_Final_Approvers@auroragov.org";
    var vEmailTemplate = "CC PLANNING DIRECTOR EMAIL REVIEW";
    var capAlias = cap.getCapModel().getAppTypeAlias();
    var firstName = recordApplicant.getFirstName();
    var lastName = recordApplicant.getLastName();
    var today = new Date();
    var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
    var altId = capId.getCustomID();
    var appDate = "Testing";
    logDebug("Testing to see if I get a temp record id before a new if statement. This is before. Altid: " + altId);
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

//Temp Sign code
else if ("Building/Permit/TempSigns/NA".equals(appTypeString)) {
    logDebug("Starting to send notifications");
    //var emailTo = "cejohnso@auroragov.org;ddodd@auroragov.org;dshols@auroragov.org";
    //var emailTo = "rprovinc@auroragov.org;bwatkins@auroragov.org;cmariano@auroragov.org";
    var emailTo = "TSP_Final_Approvers@auroragov.org";
    var vEmailTemplate = "CC PLANNING DIRECTOR EMAIL REVIEW";
    var capAlias = cap.getCapModel().getAppTypeAlias();
    var firstName = recordApplicant.getFirstName();
    var lastName = recordApplicant.getLastName();
    var today = new Date();
    var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
    var altId = capId.getCustomID();
    var appDate = "Testing";
    logDebug("Testing to see if I get a temp record id before a new if statement. This is before. Altid: " + altId);
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