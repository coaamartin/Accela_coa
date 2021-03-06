/*Examples of Initializations for this script tester...
var eventName = "ApplicationSubmitAfter";
var eventName = "WorkflowTaskUpdateAfter"; wfTask = "Application Submittal"; wfStatus = "Admin Approved"; wfDateMMDDYYYY = "01/27/2015";
var eventName = "InspectionResultSubmitAfter"; inspResult = "Failed"; inspResultComment = "Comment"; inspType = "Roofing";
var eventName = "InspectionScheduleAfter"; inspType = "Roofing";
var eventName = "PaymentReceiveAfter"; 
*/

//You typically have to initialize some of these globals when using the script tester.
var myCapId = "18-000008-MJS";
var myUserId = "JMAIN";
var eventName = "";
var wfTask = "";
var wfStatus = "";

var useProductScript = true;  // set to true to use the "productized" master scripts (events->master scripts), false to use scripts from (events->scripts)
var runEvent = true; // set to true to simulate the event and run all std choices/scripts for the record type.  

/* master script code don't touch */ aa.env.setValue("EventName",eventName); var vEventName = eventName;  var controlString = eventName;  var tmpID = aa.cap.getCapID(myCapId).getOutput(); if(tmpID != null){aa.env.setValue("PermitId1",tmpID.getID1()); 	aa.env.setValue("PermitId2",tmpID.getID2()); 	aa.env.setValue("PermitId3",tmpID.getID3());} aa.env.setValue("CurrentUserID",myUserId); var preExecute = "PreExecuteForAfterEvents";var documentOnly = false;var SCRIPT_VERSION = 3.0;var useSA = false;var SA = null;var SAScript = null;var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS","SUPER_AGENCY_FOR_EMSE"); if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") { 	useSA = true; 		SA = bzr.getOutput().getDescription();	bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS","SUPER_AGENCY_INCLUDE_SCRIPT"); 	if (bzr.getSuccess()) { SAScript = bzr.getOutput().getDescription(); }	}if (SA) {	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS",SA,useProductScript));	eval(getScriptText("INCLUDES_ACCELA_GLOBALS",SA,useProductScript));	/* force for script test*/ showDebug = true; eval(getScriptText(SAScript,SA,useProductScript));	}else {	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS",null,useProductScript));	eval(getScriptText("INCLUDES_ACCELA_GLOBALS",null,useProductScript));	}	eval(getScriptText("INCLUDES_CUSTOM",null,useProductScript));if (documentOnly) {	doStandardChoiceActions2(controlString,false,0);	aa.env.setValue("ScriptReturnCode", "0");	aa.env.setValue("ScriptReturnMessage", "Documentation Successful.  No actions executed.");	aa.abortScript();	}var prefix = lookup("EMSE_VARIABLE_BRANCH_PREFIX",vEventName);var controlFlagStdChoice = "EMSE_EXECUTE_OPTIONS";var doStdChoices = true;  var doScripts = false;var bzr = aa.bizDomain.getBizDomain(controlFlagStdChoice ).getOutput().size() > 0;if (bzr) {	var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice ,"STD_CHOICE");	doStdChoices = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";	var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice ,"SCRIPT");	doScripts = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";	}	function getScriptText(vScriptName, servProvCode, useProductScripts) {	if (!servProvCode)  servProvCode = aa.getServiceProviderCode();	vScriptName = vScriptName.toUpperCase();	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();	try {		if (useProductScripts) {			var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);		} else {			var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");		}		return emseScript.getScriptText() + "";	} catch (err) {		return "";	}}logGlobals(AInfo); if (runEvent && typeof(doStandardChoiceActions) == "function" && doStdChoices) try {doStandardChoiceActions(controlString,true,0); } catch (err) { logDebug(err.message) } if (runEvent && typeof(doScriptActions) == "function" && doScripts) doScriptActions(); var z = debug.replace(/<BR>/g,"\r");  aa.print(z); 

/*
User code generally goes inside the try block below.
*/

try 
{

logDebug("Starting Email Test...");

showDebug = true;
aa.env.setValue("eventType","Batch Process");

//HashMap for email template
var emailtemplatename = "DENIAL OF LICENSE APPLICATION #248";
var emailparams = aa.util.newHashtable();
emailparams.put("$$ContactEmail$$", "jmain@auroragov.org");
emailparams.put("$$altID$$", "18-000008-MJS");
emailparams.put("$$wfDate$$", "03/21/2018");
emailparams.put("$$recordName$$", "MJ License");
emailparams.put("$$FullAddress$$", "123 Happy St, Aurora, CO 80012");
emailparams.put("$$ContactFullName$$", "John Doe");
emailparams.put("$$recordAlias$$", "Whatever a record alias is");
emailparams.put("$$wfComment$$", "You have been denied!");

//HashMap for report params
var reportname = "JD_TEST_REPORT";
var reportparams = aa.util.newHashtable();
reportparams.put("DEPARTMENT", "Administrator");

//run Emmett's async email function
logDebug("Getting ready to run emailAsync_coa.js");

// Generates report and sends email
emailAsync("ewylam@etechconsultingllc.com;jmain@auroragov.org", emailtemplatename, emailparams, reportname, reportparams, "mickey mouse, phil collins", "");

// Just Sends email
emailAsync("ewylam@etechconsultingllc.com,jmain@auroragov.org", emailtemplatename, emailparams, "", "", "", "");

logDebug("Done - did you get an email?");

}

catch (err) 
{
	logDebug("A JavaScript Error occured: " + err.message);
}

// end of user code
aa.env.setValue("ScriptReturnCode", "0");
aa.env.setValue("ScriptReturnMessage", debug)