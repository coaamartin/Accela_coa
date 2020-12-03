//Written by rprovinc   
//
//include("5130_CityClerk_Withdrawn.js");

//*****************************************************************************
//Script ASA;CityClerk!~!~!~.js
//Record Types:	CityClerk\Incident\*\* 
//Event: 		WTUA
//Desc:			Sending emails to citizen letting them know that there permit was withdrawn.
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
    var vEmailTemplate = "CC Withdrawn";
    var capAlias = cap.getCapModel().getAppTypeAlias();
    var recordApplicant = getContactByType("Applicant", capId);
    var firstName = recordApplicant.getFirstName();
    var lastName = recordApplicant.getLastName();
    var emailTo1 = emailTo;
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
    logDebug("EmailTo: " + emailTo1);
    logDebug("Table Parameters: " + tParams);
    sendNotification("noreply@auroragov.org", emailTo1, "", vEmailTemplate, tParams, null);
    logDebug("End of Script 5130-Withdrawn");
} else if (recordApplicant == null) {
    logDebug("Email could not be sent as there is no Applicant email address.")
}

//Temp Use code
else if ("Building/Permit/TempUse/NA".equals(appTypeString)) {
    logDebug("Starting to send notifications");
    var vEmailTemplate = "CC Withdrawn";
    var capAlias = cap.getCapModel().getAppTypeAlias();
    var recordApplicant = getContactByType("Applicant", capId);
    var firstName = recordApplicant.getFirstName();
    var lastName = recordApplicant.getLastName();
    var emailTo1 = emailTo;
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
    logDebug("EmailTo: " + emailTo1);
    logDebug("Table Parameters: " + tParams);
    sendNotification("noreply@auroragov.org", emailTo1, "", vEmailTemplate, tParams, null);
    logDebug("End of Script 5130-Withdrawn");
} else if (recordApplicant == null) {
    logDebug("Email could not be sent as there is no Applicant email address.")
}

//Temp Sign code
else if ("Building/Permit/TempSigns/NA".equals(appTypeString)) {
    logDebug("Starting to send notifications");
    var vEmailTemplate = "CC Withdrawn";
    var capAlias = cap.getCapModel().getAppTypeAlias();
    var recordApplicant = getContactByType("Applicant", capId);
    var firstName = recordApplicant.getFirstName();
    var lastName = recordApplicant.getLastName();
    var emailTo1 = emailTo;
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
    logDebug("EmailTo: " + emailTo1);
    logDebug("Table Parameters: " + tParams);
    sendNotification("noreply@auroragov.org", emailTo1, "", vEmailTemplate, tParams, null);
    logDebug("End of Script 5130-Withdrawn");
} else if (recordApplicant == null) {
    logDebug("Email could not be sent as there is no Applicant email address.")
}