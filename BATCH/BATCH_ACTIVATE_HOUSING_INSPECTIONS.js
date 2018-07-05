/*------------------------------------------------------------------------------------------------------/
| Program       : BATCH_ACTIVATE_HOUSING_INSPECTIONS.js
| Event         : 
|
| Created by    : JHS
| Created at    : 04/07/2018 16:08:35
/------------------------------------------------------------------------------------------------------*/
var daySpan = 60;
var lookAheadDays = 0;
var fromDate = ""; // testing only
var toDate = "";  // testing only
var currentUserID = "ADMIN";
var systemUserObj = aa.person.getUser(currentUserID).getOutput();

var SCRIPT_VERSION = 3.0;
var useCustomScriptFile = true;  // if true, use Events->Custom Script, else use Events->Scripts->INCLUDES_CUSTOM
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, useCustomScriptFile));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS", null, useCustomScriptFile));
eval(getScriptText("INCLUDES_CUSTOM", null, useCustomScriptFile));

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

var sysDate = aa.date.getCurrentDate();
// Global variables
var batchStartDate = new Date();
// System Date
var batchStartTime = batchStartDate.getTime();
var startTime = batchStartTime;
var batchJobName = "" + aa.env.getValue("BatchJobName"); // Name of the batch job

try{
    printDebug("Batch started on " + batchStartDate);
	if (!fromDate.length) { // no "from" date, assume today + number of days to look ahead
		fromDate = dateAdd(null, parseInt(lookAheadDays));
	}
	if (!toDate.length) { // no "to" date, assume today + number of look ahead days + span
		toDate = dateAdd(null, parseInt(lookAheadDays) + parseInt(daySpan))
	}
	
    useAppSpecificGroupName=false;
    var capListResult = aa.cap.getCapIDsByAppSpecificInfoDateRange("GENERAL INFORMATION", "Date of Next Inspection", aa.date.parseDate(fromDate), aa.date.parseDate(toDate));
    printDebug("Processing records with 'GENERAL INFORMATION.Date of Next Inspection' custom field between " + fromDate + " and " + toDate);
    var capList = capListResult.getOutput();
    for (var xx in capList) {
        var capId = capList[xx].getCapID();
        capId = aa.cap.getCapID(capId.getID1(), capId.getID2(), capId.getID3()).getOutput();
        var altId = capId.getCustomID();
		printDebug("Record : " + altId);
		if (!isTaskActive("Case Intake")) {
			activateTaskBatch("Case Intake");
		}
		if (!"Pending Housing Inspection".equals(taskStatus("Case Intake"))) {
			updateTaskBatch("Case Intake","Pending Housing Inspection",batchJobName,batchJobName);
		}
    }
    
    printDebug("Run Time     : " + elapsed());
    printDebug("Batch ended on " + new Date());
}
catch (err){
    printDebug("error : stopped batch processing BATCH_BUILDING_PERMIT_ABOUT_TO_EXPIRE_NOTICE" + err + ". Line number: " + err.lineNumber + ". Stack: " + err.stack);
}


function elapsed() {
    var thisDate = new Date();
    var thisTime = thisDate.getTime();
    return ((thisTime - batchStartTime) / 1000)
}

function printDebug(dstr){
    aa.print(dstr + br);
}

function activateTaskBatch(wfstr) // optional process name
{
	var useProcess = false;
	var processName = "";
	if (arguments.length == 2) {
		processName = arguments[1]; // subprocess
		useProcess = true;
	}

	var workflowResult = aa.workflow.getTaskItems(capId, wfstr, processName, null, null, null);
	if (workflowResult.getSuccess())
		var wfObj = workflowResult.getOutput();
	else {
		printDebug("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage());
		return false;
	}

	for (i in wfObj) {
		var fTask = wfObj[i];
		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName))) {
			var stepnumber = fTask.getStepNumber();
			var processID = fTask.getProcessID();

			if (useProcess) {
				aa.workflow.adjustTask(capId, stepnumber, processID, "Y", "N", null, null)
			} else {
				aa.workflow.adjustTask(capId, stepnumber, "Y", "N", null, null)
			}
			printDebug("Activating Workflow Task: " + wfstr);
		}
	}
}

function updateTaskBatch(wfstr, wfstat, wfcomment, wfnote) // optional process name, cap id
{
	var systemUserObj = aa.person.getUser("ADMIN").getOutput();
	var useProcess = false;
	var processName = "";
	if (arguments.length > 4) {
		if (arguments[4] != "") {
			processName = arguments[4]; // subprocess
			useProcess = true;
		}
	}
	var itemCap = capId;
	if (arguments.length == 6)
		itemCap = arguments[5]; // use cap ID specified in args

	var workflowResult = aa.workflow.getTaskItems(itemCap, wfstr, processName, null, null, null);
	if (workflowResult.getSuccess())
		var wfObj = workflowResult.getOutput();
	else {
		printDebug("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage());
		return false;
	}

	if (!wfstat)
		wfstat = "NA";
	for (i in wfObj) {
		var fTask = wfObj[i];
		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName))) {
			var dispositionDate = aa.date.getCurrentDate();
			var stepnumber = fTask.getStepNumber();
			var processID = fTask.getProcessID();
			if (useProcess)
				var r = aa.workflow.handleDisposition(itemCap, stepnumber, processID, wfstat, dispositionDate, wfnote, wfcomment, systemUserObj, "U");
			else
				var r = aa.workflow.handleDisposition(itemCap, stepnumber, wfstat, dispositionDate, wfnote, wfcomment, systemUserObj, "U");
			printDebug("Updating Workflow Task " + wfstr + " with status " + wfstat + " " + r.getErrorMessage());
			
		}
	}
}
