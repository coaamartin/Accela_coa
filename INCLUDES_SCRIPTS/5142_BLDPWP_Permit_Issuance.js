//Written by rprovinc   
//
//include("5142_BLDPWP_Permit_Issuance.js");

//*****************************************************************************
//Script WTUA;Building!Permit!Plans!NA.js
//Record Types:	
//Event: 		WTUA
//Desc:			Going to send email communication to ciziten when the Permit has been issued.
//
//Created By: Rprovinc

//******************************************************************************
appTypeResult = cap.getCapType(); //create CapTypeModel object
appTypeString = appTypeResult.toString();
appTypeArray = appTypeString.split("/");
logDebug("appType: " + appTypeString);

var $iTrc = ifTracer;
if ($iTrc(balanceDue == 0, 'balanceDue: 0')) {
logDebug("Starting to send notifications on Permit Issuance");
var capAlias = cap.getCapModel().getAppTypeAlias();
var recordApplicant = getContactByType("Applicant", capId);
var firstName = recordApplicant.getFirstName();
var lastName = recordApplicant.getLastName();
var emailTo = recordApplicant.getEmail();
//var wfcomment = wfComment;
var wfTask = aa.env.getValue("WorkflowTask");
var today = new Date();
var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
var altID = capId.getCustomID();
appType = cap.getCapType().toString();
var vAsyncScript = "SEND_EMAIL_BLD_PWP_PERMIT";
var envParameters = aa.util.newHashMap();
envParameters.put("altID", altID);
envParameters.put("capId", capId);
envParameters.put("cap", cap);
envParameters.put("appType", appType);
logDebug("Starting to kick off ASYNC event for BLD PERMITS. Params being passed: " + envParameters);
aa.runAsyncScript(vAsyncScript, envParameters);
logDebug("End of Script 5142_BLDPWP_Permit_Issuance.js");
}