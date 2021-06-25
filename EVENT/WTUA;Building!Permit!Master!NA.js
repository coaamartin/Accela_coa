/*
Title : Add Master Plan Data to Share Dropdown for Building Records (ApplicationStatusUpdateAfter) 

Script: 324

Purpose : Based on ASI value, check and inactivate a row in a shared DDL, and insert a row in Shared DDL

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
    addMasterPlanDataToShrdDDList("Master Plan Type", "Approved", "Code Change");
*/
//Script 324
addMasterPlanDataToShrdDDList("Master Plan Type", "Approved", "Code Change");

if(ifTracer(wfTask == "Accepted In House" && wfStatus == "Route for Review", 'wf:Accepted In House/Route for Review')){
    bldScript418SetTskDueDate();
}

if(ifTracer(wfTask == "Planning Review" && wfStatus == "Approved", 'wf:Planning Review/Approved')){
//  assignInspectionDepartment("BUILDING/NA/NA/NA/NA/PT", "Accepted In House");
    pTasks = null; // List of Tasks to include, null for all applicable tasks
    pStatuses = null;   // List of Statuses for Task to include, null for all task statuses
    pActive = true; // Only active tasks
    // Get Tasks for current record.
    var tasks = getTasks_TPS(capId, pTasks, pStatuses, pActive); // Get Active Tasks
    for (var i in tasks) {
        fTask = tasks[i];
        var fTaskName = fTask.getTaskItem().getTaskDescription();
        assignTask_TPS(fTaskName, "", ""); // Clear user & dept
    }
}

// if(ifTracer(wfTask == "Accepted In House" && wfStatus == "Route to Planning", 'wf:Accepted In House/Route to Planning')){
//     if (inspType.indexOf("Accepted In House") != -1){
//     assignInspectionDepartment("BUILDING/NA/NA/NA/NA/PT", "Accepted In House");
//     }
// }

function getTasks_TPS() {
    var itemCapId = (arguments.length > 0 && arguments[0] ? arguments[0] : capId);
    var taskNames = (arguments.length > 1 && arguments[1] ? arguments[1] : null);
    var taskStatuses = (arguments.length > 2 && arguments[2] ? arguments[2] : null);
    var activeTask = (arguments.length > 3 && matches(arguments[3], true, "Y", "Yes") ? true : false);
    var completeTask = (arguments.length > 4 && matches(arguments[4], true, "Y", "Yes") ? true : false);
    var processName = (arguments.length > 5 && arguments[5] ? arguments[5] : null);
    var workflowResult = aa.workflow.getTasks(itemCapId);
    if (workflowResult.getSuccess())
        wfObj = workflowResult.getOutput();
    else {
        logDebug("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage());
        wfObj = [];
    }

    var tasks = [];
    for (i in wfObj) {
        fTask = wfObj[i];
        var fTaskName = fTask.getTaskItem().getTaskDescription();
        if (taskNames && !exists(fTask.getTaskItem().getTaskDescription(), taskNames)) continue; // Skip tasks not in list
        if (taskStatuses && !exists(fTask.getTaskItem().getDisposition(), taskStatuses)) continue; // Skip tasks not in list
        if (activeTask && !fTask.getActiveFlag().equals("Y")) continue; // Skip inactive tasks
        if (completeTask && !fTask.getCompleteFlag().equals("Y")) continue; // Skip inactive tasks
        if (processName && !fTask.getProcessCode().equals(processName)) continue; // Skip inactive tasks
        tasks.push(fTask);
    }
    return tasks;
}

function assignTask_TPS(wfstr) { // optional process name
    // Update the task assignment user or department
    // Use "" for user and department to clear it.
    var wfUserID = (arguments.length > 1 ? arguments[1] : null);
    var wfDepartment = (arguments.length > 2 ? arguments[2] : null);
    var useProcess = (arguments.length > 3 && arguments[3] ? true : false);
    var processName = (useProcess ? arguments[3] : "");
    var taskUserObj = null;
    var wfDeptKey = null;
    if (wfDepartment) {
        if (wfDepartment.toString().indexOf("/") >= 0) {
            wfDeptKey = wfDepartment;
        } else {
            if (typeof (getDeptKey)) {
                var wfDeptKey = getDeptKey(wfDepartment);             // Translate deptName into deptKey;
            }
        }
    }
    var fMsg = "assigning Workflow Task: " + wfstr
        + (wfUserID == null ? "" : " user to " + wfUserID)
        + (wfDepartment == null ? "" : (wfDepartment == "" ? "" : " & set department to " + wfDepartment));
    if (wfUserID == "") {
        var fMsg = "assigning Workflow Task: " + wfstr + " Clear user"
            + (wfDepartment == null ? "" : (wfDepartment == "" ? " & department" : " & set department to " + wfDepartment));
        var taskUserObj = aa.people.getSysUserModel();
    } else if (wfUserID) {
        var taskUserResult = aa.person.getUser(wfUserID);
        if (!taskUserResult.getSuccess()) {
            logDebug("**ERROR: Failed to get user object for " + wfUserID + ": " + taskUserResult.getErrorMessage());
            return false;
        }
        var taskUserObj = taskUserResult.getOutput();  //  User Object
        logDebug("Using user " + taskUserObj);
        wfDeptKey = null; // Assign to User's Dept.
    }
    if (wfDepartment && !wfDeptKey) { logDebug("ERROR: Failed to find department " + wfDepartment); return false; }

    var workflowResult = aa.workflow.getTaskItems(capId, wfstr, processName, null, null, null);
    if (!workflowResult.getSuccess()) {
        logDebug("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage());
        return false;
    }
    var wfObj = workflowResult.getOutput();
    for (var i in wfObj) {
        var fTask = wfObj[i];
        if (!fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase())) continue;
        if (useProcess && !fTask.getProcessCode().equals(processName)) continue;
        if (!taskUserObj) { // If task user not specified use currently assigned user.
            var taskUserObj = fTask.getTaskItem().getAssignedUser();
            logDebug("using task assigned user " + taskUserObj);
            if (!taskUserObj) {
                logDebug("ERROR: getting task assigned user for " + fMsg);
                return null;
            }
        }
        var prevAssignedUser = fTask.getTaskItem().getAssignedUser();
        var wfDept = wfDeptKey;
        if (wfDepartment == null && wfUserID == "") {
            wfDept = fTask.getTaskItem().getAssignedUser().getDeptOfUser();
            var fMsg = "assigning Workflow Task: " + wfstr + " Clear user"
                + (wfDept == null ? "" : (wfDept == "" ? " & department" : " & set department to " + wfDept));
        }
        if (wfDept) {
            logDebug("using dept " + wfDept);
            taskUserObj.setDeptOfUser(wfDept);
        }
        fTask.setAssignedUser(taskUserObj);
        var taskItem = fTask.getTaskItem();
        var adjustResult = aa.workflow.assignTask(taskItem);
        if (adjustResult.getSuccess()) {
            logDebug("Successfully " + fMsg);
            var fTaskAssignedUser = fTask.getTaskItem().getAssignedUser();
        } else
            logDebug("Error " + fMsg + " : " + adjustResult.getErrorMessage());
    }
}

function getDeptKey(deptName) {               // Translates deptName into an organizational deptKey
    var dpt = aa.people.getDepartmentList(null).getOutput();        // Get List of Departments.
    for (thisdpt in dpt) {
        var m = dpt[thisdpt]
        if (m.getDeptName().equals(deptName)) {
            logDebug("Found Dept: " + m.getDeptName() + " -> " + m.getDeptKey());
            return (m.getDeptKey())
        }
    }
    return null;        // return null if not found.
}
