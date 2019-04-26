// SCRIPTNUMBER: 5102
// SCRIPTFILENAME: 5102_CodeTempSignIRSA.js
// PURPOSE: Called when Enforcement Temp Sign record has an Inspection activity.
// DATECREATED: 04/24/2019
// BY: amartin
// CHANGELOG: 
//Script Tester header.  Comment this out when deploying.
//var myCapId = "19-000097-CIE";
//var myUserId = "AMARTIN";
//var eventName = "InspectionResultSubmitAfter";
//var wfTask = "Foreclosure Information";
//var wfStatus = "NED/REO Recorded";
//var wfComment = "";
//var inspType = "Reinspection 1"
//var inspResult = "Start of Next Event"

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
logDebug("---------------------> 5102_CodeTempSignIRSA.js is starting.");
var currentDate = sysDateMMDDYYYY;

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
function cancelInspectionsByTypeStatus(inspType,inspStatus) {
	logDebug("---------------------> In the cancelInspectionsByTypeStatus function");		
	var inspResultObj = aa.inspection.getInspections(capId);
	if (inspResultObj.getSuccess()) {
		inspList = inspResultObj.getOutput();
		for (xx in inspList) {
			if (String(inspList[xx].getInspectionType()).equalsIgnoreCase(inspType) && inspList[xx].getInspectionStatus().equals(inspStatus)) {
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
	logDebug("Ready to compute a code officer: ");
try{
		logDebug("inside try ");
	var codeDistrict = new Array;
	codeDistrict = getGISBufferInfo("AURORACO","Code Enforcement Areas","0.01","CODE_NUMBER")
			logDebug("codedistrict is: " + codeDistrict);
	if(codeDistrict && codeDistrict.length > 0){
		logDebug("inside try ");
	var inspOfficer = assignOfficer(codeDistrict);
				logDebug("assigned officer is: " + inspOfficer);
	}
	if (inspOfficer) {
		var inspRes = aa.person.getUser(inspOfficer);
		if (inspRes.getSuccess())
		{var inspectorObj = inspRes.getOutput();}
	}				
} catch (err) {
	logDebug("Failed to retrieve code area for code officer assignment: " + err.stack);
};

if (inspType == "Reinspection 1") {
	logDebug("---------------------> Reinspection 1");	
	if (inspResult == "Start of Next Event") {
		logDebug("---------------------> Start of Next Event");	
		var eventDate = AInfo["Event 2 End"];
		newDate = dateAdd(eventDate,1);	
		scheduleInspectDate("Reinspection 2", newDate,inspectorObj)	
	}
	if (inspResult == "Up Without Permit") {
		logDebug("---------------------> Up Without Permit");	
		showMessage = true;
		comment("************ Create a Zoning record.  This is now a violation.");
	}	
}

if (inspType == "Reinspection 2") {
	logDebug("---------------------> Reinspection 2");	
	if (inspResult == "Start of Next Event") {
		logDebug("---------------------> Start of Next Event");	
		var eventDate = AInfo["Event 3 End"];
		newDate = dateAdd(eventDate,1);	
		scheduleInspectDate("Reinspection 3", newDate,inspectorObj)	
	}
	if (inspResult == "Up Without Permit") {
		logDebug("---------------------> Up Without Permit");	
		showMessage = true;
		comment("************ Create a Zoning record.  This is now a violation.");
	}	
}

if (inspType == "Reinspection 3") {
	logDebug("---------------------> Reinspection 3");	
	if (inspResult == "Start of Next Event") {
		logDebug("---------------------> Start of Next Event");	
		var eventDate = AInfo["Event 4 End"];
		newDate = dateAdd(eventDate,1);	
		scheduleInspectDate("Reinspection 4", newDate,inspectorObj)	
	}
	if (inspResult == "Up Without Permit") {
		logDebug("---------------------> Up Without Permit");	
		showMessage = true;
		comment("************ Create a Zoning record.  This is now a violation.");
	}	
}

if (inspType == "Reinspection 4") {
	logDebug("---------------------> Reinspection 4");	
	if (inspResult == "Start of Next Event") {
		logDebug("---------------------> Start of Next Event");	
		var eventDate = AInfo["Event 5 End"];
		newDate = dateAdd(eventDate,1);	
		scheduleInspectDate("Reinspection 5", newDate,inspectorObj)	
	}
	if (inspResult == "Up Without Permit") {
		logDebug("---------------------> Up Without Permit");	
		showMessage = true;
		comment("************ Create a Zoning record.  This is now a violation.");
	}	
}

if (inspType == "Reinspection 5") {
	logDebug("---------------------> Reinspection 5");	
	if (inspResult == "Start of Next Event") {
		logDebug("---------------------> Start of Next Event");	
		var eventDate = AInfo["Event 6 End"];
		newDate = dateAdd(eventDate,1);	
		scheduleInspectDate("Reinspection 6", newDate,inspectorObj)	
	}
	if (inspResult == "Up Without Permit") {
		logDebug("---------------------> Up Without Permit");	
		showMessage = true;
		comment("************ Create a Zoning record.  This is now a violation.");
	}	
}

if (inspType == "Reinspection 6") {
	logDebug("---------------------> Reinspection 5");	
	if (inspResult == "Start of Next Event") {
		logDebug("---------------------> Start of Next Event");	
		showMessage = true;
		comment("************ Create a Zoning record.  This is now a violation.");
	}
	if (inspResult == "Up Without Permit") {
		logDebug("---------------------> Up Without Permit");	
		showMessage = true;
		comment("************ Create a Zoning record.  This is now a violation.");
	}	
}

logDebug("---------------------> 5102_CodeTempSignIRSA.js ended.");
//Script Tester footer.  Comment this out when deploying.
//}	

//catch (err) 
//{
//	logDebug("A JavaScript Error occured: " + err.message);
//}
//aa.env.setValue("ScriptReturnCode", "0");
//aa.env.setValue("ScriptReturnMessage", debug)
