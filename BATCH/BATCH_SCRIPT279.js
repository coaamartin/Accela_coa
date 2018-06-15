/*
Title : Update Assigned to and due dates on workflow (Batch)

Purpose : check if certain tasks are active, with no staff assigned, then assign staff to the Task.
check other Tasks for certain wfStatus, and update Due Date

Batch Job - Runs hourly For Planning/Application/~/~ records, except Planning/Application/Address/*.
If the workflow task(s) "Planning Review" or "Staff Report" or "Prepare Signs and Notice - PC" are active with a Start date of Today
   and do not have a staff assigned to the task then
   update the workflow task "Assigned to" with the staff in Record Detail Assigned user.

If the workflow task = "PC Legal Notification" has a status of "Notification Sent"
   then wf task "Prepare Sign and Notification" should become active 13 working
   days before the planning commission meeting date and set the due date 9 working days before the Planning Commission
   Meeting date on the record.
In addition update the workflow task "Staff Report" to become active 13 working days and set
due date to 8 working days before the Planning Commission Meeting date.

Author: Yazan Barghouth

Functional Area : Records

Sample Call:
    updateAssignedStaffAndDueDateWorkflow([ "Planning Review", "Staff Report", "Prepare Signs and Notice - PC" ], "PC Legal Notification", [ "Notification Sent" ],
        "Prepare Signs and Notice - PC", "Staff Report", "Planning Commission");

*/

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

var capId = null;
try {
    updateAssignedStaffAndDueDateWorkflow([ "Planning Review", "Staff Report", "Prepare Signs and Notice - PC" ], "PC Legal Notification", [ "Notification Sent" ],
            "Prepare Signs and Notice - PC", "Staff Report", "Planning Commission");
} catch (ex) {
    logDebug("**ERROR batch execution failed:" + ex + ". Line Number: " + ex.lineNumber + ". Stack: " + ex.stack);
}


/*------------------------------------------------------------------------------------------------------/
| <=========== Errors and Reporting
/------------------------------------------------------------------------------------------------------*/
showDebug = true;
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
    var today = aa.util.parseDate(dateAdd(null, 0));

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
        capId = aa.cap.getCapID(capId.getID1(), capId.getID2(), capId.getID3()).getOutput();

        //skip SubType=Address (by Specs)
        var thisCap = aa.cap.getCap(capId).getOutput();
        if (thisCap.getCapType().getSubType().equalsIgnoreCase("Address")) {
            continue;
        }

        logDebug("-------- capID=" + capId + ", altId=" + capId.getCustomID());
        
        /* If the workflow task = "PC Legal Notification" has a status of "Notification Sent"
               then wf task "Prepare Sign and Notification" should become active 13 working
               days before the planning commission meeting date and set the due date 9 working days before the Planning Commission
               Meeting date on the record.
            In addition update the workflow task "Staff Report" to become active 13 working days and set
            due date to 8 working days before the Planning Commission Meeting date.
        */
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
                                var meetingDateSDT = aa.date.getScriptDateTime(meetingDate);
                                //Days between today and meeting date
                                var days13BeforeMeet = getPrevWorkingDays(meetingDate, 13);
                                days13BeforeMeet.setHours(0);
                                days13BeforeMeet.setMinutes(0);
                                days13BeforeMeet.setSeconds(0);
                                
                                //If it's 13 days then we activate tasks if not active
                                if(days13BeforeMeet.getTime() == today.getTime()){
                                    activateTask4Batch(capId, wfTaskDueDate12Days);
                                    activateTask4Batch(capId, wfTaskDueDate16Days)
                                }
                                var prev12 = getPrevWorkingDays(meetingDate, 9);
                                var prev16 = getPrevWorkingDays(meetingDate, 8);

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

            
            /* If the workflow task(s) "Planning Review" or "Staff Report" or "Prepare Signs and Notice - PC" are active with a Start date of Today
               and do not have a staff assigned to the task then
               update the workflow task "Assigned to" with the staff in Record Detail Assigned user. */
            for (a in wfTasksCheckAssignedStaff) {
                var noStaffAssigned = (task.getAssignedStaff() == null || ((task.getAssignedStaff().getUserID() == "" || task.getAssignedStaff().getUserID() == null) &&
                                       task.getAssignedStaff().getFullName() == ""));

                //Prepare Signs and Notice - PC
                if (task.getTaskDescription() == wfTasksCheckAssignedStaff[a] && task.getActiveFlag() == "Y" && noStaffAssigned) {
                    var assignmentDateFormatted = "";
                    if(task.getAssignmentDate())
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
                        else
                            logDebug("Successfully assigned task " + task.getTaskDescription().trim());
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
