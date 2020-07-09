//Written by rprovinc   
//
//include("5123_CityClerk_AddInfoEmail");

//*****************************************************************************
//Script WTUA;CityClerk!Incident!~!~.js
//Record Types:	CityClerk\Incident\*\* 
//Event: 		WTUA
//Desc:			Going to send email communication to ciziten when additional information is required of them.
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
    //var emailTo = "rprovinc@auroragov.org;bwatkins@auroragov.org;cmariano@auroragov.org";
    var vEmailTemplate = "CC ADDITIONAL INFO REQUIRED";
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
    logDebug("End of Script 5122_CityClerk_notifications.js");
}