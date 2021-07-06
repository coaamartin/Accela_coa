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

var $iTrc = ifTracer;
if ($iTrc(wfStatus == "Temporary CO Issued", 'wfStatus:Temporary CO Issued' || wfStatus == "Final CO Issued", 'wfStatus:Final CO Issued')) {
logDebug("Starting to send notifications on TEMP CO ISSUED || FINAL CO ISSUED");
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
var vAsyncScript = "SEND_EMAIL_BLD_TEMPCO_LIC";
var envParameters = aa.util.newHashMap();
envParameters.put("altID", altID);
envParameters.put("capId", capId);
envParameters.put("cap", cap);
logDebug("Starting to kick off ASYNC event for BLD PERMITS. Params being passed: " + envParameters);
aa.runAsyncScript(vAsyncScript, envParameters);
logDebug("End of Script 5137_BLD_TempCO_Issued.js");
}

if ($iTrc(wfTask == "Permit Issuance" && wfStatus == "Issued", 'wfTask: Permit Issuance/wfStatus:Issued')) {
logDebug("Starting to send notifications on Permit Issuance");
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
var vAsyncScript = "SEND_EMAIL_BLD_NEW_PERMIT";
var envParameters = aa.util.newHashMap();
envParameters.put("altID", altID);
envParameters.put("capId", capId);
envParameters.put("cap", cap);
logDebug("Starting to kick off ASYNC event for BLD NEW PERMITS. Params being passed: " + envParameters);
aa.runAsyncScript(vAsyncScript, envParameters);
logDebug("End of Script 5137_BLD_TempCO_Issued.js");
}