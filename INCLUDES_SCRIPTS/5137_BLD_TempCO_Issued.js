//Written by rprovinc   
//
//include("5137_BLD_TempCO_Issued.js");

//*****************************************************************************
//Script WTUA;Building!Permit!New Building!NA.js
//Record Types:	
//Event: 		WTUA
//Desc:			Going to send email communication to ciziten when the Temp CO has been issued.
//
//Created By: Rprovinc

//******************************************************************************
appTypeResult = cap.getCapType(); //create CapTypeModel object
appTypeString = appTypeResult.toString();
appTypeArray = appTypeString.split("/");
logDebug("appType: " + appTypeString);

logDebug("Starting to send notifications");
var capAlias = cap.getCapModel().getAppTypeAlias();
var recordApplicant = getContactByType("Applicant", capId);
var firstName = recordApplicant.getFirstName();
var lastName = recordApplicant.getLastName();
var emailTo = recordApplicant.getEmail();
var wfcomment = wfComment;
var wfTask = aa.env.getValue("WorkflowTask");
var today = new Date();
var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
var altID = capId.getCustomID();
appType = cap.getCapType().toString();
var vAsyncScript = "SEND_EMAIL_TEMPCO_LIC";
var envParameters = aa.util.newHashMap();
envParameters.put("altID", altID);
envParameters.put("capId", capId);
envParameters.put("cap", cap);
logDebug("Starting to kick off ASYNC event for BLD PERMITS. Params being passed: " + envParameters);
aa.runAsyncScript(vAsyncScript, envParameters);
logDebug("End of Script 5137_BLD_TempCO_Issued.js");
