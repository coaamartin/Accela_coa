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
    //var emailTo = "rprovinc@auroragov.org;bwatkins@auroragov.org;cmariano@auroragov.org;jjking@auroragov.org";
    var emailTo = "rprovinc@auroragov.org;bwatkins@auroragov.org;cmariano@auroragov.org";
    var vEmailTemplate = "CC READY FOR REVIEW";
    var capAlias = cap.getCapModel().getAppTypeAlias();
    var recordApplicant = getContactByType("Applicant", capId);
    var firstName = recordApplicant.getFirstName();
    var lastName = recordApplicant.getLastName();
    var today = new Date();
    var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
    var altId = capId.getCustomID();
    logDebug("Testing to see if I get a temp record id before a new if statement. This is before. Altid: " + altId);
    if (recordApplicant != null ){
    var tParams = aa.util.newHashtable();
    tParams.put("$$todayDate$$", thisDate);
    tParams.put("$$altid$$", capId.getCustomID());
    tParams.put("$$Record Type$$", "Donation Bin");
    tParams.put("$$capAlias$$", capAlias);
    tParams.put("$$FirstName$$", firstName);
    tParams.put("$$LastName$$", lastName);
    logDebug("EmailTo: " + emailTo);
    logDebug("during if statement. AltId show below in tparams");
    logDebug("Table Parameters: " + tParams);
    sendNotification("noreply@auroraco.gov", emailTo, "", vEmailTemplate, tParams, null);
    logDebug("End of Script 5122_CityClerk_notifications.js");
    }
}

//Temp Use code
else if ("CityClerk/Incident/TempUse/NA".equals(appTypeString)) {
    logDebug("Starting to send notifications");
    //var emailTo = "rprovinc@auroragov.org;bwatkins@auroragov.org;cmariano@auroragov.org;JNAPPER@auroragov.org";
    var emailTo = "rprovinc@auroragov.org;bwatkins@auroragov.org;cmariano@auroragov.org";
    var vEmailTemplate = "CC READY FOR REVIEW";
    var capAlias = cap.getCapModel().getAppTypeAlias();
    var recordApplicant = getContactByType("Applicant", capId);
    var firstName = recordApplicant.getFirstName();
    var lastName = recordApplicant.getLastName();
    var today = new Date();
	var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
    var tParams = aa.util.newHashtable();
    tParams.put("$$todayDate$$", thisDate);
    tParams.put("$$altid$$", capId.getCustomID());
    tParams.put("$$Record Type$$", "Temp Use Permit");
    tParams.put("$$capAlias$$", capAlias);
    tParams.put("$$FirstName$$", firstName);
    tParams.put("$$LastName$$", lastName);
    logDebug("EmailTo: " + emailTo);
    logDebug("Table Parameters: " + tParams);
    sendNotification("noreply@auroraco.gov", emailTo, "", vEmailTemplate, tParams, null);
    logDebug("End of Script 5122_CityClerk_notifications.js");
}

//Temp Sign code
else if ("CityClerk/Incident/TempSign/NA".equals(appTypeString)) {
    logDebug("Starting to send notifications");
    //var emailTo = "rprovinc@auroragov.org;bwatkins@auroragov.org;cmariano@auroragov.org;jjking@auroragov.org";
    var emailTo = "rprovinc@auroragov.org;bwatkins@auroragov.org;cmariano@auroragov.org";
    var vEmailTemplate = "CC READY FOR REVIEW";
    var capAlias = cap.getCapModel().getAppTypeAlias();
    var recordApplicant = getContactByType("Applicant", capId);
    var firstName = recordApplicant.getFirstName();
    var lastName = recordApplicant.getLastName();
    var today = new Date();
	var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
    var tParams = aa.util.newHashtable();
    tParams.put("$$todayDate$$", thisDate);
    tParams.put("$$altid$$", capId.getCustomID());
    tParams.put("$$Record Type$$", "Temp Sign Permit");
    tParams.put("$$capAlias$$", capAlias);
    tParams.put("$$FirstName$$", firstName);
    tParams.put("$$LastName$$", lastName);
    logDebug("EmailTo: " + emailTo);
    logDebug("Table Parameters: " + tParams);
    sendNotification("noreply@auroraco.gov", emailTo, "", vEmailTemplate, tParams, null);
    logDebug("End of Script 5122_CityClerk_notifications.js");
}
