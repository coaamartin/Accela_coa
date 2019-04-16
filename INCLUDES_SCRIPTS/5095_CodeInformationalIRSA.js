// SCRIPTNUMBER: 5095
// SCRIPTFILENAME: 5095_CodeInformationalIRSA.js
// PURPOSE: Called when Enforcement Informational record has an Inspection activity.
// DATECREATED: 04/11/2019
// BY: amartin
// CHANGELOG: 
//Script Tester header.  Comment this out when deploying.
//var myCapId = "18-000337-CIE";
//var myUserId = "AMARTIN";
//var eventName = "ApplicationSpecificInfoUpdateAfter";
//var wfTask = "Foreclosure Information";
//var wfStatus = "NED/REO Recorded";
//var wfComment = "";
//var inspType = "Miscellaneous"
//var inspResult = "Complete"

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
logDebug("---------------------> At start of 5094 IRSA");
var currentDate = new Date();

function cancelInspections() {
	logDebug("---------------------> In the cancelInspections function");		
	var inspResultObj = aa.inspection.getInspections(capId);
	if (inspResultObj.getSuccess()) {
		inspList = inspResultObj.getOutput();
		for (xx in inspList) {
			var inspId = inspList[xx].getIdNumber();
			var res=aa.inspection.cancelInspection(capId, inspId);
			if (res.getSuccess()){
				aa.debug("Inspection Cancelled" , inspId);
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

if (inspType == "Pictures" && inspResult == "Reschedule") {
	logDebug("---------------------> Inspection Pictures - Reschedule");	
	cancelInspectionsByType("Pictures");	
	newDate = dateAdd(null,1);
	scheduleInspectDate("Pictures", newDate)
}

if (inspType == "Reinspection 1") {
	logDebug("---------------------> Reinspection 1");	
//start
var reinspectionDays = 30;
var maxEvents = "Reinspection 1";
if (AInfo["Type of Issue"] == "PENNANTS")
{	
	maxEvents = "Reinspection 1";
}
if (AInfo["Type of Issue"] == "INFLATABLES")
{	
	maxEvents = "Reinspection 1";
}
if (AInfo["Type of Issue"] == "BANNERS")
{	
	maxEvents = "Reinspection 4";
}	
if (AInfo["Type of Issue"] == "GARAGE SALES")
{	
	maxEvents = "Reinspection 4";
}	
if (AInfo["Type of Issue"] == "CHRISTMAS TREE LOTS")
{	
	maxEvents = "Reinspection 1";
	updateAppStatus("Closed", "Script 5095");	
}		
if (AInfo["Type of Issue"] != "CHRISTMAS TREE LOTS" && AInfo["Type of Issue"] != "PENNANTS")
{	
	newDate = dateAdd(null,reinspectionDays);
	scheduleInspectDate("Reinspection 1", newDate)
}	
//
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
	if (AInfo["Type of Issue"] == "BANNERS" || AInfo["Type of Issue"] == "INFLATABLES" || AInfo["Type of Issue"] == "PENNANTS" || AInfo["Type of Issue"] == "CHRISTMAS TREE LOTS") {
		if (inspResult == "Start of Next Event" || inspResult == "Up Without Permit") {
			if (checkEvents = 1) {
				showMessage = true;
                comment("Create a Zoning record.");
				editAppSpecific(nextEvent, currentDate);
			}
		}
	}
}

}

if (inspType == "Reinspection 2") {
	logDebug("---------------------> Reinspection 2");	
//start
var reinspectionDays = 30;
var maxEvents = "Reinspection 1";
if (AInfo["Type of Issue"] == "PENNANTS")
{	
	maxEvents = "Reinspection 1";
}
if (AInfo["Type of Issue"] == "INFLATABLES")
{	
	maxEvents = "Reinspection 1";
}
if (AInfo["Type of Issue"] == "BANNERS")
{	
	maxEvents = "Reinspection 4";
}	
if (AInfo["Type of Issue"] == "GARAGE SALES")
{	
	maxEvents = "Reinspection 4";
}	
if (AInfo["Type of Issue"] == "CHRISTMAS TREE LOTS")
{	
	maxEvents = "Reinspection 1";
	updateAppStatus("Closed", "Script 5095");	
}		
if (AInfo["Type of Issue"] != "CHRISTMAS TREE LOTS" && AInfo["Type of Issue"] != "PENNANTS")
{	
	newDate = dateAdd(null,reinspectionDays);
	scheduleInspectDate("Reinspection 1", newDate)
}	
//
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
	if (AInfo["Type of Issue"] == "BANNERS" || AInfo["Type of Issue"] == "INFLATABLES" || AInfo["Type of Issue"] == "PENNANTS") {
		if (inspResult == "Start of Next Event" || inspResult == "Up Without Permit") {
			if (checkEvents = 1) {
				showMessage = true;
                comment("Create a Zoning record.");
				editAppSpecific(nextEvent, currentDate);
			}
		}
	}
}

}

if (inspType == "Reinspection 3") {
	logDebug("---------------------> Reinspection 3");	
//start
var reinspectionDays = 30;
var maxEvents = "Reinspection 1";
if (AInfo["Type of Issue"] == "PENNANTS")
{	
	maxEvents = "Reinspection 1";
}
if (AInfo["Type of Issue"] == "INFLATABLES")
{	
	maxEvents = "Reinspection 1";
}
if (AInfo["Type of Issue"] == "BANNERS")
{	
	maxEvents = "Reinspection 4";
}	
if (AInfo["Type of Issue"] == "GARAGE SALES")
{	
	maxEvents = "Reinspection 4";
}	
if (AInfo["Type of Issue"] == "CHRISTMAS TREE LOTS")
{	
	maxEvents = "Reinspection 1";
	updateAppStatus("Closed", "Script 5095");	
}		
if (AInfo["Type of Issue"] != "CHRISTMAS TREE LOTS" && AInfo["Type of Issue"] != "PENNANTS")
{	
	newDate = dateAdd(null,reinspectionDays);
	scheduleInspectDate("Reinspection 1", newDate)
}	
//
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
	if (AInfo["Type of Issue"] == "BANNERS" || AInfo["Type of Issue"] == "INFLATABLES" || AInfo["Type of Issue"] == "PENNANTS") {
		if (inspResult == "Start of Next Event" || inspResult == "Up Without Permit") {
			if (checkEvents = 1) {
				showMessage = true;
                comment("Create a Zoning record.");
				editAppSpecific(nextEvent, currentDate);
			}
		}
	}
}

}

if (inspType == "Reinspection 4") {
	logDebug("---------------------> Reinspection 4");	
//start
var reinspectionDays = 30;
var maxEvents = "Reinspection 1";
if (AInfo["Type of Issue"] == "PENNANTS")
{	
	maxEvents = "Reinspection 1";
}
if (AInfo["Type of Issue"] == "INFLATABLES")
{	
	maxEvents = "Reinspection 1";
}
if (AInfo["Type of Issue"] == "BANNERS")
{	
	maxEvents = "Reinspection 4";
}	
if (AInfo["Type of Issue"] == "GARAGE SALES")
{	
	maxEvents = "Reinspection 4";
}	
if (AInfo["Type of Issue"] == "CHRISTMAS TREE LOTS")
{	
	maxEvents = "Reinspection 1";
	updateAppStatus("Closed", "Script 5095");	
}		
if (AInfo["Type of Issue"] != "CHRISTMAS TREE LOTS" && AInfo["Type of Issue"] != "PENNANTS")
{	
	newDate = dateAdd(null,reinspectionDays);
	scheduleInspectDate("Reinspection 1", newDate)
}	
//
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
	if (AInfo["Type of Issue"] == "BANNERS" || AInfo["Type of Issue"] == "INFLATABLES" || AInfo["Type of Issue"] == "PENNANTS") {
		if (inspResult == "Start of Next Event" || inspResult == "Up Without Permit") {
			if (checkEvents = 1) {
				showMessage = true;
                comment("Create a Zoning record.");
				editAppSpecific(nextEvent, currentDate);
			}
		}
	}
}

}

