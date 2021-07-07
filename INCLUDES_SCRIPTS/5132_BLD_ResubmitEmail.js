//Written by rprovinc   
//
//include("5132_BLD_ResubmitEmail.js");

//*****************************************************************************
//Script WTUA;Building!Permit!Master!~.js
//Record Types:	Building\Permit\Master\NA and Building\Permit\Master\Amendment
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
var vEmailTemplate = "BLD_PLANNING_RESUBMITTAL";// BLD ACCEPTPLANS
var capAlias = cap.getCapModel().getAppTypeAlias();
var recordApplicant = getContactByType("Applicant", capId);
var firstName = recordApplicant.getFirstName();
var lastName = recordApplicant.getLastName();
var emailTo = recordApplicant.getEmail();
var wfcomment = wfComment;
var today = new Date();
var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
var tParams = aa.util.newHashtable();
tParams.put("$$todayDate$$", thisDate);
tParams.put("$$altid$$", capId.getCustomID());
tParams.put("$$Record Type$$", "Master Plan");
tParams.put("$$capAlias$$", capAlias);
tParams.put("$$FirstName$$", firstName);
tParams.put("$$LastName$$", lastName);
tParams.put("$$wfComment$$", wfComment);
logDebug("EmailTo: " + emailTo);
logDebug("Table Parameters: " + tParams);
sendNotification("noreply@auroragov.org", emailTo, "", vEmailTemplate, tParams, null);
logDebug("End of Script 5132_BLD_ResubmitEmail.js");