//WTUA:Building/Permit/*/*
//Call all customs for wf:Permit Issuance/Issued
if (wfTask == "Permit Issuance" && wfStatus == "Issued") {
    script208_UpdatePermitFields();
    //script206_DeactivateFEMA(); //Commented out since it is being done in WTUA:Building/*/*/*
}

//Call all customs for wf:Accepted/Accept Plans
if (wfTask == "Accepted" && wfStatus == "Accept Plans") {
    updateExpirationDateAsi();
}

//Call all customs for wfStatus of Resubmittal Requested
if (wfStatus == "Resubmittal Requested") {
    updateExpirationDateAsi();
}


if (wfTask == "Inspection Phase" && wfStatus == "Temporary CO Issued") {
    /*------------------------------------------------------------------------------------------------------/
      Title 		: Building Certificate of Occupancy does Complete on License WF(WorkflowTaskUpdateAfter).
      
      Purpose		:If the workflow task "Inspection Phase" has a status of "Temporary CO Issued" or "Ready for CO" then use the address on
      		the record to go out and see if an MJ License Application exists on that address. and If a MJ License Application exists on
      		that address then close the workflow task "Certificate of Occupancy" with a status of "Final CO Issued".
      			
      Author :   Israa Ismail
      
      Functional Area : Records 
      
      Sample Call : closeWfTaskCertificateOfOccupancy()
      
      Notes		: Provided Record type "MJ License Application" , is not available ,replaced with a Sample Record Type "Licenses/Marijuana/Retail Store/License"
      	          ,to be replaced with the correct record type
      ------------------------------------------------------------------------------------------------------*/
    closeWfTaskCertificateOfOccupancy();
}

var vCoOASI = getAppSpecific("Certificate of Occupancy");

if (wfTask == "Inspection Phase" && wfStatus == "Ready for CO" && vCoOASI == "CHECKED") {
    activateTask("Certificate Of Occupancy");
} else {
    deactCoOIfNotChecked();
}

if (wfTask == "Inspection Phase" && wfStatus == "Final") {
    deactCoOIfNotChecked();

    if ((allTasksComplete("BLD_NEWCON") == false) || (allTasksComplete("BLD_MASTER") == false)) {
        updateAppStatus("Issued", "Status updated via script");
    }

}

if (wfTask == "Backflow Preventor" && wfStatus == "Final") {
    deactCoOIfNotChecked();
    include("5040_backFlowPreventerEmail");
}

/*
Title : Set the Code Reference custom field value (WorkflowTaskUpdateAfter)
Purpose : If the workflow status = "Issued" and the custom field "Code Reference" is not filled out with data then
          update the "Code Reference" field with the value "2015 I-Codes/Aurora Muni Codes/2017-NEC".

Author: Ahmad WARRAD
 
Functional Area : Records

Sample Call:
	setCodeReference("Complete");

Notes:
1- The script will update the "Code Reference" custom field, when the workflow status = "Issued"
*/

setCodeReference("Issued");


//Script ID#60  Resubmittal Requested Notification 
include("5060_ResubmittalRequestedNotification");


//*****************************************************************************
//Script WTUA;CityClerk!Incident!~!~.js
//Record Types:	CityClerk\Incident\*\* 
//Event: 		WTUA
//Desc:			
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

logDebug("Starting WTUA;Building!Permit!~!~.js");
// if (wfTask == "Planning Director Approval" && wfStatus != "") {

//     // Script 5121_CityClerk
//     include("5128_CityClerk_CityManager_email");

// }

//Below is going to be logic for an email to be sent to the Planning Director after all other WFtasks have been statused with anything or to not empty status.
//Each workflow has different steps. Going to need to call each record type seperatly. 
//Below is the logic for donation bin
// if ("CityClerk/Incident/DonationBin/NA".equals(appTypeString)) {
//     logDebug("Looking at wf tasks and status to see if Planning Director email can send.");
//     if ((wfTask == "Housing and Community Services" || wfTask == "City Managers Office" || wfTask == "Zoning" || wfTask == "Risk Mgmt" || wfTask == "Pw Traffic" ||
//             wfTask == "Finance") && wfStatus == "Approved") {
//         logDebug("All workflow steps have been approved. Ready to send Planning Director email.");
//         logDebug("Starting to send notification to the Planning Director");
//         include("5122_CityClerk_Notifications");
//         logDebug("Finished sending notification to the Planning Director");

//     }
//     }

//Below is the logic for donation bin
if (isTaskActive("Final Approval")) {
    logDebug("Looking at wf tasks and status to see if Final approval email can send.");
    logDebug("All workflow steps have been approved. Ready to send Final Approval email.");
    logDebug("Starting to send notification to fianl approval staff");
    include("5122_CityClerk_Notifications");
    logDebug("Finished sending notification to the final approvers");
}

//Need logic below that will send communication out to citizen if more info is needed to proceed
if (wfStatus == "Additional Information Required") {

    include("5123_CityClerk_AddInfoEmail");
}

if (wfTask == "Final Approval" && wfStatus == "Approved") {

    // Script 5124_CityClerk
    //include("5124_CityClerk_Approval");
    include("5121_CityClerk");
    include("5129_Cert_Attach");

}


if (wfTask == "Final Approval" && wfStatus == "Denied") {

    //Script 5125_CityClerk_Denial
    include("5125_CityClerk_Denial");
    updateAppStatus("DENIED", "Script 5125_CityClerk_Denial");
    closeAllTasks(capId, "");
}
logDebug("End of WTUA;Building");

// aa.sendMail("rprovinc@auroragov.org", "rprovinc@auroragov.org", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);
// Script Tester footer.  Comment this out when deploying.
// }	

// catch (err) 
// {
// 	logDebug("A JavaScript Error occured: " + err.message);
// }
// aa.env.setValue("ScriptReturnCode", "0");
// aa.env.setValue("ScriptReturnMessage", debug)