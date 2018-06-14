/*Title : BATCH_SCRIPT 258 PLN ACTIVATE REVIEW CONSOLIDATION
Purpose : 1 week before due date activate task and assignment
Author: SLS Eric Koontz

Functional Area : Batch Job

Description : 
Runs nightly For all Planning records 7 days before the due date and wfTask Review Consolidation 
is not active. (might be able to use Application Status of In Review to tell if there are Review 
tasks vs other tasks) Action Activate wfTask Review Consolidation and assign this task to the 
Assigned User on Record Detail. This allows the Case Manager to check on Reviews 1 week before 
the due date. Req for Planning

Parameters:
TASK_TO_CHECK_ACTIVE: Task name to check if active or not, to get "due date" and to be deactivated
APPEAL_TASK_STATUS: the new status for the task
RECORD_TYPE: record type that will be used (processed) (4 levels)
NEW_APP_STATUS: the application status used to update CAP (empty string value will not change app status)
TASK_TO_ACTIVATE: the task to be activated if criteria matched
*/

/*------------------------------------------------------------------------------------------------------/
| TESTING PARAMETERS (Uncomment to use in the script tester)
/------------------------------------------------------------------------------------------------------*/
//aa.env.setValue("paramStdChoice","COA_LIC_EXPIRE");
//aa.env.setValue("eventType","Batch Process");
/*------------------------------------------------------------------------------------------------------/
| Program: Batch Expiration Template.js  Trigger: Batch
| Client: COA
|
|
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| USER CONFIGURABLE PARAMETERS
/------------------------------------------------------------------------------------------------------*/
currentUserID = "ADMIN";
useAppSpecificGroupName = false;
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
var useCustomScriptFile = true;  // if true, use Events->Custom Script, else use Events->Scripts->INCLUDES_CUSTOM
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
    eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", SA, useCustomScriptFile));
    eval(getScriptText("INCLUDES_ACCELA_GLOBALS", SA, useCustomScriptFile));
    eval(getScriptText(SAScript, SA));
} else {
    eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, useCustomScriptFile));
    eval(getScriptText("INCLUDES_ACCELA_GLOBALS", null, useCustomScriptFile));
}

eval(getScriptText("INCLUDES_CUSTOM", null, useCustomScriptFile));

eval(getScriptText("INCLUDES_BATCH", null, false));

function getMasterScriptText(vScriptName) {
	var servProvCode = aa.getServiceProviderCode();
	if (arguments.length > 1)
		servProvCode = arguments[1]; // use different serv prov code
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
		return emseScript.getScriptText() + "";
	} catch (err) {
		return "";
	}
}

function getScriptText(vScriptName, servProvCode, useProductScripts) {
    if (!servProvCode) servProvCode = aa.getServiceProviderCode();
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    try {
        if (useProductScripts) {
            var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
        } else {
            var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
        }
        return emseScript.getScriptText() + "";
    } catch (err) {
        return "";
    }
}
/*------------------------------------------------------------------------------------------------------/
| CORE EXPIRATION BATCH FUNCTIONALITY
/------------------------------------------------------------------------------------------------------*/
try {
	showMessage = false;
	showDebug = true;
	if (String(aa.env.getValue("showDebug")).length > 0) {
		showDebug = aa.env.getValue("showDebug").substring(0, 1).toUpperCase().equals("Y");
	}

	sysDate = aa.date.getCurrentDate();
	var startDate = new Date();
	var startTime = startDate.getTime(); // Start timer
	var systemUserObj = aa.person.getUser("ADMIN").getOutput();

	sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(), sysDate.getDayOfMonth(), sysDate.getYear(), "");
	batchJobResult = aa.batchJob.getJobID();
	batchJobName = "" + aa.env.getValue("BatchJobName");
	batchJobID = 0;

	if (batchJobResult.getSuccess()) {
		batchJobID = batchJobResult.getOutput();
		logDebug("Batch Job " + batchJobName + " Job ID is " + batchJobID);
	} else {
		logDebug("Batch job ID not found " + batchJobResult.getErrorMessage());
	}
	
	/*------------------------------------------------------------------------------------------------------/
	| <===========Main=Loop================>
	/-----------------------------------------------------------------------------------------------------*/

	logDebug("BATCH_SCRIPT 258 PLN ACTIVATE REVIEW CONSOLIDATION:  Start of Job");

	mainProcess();

	logDebug("BATCH_SCRIPT 258 PLN ACTIVATE REVIEW CONSOLIDATION:  End of Job: Elapsed Time : " + elapsed() + " Seconds");
	
	/*------------------------------------------------------------------------------------------------------/
	| <===========END=Main=Loop================>
	/-----------------------------------------------------------------------------------------------------*/	
} catch (err) {
	handleError(err,"Batch Job:" + batchJobName + " Job ID:" + batchJobID);
}

/*------------------------------------------------------------------------------------------------------/
| <=========== Errors and Reporting
/------------------------------------------------------------------------------------------------------*/
if (debug.indexOf("**ERROR") > 0) {
	aa.env.setValue("ScriptReturnCode", "1");
	aa.env.setValue("ScriptReturnMessage", debug);
} else {
	aa.env.setValue("ScriptReturnCode", "0");
	if (showMessage) {
		aa.env.setValue("ScriptReturnMessage", message);
	}
	if (showDebug) {
		aa.env.setValue("ScriptReturnMessage", debug);
	}
}
/*------------------------------------------------------------------------------------------------------/
| FUNCTIONS (mainProcess is the core function for processing expiration records)
/------------------------------------------------------------------------------------------------------*/
function mainProcess() {
	var capIdsResult = aa.cap.getByAppType("Planning", "Application");
	
	if(!capIdsResult.getSuccess()){
		logDebug("UNABLE to get applications: " + capIdsResult.getErrorMessage());
		return false;
	}
	
	var capIds = capIdsResult.getOutput();
	for(each in capIds){
		var oneRec = capIds[each];
		var capId = oneRec.getCapID();
		var altId = capId.getCustomID();
		var assignedUser = getAssignedStaff4Batch(capId);
		
	}
}

function printObjProperties(obj){
    var idx;

    if(obj.getClass != null){
        aa.print("************* " + obj.getClass() + " *************");
    }

    for(idx in obj){
        if (typeof (obj[idx]) == "function") {
            try {
                aa.print(idx + "==>  " + obj[idx]());
            } catch (ex) { }
        } else {
            aa.print(idx + ":  " + obj[idx]);
        }
    }
}
