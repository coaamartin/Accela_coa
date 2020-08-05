//Written by rprovinc   
//
//include("5125_CityClerk_denial.js");

//*****************************************************************************
//Script ASA;CityClerk!~!~!~.js
//Record Types:	CityClerk\Incident\*\* 
//Event: 		WTUA
//Desc:			Sending emails to citizen letting them know that there permit was denied.
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
    var vEmailTemplate = "CC DENIAL";
    var capAlias = cap.getCapModel().getAppTypeAlias();
    var recordApplicant = getContactByType("Applicant", capId);
    var firstName = recordApplicant.getFirstName();
    var lastName = recordApplicant.getLastName();
    var emailTo = recordApplicant.getEmail();
    var wfcomment = wfcomment;
    var today = new Date();
    var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
    var tParams = aa.util.newHashtable();
    tParams.put("$$todayDate$$", thisDate);
    tParams.put("$$altid$$", capId.getCustomID());
    tParams.put("$$Record Type$$", "Donation Bin");
    tParams.put("$$capAlias$$", capAlias);
    tParams.put("$$FirstName$$", firstName);
    tParams.put("$$LastName$$", lastName);
    tParams.put("$$wfComment$$", wfComment);
    logDebug("EmailTo: " + emailTo);
    logDebug("Table Parameters: " + tParams);
    sendNotification("noreply@auroraco.gov", emailTo, "", vEmailTemplate, tParams, null);
    logDebug("End of Script 5125-Denial")
} else if (recordApplicant == null) {
    logDebug("Email could not be sent as there is no Applicant email address.")
}

//Temp Use code
else if ("CityClerk/Incident/TempUse/NA".equals(appTypeString)) {
    logDebug("Starting to send notifications");
    var vEmailTemplate = "CC DENIAL";
    var capAlias = cap.getCapModel().getAppTypeAlias();
    var recordApplicant = getContactByType("Applicant", capId);
    var firstName = recordApplicant.getFirstName();
    var lastName = recordApplicant.getLastName();
    var emailTo = recordApplicant.getEmail();
    var wfcomment = wfcomment;
    var today = new Date();
    var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
    var tParams = aa.util.newHashtable();
    tParams.put("$$todayDate$$", thisDate);
    tParams.put("$$altid$$", capId.getCustomID());
    tParams.put("$$Record Type$$", "Temp Use Permit");
    tParams.put("$$capAlias$$", capAlias);
    tParams.put("$$FirstName$$", firstName);
    tParams.put("$$LastName$$", lastName);
    tParams.put("$$wfComment$$", wfComment);
    logDebug("EmailTo: " + emailTo);
    logDebug("Table Parameters: " + tParams);
    sendNotification("noreply@auroraco.gov", emailTo, "", vEmailTemplate, tParams, null);
    logDebug("End of Script 5125-Denial")
} else if (recordApplicant == null) {
    logDebug("Email could not be sent as there is no Applicant email address.")
}

//Temp Sign code
else if ("CityClerk/Incident/TempSign/NA".equals(appTypeString)) {
    logDebug("Starting to send notifications");
    var vEmailTemplate = "CC DENIAL";
    var capAlias = cap.getCapModel().getAppTypeAlias();
    var recordApplicant = getContactByType("Applicant", capId);
    var firstName = recordApplicant.getFirstName();
    var lastName = recordApplicant.getLastName();
    var emailTo = recordApplicant.getEmail();
    var wfcomment = wfcomment;
    var today = new Date();
    var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
    var tParams = aa.util.newHashtable();
    tParams.put("$$todayDate$$", thisDate);
    tParams.put("$$altid$$", capId.getCustomID());
    tParams.put("$$Record Type$$", "Temp Sign Permit");
    tParams.put("$$capAlias$$", capAlias);
    tParams.put("$$FirstName$$", firstName);
    tParams.put("$$LastName$$", lastName);
    tParams.put("$$wfComment$$", wfComment);
    logDebug("EmailTo: " + emailTo);
    logDebug("Table Parameters: " + tParams);
    sendNotification("noreply@auroraco.gov", emailTo, "", vEmailTemplate, tParams, null);
    logDebug("End of Script 5125-Denial")
} else if (recordApplicant == null) {
    logDebug("Email could not be sent as there is no Applicant email address.")
}