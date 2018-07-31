//Do not remove this variable.
var $iTrc = ifTracer;
/*
Title : Set Completeness Check #2 to Resubmittal Requested (WorkflowTaskUpdateAfter)
Purpose : if the last of the following parallel workflow tasks is statused: (Engineering Review, Water Dept Review, Life Safety
Review, Traffic Review, Parks Review) check all these workflow tasks and IF any of the statuses are NOT = Complete then
update the workflow task "Completeness Check #2" with a status of "Resubmittal Requested" and send an email
notification to the applicant requesting revision and resubmittal of documents(
(need the email specifics).

Author: Haitham Eleisah

Functional Area : Records

Sample Call:
checkWorkFlowTaskAndSendEmail("Review Distribution","Route for Review",["Engineering Review", "Water Dept Review"], "Completeness Check #2", "Resubmittal Requested", "Complete", "MESSAGE_NOTICE_PUBLIC WORKS");
 */

 logDebug('Script 296 Starting.');
var workFlowParentTask = "Review Distribution";
var workFlowParentStatus = "Route for Review";
var workflowTasks = [ "Engineering Review", "Water Dept Review", "Life Safety Review", "Traffic Review", "Parks Review" ];
var taskToUpdated = "Completeness Check #2";
var Status = "Resubmittal Requested";
var statusToCheck = "Complete";

if(ifTracer(workflowTasks.indexOf(wfTask) > -1, 'workflowTasks.indexOf(wfTask) > -1' )) {
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

Sample Call:
UpdateASIFieldBasedOnworkFlowTask("Signatures", "Received City Signatures", "Signed Easement Due Date", 60)
 */

var workflowTaskName = "Signatures";
var workflowStatus = "Received City Signatures";
var ASIFieldName = "Signed Easement Due Date";
var daysOut = 60;
UpdateASIFieldBasedOnworkFlowTask(workflowTaskName, workflowStatus, ASIFieldName, daysOut);

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