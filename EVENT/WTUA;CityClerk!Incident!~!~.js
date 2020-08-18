//Written by rprovinc   
//
//include("5121_CityClerk.js");

//*****************************************************************************
//Script WTUA;CityClerk!Incident!~!~.js
//Record Types:	CityClerk\Incident\*\* 
//Event: 		ASA
//Desc:			Going to update the fee when ever a CityClerk record is open and Non-Profit is set to No.
//
//Created By: Rprovinc
//******************************************************************************
// SCRIPTNUMBER: WTUA
// SCRIPTFILENAME: WTUA;CityClerk!Incident!~!~.js
// PURPOSE: 
// DATECREATED: 08/18/2020
// BY: 
// CHANGELOG: 
//Script Tester header.  Comment this out when deploying.
// var myCapId = "20-000093-CTU";
// var myUserId = "RPROVINC";
// var eventName = "WorkflowTaskUpdateAfter";
// var wfTask = "Housing and Community Services";
// var wfStatus = "Approved";


// var useProductScript = true;  // set to true to use the "productized" master scripts (events->master scripts), false to use scripts from (events->scripts)
// var runEvent = true; // set to true to simulate the event and run all std choices/scripts for the record type.  

/* master script code don't touch */ 
// aa.env.setValue("EventName",eventName); var vEventName = eventName;  var controlString = eventName;  var tmpID = aa.cap.getCapID(myCapId).getOutput(); if(tmpID != null){aa.env.setValue("PermitId1",tmpID.getID1()); 	aa.env.setValue("PermitId2",tmpID.getID2()); 	aa.env.setValue("PermitId3",tmpID.getID3());} aa.env.setValue("CurrentUserID",myUserId); var preExecute = "PreExecuteForAfterEvents";var documentOnly = false;var SCRIPT_VERSION = 3.0;var useSA = false;var SA = null;var SAScript = null;var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS","SUPER_AGENCY_FOR_EMSE"); if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") { 	useSA = true; 		SA = bzr.getOutput().getDescription();	bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS","SUPER_AGENCY_INCLUDE_SCRIPT"); 	if (bzr.getSuccess()) { SAScript = bzr.getOutput().getDescription(); }	}if (SA) {	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS",SA,useProductScript));	eval(getScriptText("INCLUDES_ACCELA_GLOBALS",SA,useProductScript));	/* force for script test*/ showDebug = true; eval(getScriptText(SAScript,SA,useProductScript));	}else {	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS",null,useProductScript));	eval(getScriptText("INCLUDES_ACCELA_GLOBALS",null,useProductScript));	}	eval(getScriptText("INCLUDES_CUSTOM",null,useProductScript));if (documentOnly) {	doStandardChoiceActions2(controlString,false,0);	aa.env.setValue("ScriptReturnCode", "0");	aa.env.setValue("ScriptReturnMessage", "Documentation Successful.  No actions executed.");	aa.abortScript();	}var prefix = lookup("EMSE_VARIABLE_BRANCH_PREFIX",vEventName);var controlFlagStdChoice = "EMSE_EXECUTE_OPTIONS";var doStdChoices = true;  var doScripts = false;var bzr = aa.bizDomain.getBizDomain(controlFlagStdChoice ).getOutput().size() > 0;if (bzr) {	var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice ,"STD_CHOICE");	doStdChoices = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";	var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice ,"SCRIPT");	doScripts = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";	}	function getScriptText(vScriptName, servProvCode, useProductScripts) {	if (!servProvCode)  servProvCode = aa.getServiceProviderCode();	vScriptName = vScriptName.toUpperCase();	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();	try {		if (useProductScripts) {			var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);		} else {			var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");		}		return emseScript.getScriptText() + "";	} catch (err) {		return "";	}}logGlobals(AInfo); if (runEvent && typeof(doStandardChoiceActions) == "function" && doStdChoices) try {doStandardChoiceActions(controlString,true,0); } catch (err) { logDebug(err.message) } if (runEvent && typeof(doScriptActions) == "function" && doScripts) doScriptActions(); var z = debug.replace(/<BR>/g,"\r");  aa.print(z); 

/*
User code generally goes inside the try block below.
*/

