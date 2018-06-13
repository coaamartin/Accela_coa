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


var SCRIPT_VERSION = 3.0;
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));


// Load Batch Parameters
// n/a

// Main Executable
try {
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
		logDebug("**size of capIDList = " + capIDList.length));
	}
/*
	for (c in capIDList) {
		capId = capIDList[c].getCapID();

		if (isTaskActive(TASK_TO_CHECK_ACTIVE)) {
			sysDate = aa.date.getCurrentDate();
			var taskDueDate = getTaskDueDate(TASK_TO_CHECK_ACTIVE);
			if (taskDueDate == null || taskDueDate == "") {
				continue;
			}

			taskDueDate = aa.date.getScriptDateTime(taskDueDate);
			taskDueDate = formatDateX(taskDueDate);
			now = formatDateX(aa.date.getCurrentDate());

			if (aa.date.diffDate(now, taskDueDate) > 0) {

				//prevent errors when run in non-event
				systemUserObj = aa.person.getCurrentUser().getOutput();
				message = "";

				if (NEW_APP_STATUS != null && NEW_APP_STATUS.trim() != "") {
					updateAppStatus(NEW_APP_STATUS, "By Batch, Appeal expired");
				}

				updateTask(TASK_TO_CHECK_ACTIVE, APPEAL_TASK_STATUS, "By Batch, Appeal expired", "By Batch, Appeal expired");
				deactivateTask(TASK_TO_CHECK_ACTIVE);
				activateTask(TASK_TO_ACTIVATE);
			}//due date passed
		}//still active
	}//for all capIds
*/
	} catch (ex) {
	logDebug("**ERROR failed to run batch " + ex);
}

/**
 * Format a ScriptDate mm/dd/yyyy
 * @param scriptDate
 * @returns {String} formatted date
 */
function formatDateX(scriptDate) {
	var ret = "";
	ret += scriptDate.getMonth().toString().length == 1 ? "0" + scriptDate.getMonth() : scriptDate.getMonth();
	ret += "/";
	ret += scriptDate.getDayOfMonth().toString().length == 1 ? "0" + scriptDate.getDayOfMonth() : scriptDate.getDayOfMonth();
	ret += "/";
	ret += scriptDate.getYear();
	return ret;
}

function getScriptText(e) {
	var t = aa.getServiceProviderCode();
	if (arguments.length > 1)
		t = arguments[1];
	e = e.toUpperCase();
	var n = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		var r = n.getScriptByPK(t, e, "ADMIN");
		return r.getScriptText() + ""
	} catch (i) {
		return ""
	}
}

