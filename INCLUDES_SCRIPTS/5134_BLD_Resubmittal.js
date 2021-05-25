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
/*------------------------------------------------------------------------------------------------------/
| GLOBAL VARIABLES
/------------------------------------------------------------------------------------------------------*/
message = "";
br = "<br>";
debug = "";
systemUserObj = aa.person.getUser(currentUserID).getOutput();
publicUser = false;
/*------------------------------------------------------------------------------------------------------/
| INCLUDE SCRIPTS (Core functions, batch includes, custom functions)
/------------------------------------------------------------------------------------------------------*/
SCRIPT_VERSION = 3.0;
var useSA = false;
var SA = null;
var SAScript = null;
var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_FOR_EMSE");
if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") {
	useSA = true;
	SA = bzr.getOutput().getDescription();
	bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_INCLUDE_SCRIPT");
	if (bzr.getSuccess()) {
		SAScript = bzr.getOutput().getDescription();
	}
}

if (SA) {
	eval(getMasterScriptText("INCLUDES_ACCELA_FUNCTIONS", SA));
	eval(getMasterScriptText(SAScript, SA));
} else {
	eval(getMasterScriptText("INCLUDES_ACCELA_FUNCTIONS"));
}

eval(getScriptText("INCLUDES_BATCH"));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));
eval(getMasterScriptText("INCLUDES_CUSTOM"));
appTypeResult = cap.getCapType(); //create CapTypeModel object
appTypeString = appTypeResult.toString();
appTypeArray = appTypeString.split("/");
logDebug("appType: " + appTypeString);

logDebug("Starting to send notifications");
var vEmailTemplate = "BLD RESUBMITTAL NOTIFICATION";
var capAlias = cap.getCapModel().getAppTypeAlias();
var recordApplicant = getContactByType("Applicant", capId);
var firstName = recordApplicant.getFirstName();
var lastName = recordApplicant.getLastName();
var emailTo = recordApplicant.getEmail();
var wfcomment = wfComment;
var workflowTasks = aa.workflow.getTasks(capId).getOutput();
logDebug("Workflow Task: " + workflowTasks);
var wfTask = wfTask;
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