if (inspType == "Reinspection 5") {
	logDebug("---------------------> Reinspection 5");	

var reinspectionDays = 30;
var maxEvents = "Reinspection 1";
if (AInfo["Type of Issue"] == "PENNANTS")
{	
	maxEvents = "Reinspection 1";
}
if (AInfo["Type of Issue"] == "INFLATABLES")
{	
	maxEvents = "Reinspection 1";
}
if (AInfo["Type of Issue"] == "BANNERS")
{	
	maxEvents = "Reinspection 4";
}	
if (AInfo["Type of Issue"] == "GARAGE SALES")
{	
	maxEvents = "Reinspection 4";
}	
if (AInfo["Type of Issue"] == "CHRISTMAS TREE LOTS")
{	
	maxEvents = "Reinspection 1";
	updateAppStatus("Closed", "Script 5095");	
}		
if (AInfo["Type of Issue"] != "CHRISTMAS TREE LOTS" && AInfo["Type of Issue"] != "PENNANTS")
{	
	newDate = dateAdd(null,reinspectionDays);
	scheduleInspectDate("Reinspection 1", newDate)
}	
//
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
	if (AInfo["Type of Issue"] == "BANNERS" || AInfo["Type of Issue"] == "INFLATABLES" || AInfo["Type of Issue"] == "PENNANTS") {
		if (inspResult == "Start of Next Event" || inspResult == "Up Without Permit") {
			if (checkEvents = 1) {
				showMessage = true;
                comment("Create a Zoning record.");
				editAppSpecific(nextEvent, currentDate);
			}
		}
	}
}

}

