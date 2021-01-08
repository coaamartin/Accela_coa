//Written by rprovinc   
// 8/14/2020
//include("5128_CityClerk_CityManager_email");

//*****************************************************************************
//Script WTUA;CityClerk!Incident!~!~.js
//Record Types:	CityClerk\Incident\*\* 
//Event: 		WTUA
//Desc:			Going to send email communication to City managers office for approval.
//
//Created By: Rprovinc

//******************************************************************************
appTypeResult = cap.getCapType(); //create CapTypeModel object
appTypeString = appTypeResult.toString();
appTypeArray = appTypeString.split("/");
logDebug("appType: " + appTypeString);


 //Donation Bins code
 if ("Building/Permit/DonationBin/NA".equals(appTypeString)) {
    logDebug("Starting to send notifications");
    var vEmailTemplate = "CC CITY MANAGER EMAIL FOR FINAL APPROVAL";
    var capAlias = cap.getCapModel().getAppTypeAlias();
    var recordApplicant = getContactByType("Applicant", capId);
    var firstName = recordApplicant.getFirstName();
    var lastName = recordApplicant.getLastName();
    //var emailTo = "rprovinc@auroragov.org;bwatkins@auroragov.org;cmariano@auroragov.org";
    var emailTo = "DB_Final_Approvers@auroragov.org";
    var appDate = "Test"; 
    var today = new Date();
	var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
    var tParams = aa.util.newHashtable();
    tParams.put("$$todayDate$$", thisDate);
    tParams.put("$$altid$$", capId.getCustomID());
    tParams.put("$$appDate$$", appDate);
    tParams.put("$$capAlias$$", capAlias);
    tParams.put("$$FirstName$$", firstName);
    tParams.put("$$LastName$$", lastName);
    logDebug("EmailTo: " + emailTo);
    logDebug("Table Parameters: " + tParams);
    sendNotification("noreply@auroragov.org", emailTo, "", vEmailTemplate, tParams, null);
    logDebug("End of Script 5128_CityClerk_CityManager_email.js");
}

 //Temp Use code
 if ("Building/Permit/TempUse/NA".equals(appTypeString)) {
    logDebug("Starting to send notifications");
    var vEmailTemplate = "CC CITY MANAGER EMAIL FOR FINAL APPROVAL";
    var capAlias = cap.getCapModel().getAppTypeAlias();
    var recordApplicant = getContactByType("Applicant", capId);
    var firstName = recordApplicant.getFirstName();
    var lastName = recordApplicant.getLastName();
    //var emailTo = "rprovinc@auroragov.org;bwatkins@auroragov.org;cmariano@auroragov.org";
    var emailTo = "TUP_Final_Approvers@auroragov.org";
    var appDate = "Test"; 
    var today = new Date();
	var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
    var tParams = aa.util.newHashtable();
    tParams.put("$$todayDate$$", thisDate);
    tParams.put("$$altid$$", capId.getCustomID());
    tParams.put("$$appDate$$", appDate);
    tParams.put("$$capAlias$$", capAlias);
    tParams.put("$$FirstName$$", firstName);
    tParams.put("$$LastName$$", lastName);
    logDebug("EmailTo: " + emailTo);
    logDebug("Table Parameters: " + tParams);
    sendNotification("noreply@auroragov.org", emailTo, "", vEmailTemplate, tParams, null);
    logDebug("End of Script 5128_CityClerk_CityManager_email.js");
}

 //Temp Sign code
 if ("Building/Permit/TempSigns/NA".equals(appTypeString)) {
    logDebug("Starting to send notifications");
    var vEmailTemplate = "CC CITY MANAGER EMAIL FOR FINAL APPROVAL";
    var capAlias = cap.getCapModel().getAppTypeAlias();
    var recordApplicant = getContactByType("Applicant", capId);
    var firstName = recordApplicant.getFirstName();
    var lastName = recordApplicant.getLastName();
    //var emailTo = "rprovinc@auroragov.org;bwatkins@auroragov.org;cmariano@auroragov.org";
    var emailTo = "TSP_Final_Approvers@auroragov.org";
    var appDate = "Test";
    var today = new Date();
	var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
    var tParams = aa.util.newHashtable();
    tParams.put("$$todayDate$$", thisDate);
    tParams.put("$$altid$$", capId.getCustomID());
    tParams.put("$$appDate$$", appDate);
    tParams.put("$$capAlias$$", capAlias);
    tParams.put("$$FirstName$$", firstName);
    tParams.put("$$LastName$$", lastName);
    logDebug("EmailTo: " + emailTo);
    logDebug("Table Parameters: " + tParams);
    sendNotification("noreply@auroragov.org", emailTo, "", vEmailTemplate, tParams, null);
    logDebug("End of Script 5128_CityClerk_CityManager_email.js");
}