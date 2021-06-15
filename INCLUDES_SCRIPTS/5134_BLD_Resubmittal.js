//Written by rprovinc   
//
//include("5134_BLD_Resubmittal.js");

//*****************************************************************************
//Script WTUA;Licenses!Contractor!General!Renewal.js
//Record Types:	
//Event: 		WTUA
//Desc:			Going to send email communication to ciziten when resubmittal is required of them.
//
//Created By: Rprovinc

//******************************************************************************
appTypeResult = cap.getCapType(); //create CapTypeModel object
appTypeString = appTypeResult.toString();
appTypeArray = appTypeString.split("/");
logDebug("appType: " + appTypeString);

logDebug("Starting to send notifications");
var vEmailTemplate = "";
logDebug("Workflow Task: " + wfTask);
if (wfTask == "Accept Plans"){
    var vEmailTemplate = "BLD_ACCEPTPLANS_RESUBMITTAL REQUESTED";
} else {
    var vEmailTemplate = "BLD RESUBMITTAL NOTIFICATION";
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
logDebug("End of Script 5134_BLD_Resubmittal.js");
