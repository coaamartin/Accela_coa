// SCRIPTNUMBER: 5093
// SCRIPTFILENAME: 5093_CodeInformationalASIUA.js
// PURPOSE: Called when Enforcement Informational record has task updated.
// DATECREATED: 04/10/2019
// BY: amartin
// CHANGELOG: 
//Script Tester header.  Comment this out when deploying.
//var myCapId = "18-000337-CIE";
//var myUserId = "AMARTIN";
//var eventName = "";
//var wfTask = "Issue Classification";
//var wfStatus = "Pennants";
//var wfComment = "";
//var AInfo = "Type of Issue";

//var useProductScript = true;  // set to true to use the "productized" master scripts (events->master scripts), false to use scripts from (events->scripts)
//var runEvent = true; // set to true to simulate the event and run all std choices/scripts for the record type.  

///* master script code don't touch */ aa.env.setValue("EventName",eventName); var vEventName = eventName;  var controlString = eventName;  var tmpID = aa.cap.getCapID(myCapId).getOutput(); if(tmpID != null){aa.env.setValue("PermitId1",tmpID.getID1()); 	aa.env.setValue("PermitId2",tmpID.getID2()); 	aa.env.setValue("PermitId3",tmpID.getID3());} aa.env.setValue("CurrentUserID",myUserId); var preExecute = "PreExecuteForAfterEvents";var documentOnly = false;var SCRIPT_VERSION = 3.0;var useSA = false;var SA = null;var SAScript = null;var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS","SUPER_AGENCY_FOR_EMSE"); if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") { 	useSA = true; 		SA = bzr.getOutput().getDescription();	bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS","SUPER_AGENCY_INCLUDE_SCRIPT"); 	if (bzr.getSuccess()) { SAScript = bzr.getOutput().getDescription(); }	}if (SA) {	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS",SA,useProductScript));	eval(getScriptText("INCLUDES_ACCELA_GLOBALS",SA,useProductScript));	/* force for script test*/ showDebug = true; eval(getScriptText(SAScript,SA,useProductScript));	}else {	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS",null,useProductScript));	eval(getScriptText("INCLUDES_ACCELA_GLOBALS",null,useProductScript));	}	eval(getScriptText("INCLUDES_CUSTOM",null,useProductScript));if (documentOnly) {	doStandardChoiceActions2(controlString,false,0);	aa.env.setValue("ScriptReturnCode", "0");	aa.env.setValue("ScriptReturnMessage", "Documentation Successful.  No actions executed.");	aa.abortScript();	}var prefix = lookup("EMSE_VARIABLE_BRANCH_PREFIX",vEventName);var controlFlagStdChoice = "EMSE_EXECUTE_OPTIONS";var doStdChoices = true;  var doScripts = false;var bzr = aa.bizDomain.getBizDomain(controlFlagStdChoice ).getOutput().size() > 0;if (bzr) {	var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice ,"STD_CHOICE");	doStdChoices = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";	var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice ,"SCRIPT");	doScripts = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";	}	function getScriptText(vScriptName, servProvCode, useProductScripts) {	if (!servProvCode)  servProvCode = aa.getServiceProviderCode();	vScriptName = vScriptName.toUpperCase();	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();	try {		if (useProductScripts) {			var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);		} else {			var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");		}		return emseScript.getScriptText() + "";	} catch (err) {		return "";	}}logGlobals(AInfo); if (runEvent && typeof(doStandardChoiceActions) == "function" && doStdChoices) try {doStandardChoiceActions(controlString,true,0); } catch (err) { logDebug(err.message) } if (runEvent && typeof(doScriptActions) == "function" && doScripts) doScriptActions(); var z = debug.replace(/<BR>/g,"\r");  aa.print(z); 

/*
User code generally goes inside the try block below.
*/

//try 
//{
//your code here
//End script Tester header 
logDebug("---------------------> At start of 5093 ASIUA");	
//I cannot get the async to work so using non-async by forcing env variable.
aa.env.setValue("eventType","Batch Process");

