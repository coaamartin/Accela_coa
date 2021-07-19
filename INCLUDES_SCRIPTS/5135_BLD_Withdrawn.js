//Written by rprovinc   
//
//include("5135_BLD_Withdrawn.js");

//*****************************************************************************
//Script WTUA; Building/Permit/New Building/NA
//Record Types:	Building/Permit/New Building/NA
//Event: 		WTUA
//Desc:			Going to send email communication to ciziten when withdarwan is statused.
//
//Created By: Rprovinc

//******************************************************************************
appTypeResult = cap.getCapType(); //create CapTypeModel object
appTypeString = appTypeResult.toString();
appTypeArray = appTypeString.split("/");
logDebug("appType: " + appTypeString);

logDebug("Starting to send notifications");
var vEmailTemplate = "";
if (wfStatus == "Cancelled") {
    var vEmailTemplate = "BLD CANCELLED";
} 
else if (wfStatus == "Withdrawn") {
    var vEmailTemplate = "BLD_WITHDRAWN";
}
var capAlias = cap.getCapModel().getAppTypeAlias();
var recordApplicant = getContactByType("Applicant", capId);
var firstName = recordApplicant.getFirstName();
var lastName = recordApplicant.getLastName();
var emailTo = recordApplicant.getEmail();
var wfcomment = wfComment;
var wfTask = aa.env.getValue("WorkflowTask");
var today = new Date();
var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
var tParams = aa.util.newHashtable();
tParams.put("$$wfTask$$", wfTask);
tParams.put("$$todayDate$$", thisDate);
tParams.put("$$altid$$", capId.getCustomID());
tParams.put("$$Record Type$$", capAlias);
tParams.put("$$capAlias$$", capAlias);
tParams.put("$$FirstName$$", firstName);
tParams.put("$$LastName$$", lastName);
tParams.put("$$wfComment$$", wfComment);
logDebug("EmailTo: " + emailTo);
logDebug("Table Parameters: " + tParams);
sendNotification("noreply@auroragov.org", emailTo, "", vEmailTemplate, tParams, null);
logDebug("End of Script 5135_BLD_Withdrawn.js");
