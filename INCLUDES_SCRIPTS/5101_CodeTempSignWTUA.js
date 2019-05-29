// SCRIPTNUMBER: 5101
// SCRIPTFILENAME: 5101_CodeTempSignWTUA.js
// PURPOSE: Called when Enforcement Temp Sign record has task updated. 
// DATECREATED: 04/24/2019
// BY: amartin
// CHANGELOG: 
//Script Tester header.  Comment this out when deploying.
//var myCapId = "19-000190-CTS";
//var myUserId = "AMARTIN";
//var eventName = "";
//var wfTask = "Final Approval 2";
//var wfStatus = "Suspended";
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
logDebug("---------------------> 5101_CodeTempSignWTUA is starting.");	

//I cannot get the async to work so using non-async by forcing env variable.
aa.env.setValue("eventType","Batch Process");

var currentDate = sysDateMMDDYYYY;

function getComments()
{
	var appTypeAlias = cap.getCapType().getAlias();
	var aQuery = "exec coa_get_workflow_comments '" + appTypeAlias + "','" + capId.getID1() + "','" + capId.getID3() + "'";
		logDebug("query is: " + aQuery);		
	return aQuery;
}

function getWorkflowComments()
{
	var aQuery = getComments();
    var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
    var ds = initialContext.lookup("java:/AA");
    var conn = ds.getConnection();
    var sStmt = conn.prepareStatement(aQuery);
    var rSet = sStmt.executeQuery();
    var counter = 0;
    while (rSet.next()) {
		counter = counter + 1;
		var foundComments = rSet.getString("Comment");
		logDebug("Found a comment: " + foundComments);			
	}
    sStmt.close();
    conn.close();
	return foundComments;
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

if (wfTask == "Final Approval 1") {
	//updateAppStatus("PAYMENT PENDING", "Script 5101");	

	//Send email
	var emailTemplate = "TEMP SIGN DEPT APPL";		
	var todayDate = new Date();
	var signType = AInfo["Type of Sign"];
	var signAddress = AInfo["Address where proposed sign will be displayed"];
	if (emailTemplate != null && emailTemplate != "") {
		logDebug("5101 sending TEMP SIGN DEPT APPL.  Defaulting to contact Applicant.");	
		eParams = aa.util.newHashtable();
		eParams.put("$$ContactEmail$$", "");			
		eParams.put("$$todayDate$$", todayDate);
		eParams.put("$$altid$$",capId.getCustomID());
		eParams.put("$$capAlias$$",cap.getCapType().getAlias());
		eParams.put("$$signType$$",signType);	
		eParams.put("$$signAddress$$",signAddress);			
		logDebug('Attempting to send email: ' + emailTemplate + " : " + capId.getCustomID());
		emailContacts("Applicant", emailTemplate, eParams, null, null, "Y");
	}		
}

if (wfTask == "Final Approval 2" && wfStatus == "Approved") {
	updateAppStatus("PAYMENT PENDING", "Script 5101");	
	updateFee("ENF_TS1", "ENF_TS", "FINAL", 1, "Y");	

	//Send a GENERIC INVOICE
	var emailTemplate = "GENERIC INVOICE";		
	var todayDate = new Date();
	var goPay = "https://awebdev.aurora.city/CitizenAccess/urlrouting.ashx?type=1009&Module=" + cap.getCapModel().getModuleName(); + "&capID1=" + capId.getID1() + "&capID2=" + capId.getID2() + "&capID3=" + capId.getID3() + "&agencyCode=AURORACO&HideHeader=false";
	logDebug("goPay is." + goPay);	
	if (emailTemplate != null && emailTemplate != "") {
		logDebug("5101 sending generic invoice.  Defaulting to contact Applicant.");	
		eParams = aa.util.newHashtable();
		eParams.put("$$ContactEmail$$", "");			
		eParams.put("$$todayDate$$", todayDate);
		eParams.put("$$altid$$",capId.getCustomID());
		eParams.put("$$capAlias$$",cap.getCapType().getAlias());
		eParams.put("$$goPay$$",goPay);		
		logDebug('Attempting to send email: ' + emailTemplate + " : " + capId.getCustomID());
		emailContacts("Applicant", emailTemplate, eParams, null, null, "Y");
	}		
}

if (wfTask == "Final Approval 2" && wfStatus == "Denied") {
	updateAppStatus("DENIED", "Script 5101");	

	//Send email
	var emailTemplate = "TEMP SIGN FINAL APPL";		
	var todayDate = new Date();
	var signType = AInfo["Type of Sign"];
	var signAddress = AInfo["Address where proposed sign will be displayed"];
	if (emailTemplate != null && emailTemplate != "") {
		logDebug("5101 sending TEMP SIGN FINAL APPL.  Defaulting to contact Applicant.");	
		eParams = aa.util.newHashtable();
		eParams.put("$$ContactEmail$$", "");			
		eParams.put("$$todayDate$$", todayDate);
		eParams.put("$$altid$$",capId.getCustomID());
		eParams.put("$$capAlias$$",cap.getCapType().getAlias());
		eParams.put("$$signType$$",signType);	
		eParams.put("$$signAddress$$",signAddress);		
		eParams.put("$$resolution$$","DENIED");	
		eParams.put("$$allComments$$",foundComments2);				
		logDebug('Attempting to send email: ' + emailTemplate + " : " + capId.getCustomID());
		emailContacts("Applicant", emailTemplate, eParams, null, null, "Y");
	}	
}

if (wfTask == "Final Approval 2" && wfStatus == "Suspended") {
	updateAppStatus("WITHDRAWN", "Script 5101");	

	//Send email
	var emailTemplate = "TEMP SIGN FINAL APPL";		
	var todayDate = new Date();
	var signType = AInfo["Type of Sign"];

	var foundComments2 = getWorkflowComments();	
	var signAddress = AInfo["Address where proposed sign will be displayed"];
	if (emailTemplate != null && emailTemplate != "") {
		logDebug("5101 sending TEMP SIGN FINAL APPL.  Defaulting to contact Applicant.");	
		eParams = aa.util.newHashtable();
		eParams.put("$$ContactEmail$$", "");			
		eParams.put("$$todayDate$$", todayDate);
		eParams.put("$$altid$$",capId.getCustomID());
		eParams.put("$$capAlias$$",cap.getCapType().getAlias());
		eParams.put("$$signType$$",signType);	
		eParams.put("$$signAddress$$",signAddress);		
		eParams.put("$$resolution$$","WITHDRAWN");	
		eParams.put("$$allComments$$",foundComments2);			
		logDebug('Attempting to send email: ' + emailTemplate + " : " + capId.getCustomID());
		emailContacts("Applicant", emailTemplate, eParams, null, null, "Y");
	}	
}

if (wfTask == "Application Close" && wfStatus == "Approved") {
	updateAppStatus("GROUND SIGNS", "Script 5101");	
	var eventDate = AInfo["Event 1 End"];
	newDate = dateAdd(eventDate,1);	
	//scheduleInspectDate("Reinspection 1", newDate);	
	scheduleInspectDate("Reinspection 1", newDate,inspectorObj)	
	
	eventDate = AInfo["Event 1 Start"];
	scheduleInspectDate("Notify Event", eventDate,inspectorObj)		
	//Need to email out the permit.
}

if (wfTask == "Application Close" && wfStatus == "Denied") {
	updateAppStatus("Closed", "Script 5101");		
	cancelInspections();
}

logDebug("---------------------> 5101_CodeTempSignWTUA.js ended.");
//Script Tester footer.  Comment this out when deploying.
//}	

//catch (err) 
//{
//	logDebug("A JavaScript Error occured: " + err.message);
//}
//aa.env.setValue("ScriptReturnCode", "0");
//aa.env.setValue("ScriptReturnMessage", debug)