function isEmptyOrNull(value) {
	return value == null || value === undefined || String(value) == "";
}
function cancelInspections() {
	logDebug("---------------------> In the cancelInspections function");		
	var inspResultObj = aa.inspection.getInspections(capId);
	if (inspResultObj.getSuccess()) {
		inspList = inspResultObj.getOutput();
		for (xx in inspList) {
			var inspId = inspList[xx].getIdNumber();
			var res=aa.inspection.cancelInspection(capId, inspId);
			if (res.getSuccess()){
				aa.debug("Inspection Canceled" , inspId);
			}
		}
	}
}
function assignOfficer(codeDistrict) {			
var inspOfficer = lookup("CODE_OFFICER_AREA#", codeDistrict);
	if (!inspOfficer) {
		logDebug("<br>**INFO could not retrieve Code Officer Name from CODE_OFFICER_AREA# USING JJKING AS ALTERNATE NAME.");
		return "jjking";
	} else {
		return inspOfficer;
	}
}

try{
	var codeDistrict = new Array;
	codeDistrict = getGISBufferInfo("AURORACO","Code Enforcement Areas","0.01","CODE_NUMBER")
} catch (err) {
	logDebug("Failed to retrieve code area for code officer assignment: " + err.stack);
};

//if (wfTask == "Issue Classification" && wfStatus == "Pennants") {
if (AInfo["Type of Issue"] == "Pennants")	{
	logDebug("---------------------> Type of Issue - Pennants");	
	var scheduleDate = new Date();
	if (!isEmptyOrNull(AInfo["Event 1 Start Date"])) {
		//use current date if not null
		scheduleDate = AInfo["Event 1 Start Date"];
	} 
	newDate = dateAdd(null,reinspectionDays);
	scheduleInspectDate("Reinspection 1", newDate);
	editTaskDueDate("Event 1", newDate);	
	scheduleInspectDate("Notify Event", newDate);	
}

var reinspectionDays = 30;
var maxEvents = "Reinspection 1";
if (AInfo["Type of Issue"] == "INFLATABLES")
{	
	reinspectionDays = 3;
	maxEvents = "Reinspection 1";
}
if (AInfo["Type of Issue"] == "BANNERS")
{	
	reinspectionDays = 16;
	maxEvents = "Reinspection 4";
}	
if (AInfo["Type of Issue"] == "GARAGE SALES")
{	
	reinspectionDays = 3;
	maxEvents = "Reinspection 4";
}		
if (AInfo["Type of Issue"] != "CHRISTMAS TREE LOTS" && AInfo["Type of Issue"] != "PENNANTS")
{	
	newDate = dateAdd(null,reinspectionDays);
	scheduleInspectDate("Reinspection 1", newDate)
}	
//Insert Pictures Inspection
var checkEvents = 0;
var nextEvent;
var inspectionTypesAry = [ "Reinspection 1", "Reinspection 2", "Reinspection 3","Reinspection 4", "Reinspection 5", "Reinspection 6" ];
logDebug("---------------------> Starting Count of Reinspections");	
var inspType = aa.inspection.getInspections(capId);
for (s in inspectionTypesAry) {
	if (inspType == inspectionTypesAry[s]) {	//&& inspResult == "Failed"
		checkEvents = checkEvents + 1;
		logDebug("---------------------> Reinspection Found: " + checkEvents);		
	}
}
logDebug("---------------------> Total Reinspection Found: " + checkEvents);	
nextEvent = "Reinspection " + checkEvents;
var foundInspection = 0;
if (checkEvents != 0 && nextEvent <= maxEvents) {
	if (AInfo["Type of Issue"] == "BANNERS" || AInfo["Type of Issue"] == "INFLATABLES" || AInfo["Type of Issue"] == "GARAGE SALES") {
		var inspectionTypesAry = [ "Pictures" ];
		logDebug("---------------------> Starting count of Pictures");	
		for (s in inspectionTypesAry) {
			if (inspType == inspectionTypesAry[s] && isEmptyOrNull(inspResult)) {	//&& inspResult == "Failed"
				foundInspection = foundInspection + 1;
				logDebug("---------------------> Pictures Found: " + foundInspection);		
			}
			logDebug("---------------------> Total Pictures Found: " + foundInspection);		
			if (foundInspection = 0) {
				scheduleInspection("Pictures", 0,inspectorObj);	
			}
		}
	}
}
//Insert the next calculated task
if (!exists(nextEvent)) {
	activateTask(nextEvent);
	newDate = dateAdd(null,reinspectionDays);
	editTaskDueDate(nextEvent, newDate);	
}
//}
		
logDebug("---------------------> 5093_CodeInformationalASIUA.js ended.");
//Script Tester footer.  Comment this out when deploying.
//}	

//catch (err) 
//{
//	logDebug("A JavaScript Error occured: " + err.message);
//}
//aa.env.setValue("ScriptReturnCode", "0");
//aa.env.setValue("ScriptReturnMessage", debug)
