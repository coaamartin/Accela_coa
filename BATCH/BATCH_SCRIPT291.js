/*
Title : Update workflow with plant tree status (Batch)

Purpose : If it is 1 day past the workflow task due date and workflow task Property Owner Response is Active then enter “Plant Tree”
status in Property Owner Response workflow task and move the workflow forward that should Activate the "Quality Control"
task. Then schedule a “Forestry Site Review” Inspection for current day + 5 business days. (note WTUA is Script # 152 so
perhaps script can run that one)

Author: Yazan Barghouth
 
Functional Area : Records

BATCH Parameters: NONE

*/

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

var SCRIPT_VERSION = 3.0;
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));

var capId = null;

try {
	updateWorkflowWithPlantTreeStatus("Property Owner Response", "Plant Tree", "Planting");
} catch (ex) {
	logDebug("**ERROR batch failed, error: " + ex);
}

/**
 * set wfTask status and schedule inspection if it's 1 day after due date
 * 
 * @param chkWfTaskName wf task name to check if active, and if due date was passed
 * @param newWfStatus status to set for chkWfTaskName
 * @param schedInspeType inspection to schedule after 5 business days
 */
function updateWorkflowWithPlantTreeStatus(chkWfTaskName, newWfStatus, schedInspeType) {
	var capTypeModel = aa.cap.getCapTypeModel().getOutput();
	capTypeModel.setGroup("Forestry");
	capTypeModel.setType("Request");
	capTypeModel.setSubType("Planting");
	capTypeModel.setCategory("NA");

	var capModel = aa.cap.getCapModel().getOutput();
	capModel.setCapType(capTypeModel);
	var capIdScriptModelList = aa.cap.getCapIDListByCapModel(capModel).getOutput();
	logDebug("**INFO total records=" + capIdScriptModelList.length);

	var now = new Date();

	for (r in capIdScriptModelList) {
		capId = capIdScriptModelList[r].getCapID();
		logDebug("####################### capId=" + capId);

		//getAppSpecific("Inspection Month")
		var tasks = aa.workflow.getTasks(capId).getOutput();
		for (t in tasks) {
			if (tasks[t].getTaskDescription() == chkWfTaskName && tasks[t].getActiveFlag() == "Y") {

				if (tasks[t].getDueDate() == null) {
					logDebug("**WARN task due date is null, SKIP...");
					break;
				}

				var diff = dateDiff(tasks[t].getDueDate(), now);//positive means due date is past
				diff = Math.floor(diff);
				if (diff == 1) {//1 day past due date

					//for some reason branchTask() did not work?!
					aa.workflow.handleDisposition(capId, tasks[t].getStepNumber(), newWfStatus, aa.date.getCurrentDate(), "by script, 1 day past due", "by script, 1 day past due",
							aa.person.getCurrentUser().getOutput(), "B");

					var dateToSched = dateAdd(now, 4);
					dateToSched = nextWorkDay(dateToSched);
					scheduleInspectDate(schedInspeType, dateToSched);
					logDebug("wf task processed, and new inspection scheduled on " + dateToSched);
				}//1 day past
			}//task matched and is active
		}//for all tasks
	}//for all caps
}