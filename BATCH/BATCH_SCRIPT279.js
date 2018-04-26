/*
Title : Update Assigned to and due dates on workflow (Batch) 

Purpose : check if certain tasks are active, with no staff assigned, then assign staff to the Task.
check other Tasks for certain wfStatus, and update Due Date

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
	updateAssignedStaffAndDueDateWorkflow([ "Planning Review", "Staff Report", "Prepare Signs and Notice - PC" ], "PC Legal Notification", [ "Notification Sent" ],
		"Prepare Signs and Notice - PC", "Staff Report", "Planning Commission");

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
	updateAssignedStaffAndDueDateWorkflow([ "Planning Review", "Staff Report", "Prepare Signs and Notice - PC" ], "PC Legal Notification", [ "Notification Sent" ],
			"Prepare Signs and Notice - PC", "Staff Report", "Planning Commission");
} catch (ex) {
	logDebug("**ERROR batch execution failed:" + ex);
}

/**
 * check Tasks if not assigned to staff, assignes them<br>check wfTask if has certain status then update due date of other tasks
 * @param wfTasksCheckAssignedStaff tasks to check if active and has no staff assigned
 * @param wfTaskChkStatus tasks to check if has a certain status
 * @param wfStatusArray status to check if matched
 * @param wfTaskDueDate12Days task to update due date meeting +12 working days
 * @param wfTaskDueDate16Days task to update due date meeting +16 working days
 * @param meetingType use it's date to calculate and update tasks DueDate
 * @returns {Boolean}
 */
function updateAssignedStaffAndDueDateWorkflow(wfTasksCheckAssignedStaff, workFlowTaskNameForDueDate, workflowStatusArray, wfTaskDueDate12Days, wfTaskDueDate16Days, meetingType) {

	var nowDateFormatted = aa.util.formatDate(new Date(), "MM/dd/YYYY");

	var capTypeModel = aa.cap.getCapTypeModel().getOutput();
	capTypeModel.setGroup("Planning");
	capTypeModel.setType("Application");
	capTypeModel.setSubType(null);
	capTypeModel.setCategory(null);
	var capModel = aa.cap.getCapModel().getOutput();
	capModel.setCapType(capTypeModel);
	var capIdScriptModelList = aa.cap.getCapIDListByCapModel(capModel).getOutput();

	logDebug("**INFO Total records=" + capIdScriptModelList.length);

	for (r in capIdScriptModelList) {
		capId = capIdScriptModelList[r].getCapID();

		//skip SubType=Address (by Specs)
		var thisCap = aa.cap.getCap(capId).getOutput();
		if (thisCap.getCapType().getSubType().equalsIgnoreCase("Address")) {
			continue;
		}

		logDebug("-------- capID=" + capId);
		var tasks = aa.workflow.getTasks(capId).getOutput();
		for (t in tasks) {
			var task = tasks[t];
			//check if DueDate need update:
			if (task.getTaskDescription() == workFlowTaskNameForDueDate) {
				for (s in workflowStatusArray) {
					if (task.getDisposition() == workflowStatusArray[s]) {
						var meetings = aa.meeting.getMeetingsByCAP(capId, true);
						if (!meetings.getSuccess()) {
							logDebug("**WARN could not get meetings capId=" + capId + " error:" + meetings.getErrorMessage());
							break;
						}
						meetings = meetings.getOutput().toArray();
						for (m in meetings) {
							if (meetings[m].getMeeting().getMeetingType() != null && meetings[m].getMeeting().getMeetingType().equalsIgnoreCase(meetingType)) {
								var meetingDate = new Date(meetings[m].getMeeting().getStartDate().getTime());
								var prev12 = getPrevWorkingDays(meetingDate, 12);
								var prev16 = getPrevWorkingDays(prev12, 4);

								prev12 = aa.util.formatDate(prev12, "MM/dd/YYYY");
								prev16 = aa.util.formatDate(prev16, "MM/dd/YYYY");
								editTaskDueDate(wfTaskDueDate12Days, prev12);
								editTaskDueDate(wfTaskDueDate16Days, prev16);
								break;//stop meetings loop
							}//meeting found
						}//for all meetings
						break;//stop all statuses loop
					}//status matched
				}//for all statuses
			}//check if WFtask of dueDate update

			for (a in wfTasksCheckAssignedStaff) {
				var noStaffAssigned = (task.getAssignedStaff() == null || ((task.getAssignedStaff().getUserID() == "" || task.getAssignedStaff().getUserID() == null) && task
						.getAssignedStaff().getFullName() == ""));

				//Prepare Signs and Notice - PC
				if (task.getTaskDescription() == wfTasksCheckAssignedStaff[a] && task.getActiveFlag() == "Y" && noStaffAssigned) {
					var assignmentDateFormatted = aa.util.formatDate(convertDate(task.getAssignmentDate()), "MM/dd/YYYY");

					if (assignmentDateFormatted == nowDateFormatted) {
						var capDetails = aa.cap.getCapDetail(capId).getOutput();
						var recordStaff = capDetails.getAsgnStaff();
						if (recordStaff == null || recordStaff == "") {
							logDebug("**WARN No staff assigned on record:");
							continue;
						}
						recordStaff = aa.person.getUser(recordStaff);
						if (!recordStaff.getSuccess()) {
							logDebug("**WARN failed to getUser for Staff:" + recordStaff);
							continue;
						}
						recordStaff = recordStaff.getOutput();
						task.getTaskItem().setAssignedUser(recordStaff);
						var edited = aa.workflow.assignTask(task.getTaskItem());
						if (!edited.getSuccess()) {
							logDebug("**WARN task edit failed, error:" + edited.getErrorMessage());
						}//edit success?
					}//assigned today
				}//active, no staff
			}//all task names (inactive - no staff)
		}//for all tasks
	}//for all caps
	return true;
}

/**
 * Calculates date of N working days before a date
 * @param fromDate {Date} date to calculate from
 * @param numOfDays working days number
 * @returns {Date} date of N working days before fromDate 
 */
function getPrevWorkingDays(fromDate, numOfDays) {
	var prev = null;
	while (numOfDays-- != 0) {
		prev = aa.calendar.getPreviousWorkDay(aa.date.getScriptDateTime(fromDate));
		prev = prev.getOutput();
		fromDate = prev;
	}
	return prev;
}