if (inspType == "Reinspection 6") {
	logDebug("---------------------> Reinspection 6");	
//start
var reinspectionDays = 30;
var maxEvents = "Reinspection 1";
if (AInfo["Type of Issue"] == "PENNANTS")
{	
	maxEvents = "Reinspection 1";
}
if (AInfo["Type of Issue"] == "INFLATABLES")
{	
	maxEvents = "Reinspection 1";
}
if (AInfo["Type of Issue"] == "BANNERS")
{	
	maxEvents = "Reinspection 4";
}	
if (AInfo["Type of Issue"] == "GARAGE SALES")
{	
	maxEvents = "Reinspection 4";
}	
if (AInfo["Type of Issue"] == "CHRISTMAS TREE LOTS")
{	
	maxEvents = "Reinspection 1";
	updateAppStatus("Closed", "Script 5095");	
}		
if (AInfo["Type of Issue"] != "CHRISTMAS TREE LOTS" && AInfo["Type of Issue"] != "PENNANTS")
{	
	newDate = dateAdd(null,reinspectionDays);
	scheduleInspectDate("Reinspection 1", newDate)
}	
//
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
	if (AInfo["Type of Issue"] == "BANNERS" || AInfo["Type of Issue"] == "INFLATABLES" || AInfo["Type of Issue"] == "PENNANTS") {
		if (inspResult == "Start of Next Event" || inspResult == "Up Without Permit") {
			if (checkEvents = 1) {
				showMessage = true;
                comment("Create a Zoning record.");
				editAppSpecific(nextEvent, currentDate);
			}
		}
	}
}

}

if (inspType == "Verify Vacant") {
	logDebug("---------------------> Inspection Verify Vacant");	
	reinspectionDays = getAppSpecific("Reinspection Days");

	if (inspResult == "Order Boardup") {
		cancelInspectionsByType("Verify Vacant");		
		//insert inspection and assign to inspOfficer
		if(codeDistrict && codeDistrict.length > 0){
			var inspOfficer = assignOfficer(codeDistrict);
		}
		if (inspOfficer) {
			var inspRes = aa.person.getUser(inspOfficer);
			if (inspRes.getSuccess())
			{var inspectorObj = inspRes.getOutput();}
		}			
		scheduleInspection("Verify Vacant", 1,inspectorObj);		
	}
	if (inspResult == "Is Vacant") {
		cancelInspectionsByType("Verify Vacant");		
		//insert inspection and assign to inspOfficer
		if(codeDistrict && codeDistrict.length > 0){
			var inspOfficer = assignOfficer(codeDistrict);
		}
		if (inspOfficer) {
			var inspRes = aa.person.getUser(inspOfficer);
			if (inspRes.getSuccess())
			{var inspectorObj = inspRes.getOutput();}
		}			
		scheduleInspection("Verify Vacant", reinspectionDays,inspectorObj);		
	}	
	if (inspResult == "Close All Followups") {
		var capStatus = cap.getCapStatus();
		if (capStatus != 'Recorded')
		{
				logDebug("---------------------> Made it here");
			cancelInspections();	
			closeAllTasks(capId, "");
			updateAppStatus("Closed", "Script 5095");		
		}	
	}
}

if (inspType == "Notify Event" && inspResult == "Complete") {
	logDebug("---------------------> Notify Event - Complete");	
	cancelInspections();	
	closeAllTasks(capId, "");
	updateAppStatus("Closed", "Script 5095");	
}

if (inspType == "Miscellaneous" && inspResult == "Complete") {
	logDebug("---------------------> Miscellaneous - Complete");	
	updateAppStatus("Miscellaneous", "Script 5095");	
}

logDebug("---------------------> 5095_CodeInformationalIRSA.js ended.");
//Script Tester footer.  Comment this out when deploying.
//}	

//catch (err) 
//{
//	logDebug("A JavaScript Error occured: " + err.message);
//}
//aa.env.setValue("ScriptReturnCode", "0");
//aa.env.setValue("ScriptReturnMessage", debug)
