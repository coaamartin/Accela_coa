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

var SCRIPT_VERSION = 3.0;

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

eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_BATCH"));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));
eval(getMasterScriptText("INCLUDES_CUSTOM"));

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

function getScriptText(vScriptName) {
	var servProvCode = aa.getServiceProviderCode();
	if (arguments.length > 1)
		servProvCode = arguments[1]; // use different serv prov code
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		var emseScript = emseBiz.getScriptByPK(servProvCode, vScriptName, "ADMIN");
		return emseScript.getScriptText() + "";
	} catch (err) {
		return "";
	}
}

try {
	showDebug = true;
	showMessage = true;

	if (String(aa.env.getValue("showDebug")).length > 0) {
		showDebug = aa.env.getValue("showDebug").substring(0, 1).toUpperCase().equals("Y");
	}
	logDebug("START****  Execution of Batch Script 258 PLN Activate Review Consolidation");
	var capTypeModel = aa.cap.getCapTypeModel().getOutput();
	var tmpAry = RECORD_TYPE.split("/");
	
	capTypeModel.setGroup("Planning");
	capTypeModel.setType("*");
	capTypeModel.setSubType("*");
	capTypeModel.setCategory("*");

	var capModel = aa.cap.getCapModel().getOutput();
	capModel.setCapType(capTypeModel);
	
	var capIDList = aa.cap.getCapIDListByCapModel(capModel);
	if (!capIDList.getSuccess()) {
		logDebug("**INFO failed to get capIds list " + capIDList.getErrorMessage());
		capIDList = new Array();//empty array script will exit
	} else {
		capIDList = capIDList.getOutput();
		logDebug("**size of capIDList = " + capIDList.length);
	}

	logDebug("END  ****  Execution of Batch Script 258 PLN Activate Review Consolidation");
logDebug("END  ****  Execution of Batch Script 258 PLN Activate Review Consolidation");
logDebug("END  ****  Execution of Batch Script 258 PLN Activate Review Consolidation");
logDebug("END  ****  Execution of Batch Script 258 PLN Activate Review Consolidation");
logDebug("END  ****  Execution of Batch Script 258 PLN Activate Review Consolidation");
logDebug("END  ****  Execution of Batch Script 258 PLN Activate Review Consolidation");
logDebug("END  ****  Execution of Batch Script 258 PLN Activate Review Consolidation");
logDebug("END  ****  Execution of Batch Script 258 PLN Activate Review Consolidation");
logDebug("END  ****  Execution of Batch Script 258 PLN Activate Review Consolidation");
logDebug("END  ****  Execution of Batch Script 258 PLN Activate Review Consolidation");
logDebug("END  ****  Execution of Batch Script 258 PLN Activate Review Consolidation");
logDebug("END  ****  Execution of Batch Script 258 PLN Activate Review Consolidation");
logDebug("END  ****  Execution of Batch Script 258 PLN Activate Review Consolidation");
logDebug("END  ****  Execution of Batch Script 258 PLN Activate Review Consolidation");
logDebug("END  ****  Execution of Batch Script 258 PLN Activate Review Consolidation");
logDebug("END  ****  Execution of Batch Script 258 PLN Activate Review Consolidation");
logDebug("END  ****  Execution of Batch Script 258 PLN Activate Review Consolidation");
logDebug("END  ****  Execution of Batch Script 258 PLN Activate Review Consolidation");
logDebug("END  ****  Execution of Batch Script 258 PLN Activate Review Consolidation");

	} catch (ex) {
	logDebug("**ERROR failed to run batch " + ex);
}



