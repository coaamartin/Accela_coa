//Written by rprovinc   
//
//include("5127_CityClerk_PRA.js");

//*****************************************************************************
//Script PRA;CityClerk!Incident!~!~.js
//Record Types:	CityClerk\Incident\*\* 
//Event: 		PRA
//Desc:			Payment Receive after.Sending emails to citizen letting them know that there permit was Approved.
//
//Created By: Rprovinc
//******************************************************************************
// SCRIPTNUMBER: 5127
// SCRIPTFILENAME: 5127_CityClerk_PRA.js
// PURPOSE: Called when Temp Use record has Payment activity.
// DATECREATED: 08/17/2020
// BY: 
// CHANGELOG: 
//Script Tester header.  Comment this out when deploying.
//var myCapId = "20-000093-CTU";
//var myUserId = "RPROVINC";
//var eventName = "PaymentRecieveAfter";
//var wfTask = "Application Close";
//var wfStatus = "";


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


appTypeResult = cap.getCapType(); //create CapTypeModel object
appTypeString = appTypeResult.toString();
appTypeArray = appTypeString.split("/");
logDebug("Check to see what type of record it running and then update app status, task status and send email of permit approval.");


//Donation Bins code
if ("Application Close".equals(wfTask)) {
    var bal = getCapBalanceDue();
    logDebug("Current balance: " + bal);
    logDebug("Starting DB approval email and updating statues");

    //Check balance and update task
    if (bal == 0){
    updateAppStatus("Approved","Status updated via script 5127_CityClerk_PRA.js");
    updateTask("Application Close", "Approved", "Updated via script 5127_CityClerk_PRA.js");
    include("5124_CityClerk_Approval");
}				
} 

// //Temp Use code
// else if ("CityClerk/Incident/TempUse/NA".equals(appTypeString)) {
//     logDebug("Starting TU approval email and updating statues");
//     include("5124_CityClerk_Approval");
//     activateTask("Application Close");
//     updateAppStatus("PERMIT ISSUED","Status updated via script 5127_CityClerk_PRA.js");
//     updateTask("Application Close", "Approved", "Updated via script 5127_CityClerk_PRA.js");	
// }

// //Temp Sign code
// else if ("CityClerk/Incident/TempSign/NA".equals(appTypeString)) {
//     logDebug("Starting TS approval email and updating statues");
//     include("5124_CityClerk_Approval");
//     activateTask("Application Close");
//     updateAppStatus("PERMIT ISSUED","Status updated via script 5127_CityClerk_PRA.js");
//     updateTask("Application Close", "Approved", "Updated via script 5127_CityClerk_PRA.js");	
// }

function getCapBalanceDue() {
    //Optional capId
    itemCap = capId;
    if (arguments.length == 1)
        itemCap = arguments[0];

    var feesArr = loadFees();
    if (!feesArr)
        return 0;

    var tot = 0;
    for (i in feesArr)
    {
    	//if (("INVOICED".equals(feesArr[i].status)) || (("NEW".equals(feesArr[i].status))))
    	//{
    		tot += (+feesArr[i].amount) - (+feesArr[i].amountPaid);
         
         
    	//}
        
    }
    
    return tot;
}
logDebug("End of 5127_CityClerk_PRA script"); 

logDebug("---------------------> 5127_CityClerk_PRA.js ended.");
aa.sendMail("rprovinc@auroragov.org", "rprovinc@auroragov.org", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);
//Script Tester footer.  Comment this out when deploying.
//}	

//catch (err) 
//{
//	logDebug("A JavaScript Error occured: " + err.message);
//}
//aa.env.setValue("ScriptReturnCode", "0");
//aa.env.setValue("ScriptReturnMessage", debug)