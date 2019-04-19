// SCRIPTNUMBER: 5099
// SCRIPTFILENAME: 5099_CodeInformationalWTUA.js
// PURPOSE: Called when Enforcement Informational record has task signoff.
// DATECREATED: 04/18/2019
// BY: amartin
// CHANGELOG: 
//Script Tester header.  Comment this out when deploying.
//var myCapId = "19-000110-CIE";
//var myUserId = "AMARTIN";
//var eventName = "";
//var wfTask = "Issue Classification";
//var wfStatus = "BANNERS";
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
logDebug("---------------------> At start of 5099 ASA");	
//I cannot get the async to work so using non-async by forcing env variable.
//aa.env.setValue("eventType","Batch Process");

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
function cancelInspectionsByType(inspType) {
	logDebug("---------------------> In the cancelInspectionsByType function");		
	var inspResultObj = aa.inspection.getInspections(capId);
	if (inspResultObj.getSuccess()) {
		inspList = inspResultObj.getOutput();
		for (xx in inspList) {
			if (String(inspList[xx].getInspectionType()).equalsIgnoreCase(inspType)) {
			var inspId = inspList[xx].getIdNumber();
			var res=aa.inspection.cancelInspection(capId, inspId);
			if (res.getSuccess()){
				aa.debug("Inspection Cancelled" , inspId);
			}
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
	if(codeDistrict && codeDistrict.length > 0){
	var inspOfficer = assignOfficer(codeDistrict);
	}
	if (inspOfficer) {
		var inspRes = aa.person.getUser(inspOfficer);
		if (inspRes.getSuccess())
		{var inspectorObj = inspRes.getOutput();}
	}				
} catch (err) {
	logDebug("Failed to retrieve code area for code officer assignment: " + err.stack);
};

//insert inspection and assign to inspOfficer
if(codeDistrict && codeDistrict.length > 0){
	var inspOfficer = assignOfficer(codeDistrict);
}
if (inspOfficer) {
	var inspRes = aa.person.getUser(inspOfficer);
	if (inspRes.getSuccess())
		{var inspectorObj = inspRes.getOutput();}
}			

var currentDate = sysDateMMDDYYYY;
var reinspectionDays = 30;
var maxEvents;

editAppSpecific("Application Date", currentDate);	

if (wfTask == "Issue Classification" && wfStatus == "Pennants") {
	updateAppStatus("Pennants", "Script 5099");	
	reinspectionDays = 30;
	maxEvents = "Reinspection 1";
	editAppSpecific("Permit Application Event", "Activities");	

	//insert inspection and assign to inspOfficer
	if(codeDistrict && codeDistrict.length > 0){
		var inspOfficer = assignOfficer(codeDistrict);
	}
	if (inspOfficer) {
		var inspRes = aa.person.getUser(inspOfficer);
		if (inspRes.getSuccess())
			{var inspectorObj = inspRes.getOutput();}
		}			
	scheduleInspection("Notify Event", reinspectionDays,inspectorObj);		
	//Change enddate of event task
    newDate = dateAdd(currentDate,reinspectionDays-1);
	activateTask("Event 1");   		
}

if (wfTask == "Issue Classification" && wfStatus == "Banners") {
	updateAppStatus("Banners", "Script 5099");	
	scheduleInspection("Pictures", 0,inspectorObj); //, inspector, null, newInspReqComments);		
	reinspectionDays = 16;
	maxEvents = "Reinspection 4";
	newDate = dateAdd(currentDate,reinspectionDays);
	editTaskDueDate("Event 1", newDate);	
	scheduleInspectDate("Reinspection 1", newDate);
    editAppSpecific("Banner Event 1", currentDate);			
}

if (wfTask == "Issue Classification" && wfStatus == "Christmas Tree Lots") {
	updateAppStatus("Christmas Tree Lots", "Script 5099");	
	newDate = dateFormatted('1', '15', sysDate.getYear()+1, "");	
	scheduleInspectDate("Reinspection 1", newDate);
	
	activateTask("Event 1");  	
	editTaskDueDate("Event 1", newDate);	
	
    editAppSpecific("Christmas Tree Lot App Date", currentDate);	
	editAppSpecific("Permit Application Event", "Activities");		
}

if (wfTask == "Issue Classification" && wfStatus == "Garage Sales") {
	updateAppStatus("Garage Sales", "Script 5099");	
	reinspectionDays = 3;
	maxEvents = "Reinspection 4";
	newDate = dateAdd(currentDate,reinspectionDays);
	editTaskDueDate("Event 1", newDate);	
	scheduleInspectDate("Reinspection 1", newDate);
    editAppSpecific("Garage Sale Event 1", currentDate);	
	//insert inspection and assign to inspOfficer
	if(codeDistrict && codeDistrict.length > 0){
		var inspOfficer = assignOfficer(codeDistrict);
	}
	if (inspOfficer) {
		var inspRes = aa.person.getUser(inspOfficer);
		if (inspRes.getSuccess())
			{var inspectorObj = inspRes.getOutput();}
		}			
	scheduleInspection("Pictures", 3,inspectorObj);		
}

if (wfTask == "Issue Classification" && wfStatus == "Inflatables") {
	updateAppStatus("Inflatables", "Script 5099");	
	reinspectionDays = 3;
	maxEvents = "Reinspection 1";
	newDate = dateAdd(currentDate,reinspectionDays);	
	scheduleInspectDate("Reinspection 1", newDate);
    editAppSpecific("Inflatable Event", currentDate);	
}

if (wfTask == "Issue Classification" && wfStatus == "Miscellaneous") {
	updateAppStatus("Miscellaneous", "Script 5099");	
	//insert inspection and assign to inspOfficer
	if(codeDistrict && codeDistrict.length > 0){
		var inspOfficer = assignOfficer(codeDistrict);
	}
	if (inspOfficer) {
		var inspRes = aa.person.getUser(inspOfficer);
		if (inspRes.getSuccess())
			{var inspectorObj = inspRes.getOutput();}
		}			
	scheduleInspection("Pictures", 0,inspectorObj);	
	cancelInspectionsByType("Reinspection 1");	
}

if (wfTask == "Issue Classification" && wfStatus == "Pictures Only") {
	updateAppStatus("Pictures Only", "Script 5099");	
	scheduleInspection("Pictures", 0,inspectorObj);	
}

logDebug("---------------------> 5099_CodeInformationalASA.js ended.");
//Script Tester footer.  Comment this out when deploying.
//}	

//catch (err) 
//{
//	logDebug("A JavaScript Error occured: " + err.message);
//}
//aa.env.setValue("ScriptReturnCode", "0");
//aa.env.setValue("ScriptReturnMessage", debug)