// try 
// {
/* your code here
End script Tester header */

logDebug("Starting WTUA;CityClerk!Incident!~!~.js");
if (wfTask == "Planning Director Approval" && wfStatus != "") {

    // Script 5121_CityClerk
    include("5128_CityClerk_CityManager_email");

}
//Need logic below that will send communication out to citizen if more info is needed to proceed
if (wfStatus == "Additional Information Required") {

    include("5123_CityClerk_AddInfoEmail");
}

if (wfTask == "City Manager's Office Approval" && wfStatus == "Approved") {

    // Script 5124_CityClerk
    //include("5124_CityClerk_Approval");
    include("5121_CityClerk");

}


if (wfTask == "City Manager's Office Approval" && wfStatus == "Denied") {

    //Script 5125_CityClerk_Denial
    include("5125_CityClerk_Denial");

}

//Below is going to be logic for an email to be sent to the Planning Director after all other WFtasks have been statused with anything or to not empty status.
//Each workflow has different steps. Going to need to call each record type seperatly. 

//Below is the logic for donation bin

// if ("CityClerk/Incident/DonationBin/NA".equals(appTypeString)) {
    if (wfTask == "Planning Director Approval") {
    // && (wfTask == "City Managers Office" && wfStatus != "") && (wfTask == "Zoning" && wfStatus != "") &&
    //     (wfTask == "Risk Mgmt" && wfStatus != "") && (wfTask == "Pw Traffic" && wfStatus != "") && (wfTask == "Finance" && wfStatus != "") && (wfTask == "City Manager's Office Approval" && wfStatus == "")) {
        logDebug("Starting to send notification to the Planning Director");
        include("5122_CityClerk_Notifications");
        logDebug("Finished sending notification to the Planning Director");
    }
// }

//Below is the logic for Temp Use
// if ("CityClerk/Incident/TempUse/NA".equals(appTypeString)) {
//     if ((wfTask == "Housing and Community Services" && wfStatus != "") && (wfTask == "Finance" && wfStatus != "") && (wfTask == "PROS" && wfStatus != "") && (wfTask == "Pw Traffic" && wfStatus != "") && 
//         (wfTask == "Zoning" && wfStatus != "") && (wfTask == "Library" && wfStatus != "") && (wfTask == "Water" && wfStatus != "") && (wfTask == "Communications" && wfStatus != "") && 
//         (wfTask == "Police Patrol" && wfStatus != "") && (wfTask == "Police Traffic" && wfStatus != "") && (wfTask == "Fire" && wfStatus != "") && (wfTask == "Licensing" && wfStatus != "") && 
//         (wfTask == "Building" && wfStatus != "") && (wfTask == "Risk" && wfStatus != "") && (wfTask == "City Manager's Office Approval" && wfStatus == "")) {
//         logDebug("Starting to send notification to the Planning Director");
//         include("5122_CityClerk_Notifications");
//         logDebug("Finished sending notification to the Planning Director");
//     }
// // }

// //Below is the logic for Temp Sign
// // if ("CityClerk/Incident/TempSign/NA".equals(appTypeString)) {
//     if ((wfTask == "Housing and Community Services" && wfStatus != "") && (wfTask == "City Managers Office" && wfStatus != "") && (wfTask == "Zoning" && wfStatus != "") &&
//         (wfTask == "Risk Mgmt" && wfStatus != "") && (wfTask == "Pw Traffic" && wfStatus != "") && (wfTask == "Finance" && wfStatus != "") && (wfTask == "City Manager's Office Approval" && wfStatus == "")) {
//         logDebug("Starting to send notification to the Planning Director");
//         include("5122_CityClerk_Notifications");
//         logDebug("Finished sending notification to the Planning Director");
//     }
// }
logDebug("End of WTUA;CityClerk");

// aa.sendMail("rprovinc@auroragov.org", "rprovinc@auroragov.org", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);
// Script Tester footer.  Comment this out when deploying.
// }	

// catch (err) 
// {
// 	logDebug("A JavaScript Error occured: " + err.message);
// }
// aa.env.setValue("ScriptReturnCode", "0");
// aa.env.setValue("ScriptReturnMessage", debug)