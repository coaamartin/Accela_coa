//Do not remove this variable.
var $iTrc = ifTracer;
/*
Title : Set Plan Coordination to Resubmittal Requested (WorkflowTaskUpdateAfter)
Purpose : if the last of the following parallel workflow tasks is statused: (Engineering Review, Water Dept Review, Life Safety
Review, Traffic Review, Parks Review) check all these workflow tasks and IF any of the statuses are NOT = Complete then
update the workflow task "Plan Coordination" with a status of "Resubmittal Requested" and send an email
notification to the applicant requesting revision and resubmittal of documents(
(need the email specifics).

Author: Haitham Eleisah

Functional Area : Records

Sample Call:
checkWorkFlowTaskAndSendEmail("Review Distribution","Route for Review",["Engineering Review", "Water Dept Review"], "Plan Coordination", "Resubmittal Requested", "Complete", "MESSAGE_NOTICE_PUBLIC WORKS");
 */

 logDebug('Script 296 Starting.');
var workFlowParentTask = "Review Distribution";
var workFlowParentStatus = "Route for Review";
var workflowTasks = [ "Engineering Review", "Water Dept Review", "Life Safety Review", "Traffic Review", "Parks Review" ];
var taskToUpdated = "Plan Coordination";
var Status = "Resubmittal Requested";
var statusToCheck = "Complete";

//printObjProps(wfTask);

if(ifTracer(workflowTasks.indexOf("" + wfTask) > -1, 'workflowTasks.indexOf(wfTask) > -1' )) {
    checkWorkFlowTaskAndSendEmail(workFlowParentTask, workFlowParentStatus, workflowTasks, taskToUpdated, Status, statusToCheck, "PW EASEMENT RESUBMITAL #296");
}

/*
Title : Update Signed License Due Date Custom Field (WorkflowTaskUpdateAfter)
Purpose : If the workflow task = "Signatures" exists and the workflow status = "Received City Signatures" then calculate and update
the custom field "Signed License Due Date" with the date of the workflow status + 60 calendar days.

Author: Haitham Eleisah

Functional Area : Records

Notes :
ASI Field Name "Signed Easement Due Date  " Not "Signed License Due Date"
 */
//Script 162
if(matches(wfTask, "Plan Coordination", "Plans Coordination") && wfStatus == "Ready for Signatures"){
    editAppSpecific("Signed Easement Due Date", dateAdd(null, 60), capId);
}

if($iTrc(wfTask == "Completeness Check" && wfStatus == "Ready to Pay", 'wfTask == "Completeness Check" && wfStatus == "Ready to Pay"')){
    pWrksScript293_addFeeEmailReadyToPay();
}

if($iTrc(wfTask == "Signatures" && wfStatus == "Pending Owner Signature", 'wfTask == "Signatures" && wfStatus == "Pending Owner Signature"')){
    if(balanceDue == 0) pWrksScript303_reqOwnerSigEmail();
    pWrksScript305_updateTaskDueDate();
}

if($iTrc(wfTask == "Completeness Check" && wfStatus == "Incomplete", 'wfTask == "Completeness Check" && wfStatus == "Incomplete"')){
    pWrksScript292_sendIncompleteEmail();
}