/*
Title : Deactivate Pre Submittal Meeting Task and Email (WorkflowTaskUpdateAfter) 

Purpose : check WF task and status, deactivate a Task, and send email

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
	checkWorkflowDeactivateTaskAndSendEmail("Pre Submittal Meetings", [ "Email Applicant" ], "Pre Submittal Meetings", "test_yaz");
	
Notes:
	- Deep URL variable for email template $$recordDeepUrl$$
	- $$altID$$ is used for record#
*/

checkWorkflowDeactivateTaskAndSendEmail("Pre Submittal Meetings", [ "Email Applicant" ], "Pre Submittal Meetings", "PLN PRE SUBMITTAL MEETING #253");

/*
Title : Planning Application Workflow Updates (WorkflowTaskUpdateAfter)
Purpose : If workflow task = "Generate Hearing Results" and workflow status = "Complete - No Council" or "Complete" then reactivate
any workflow review task that has the workflow status of "Proceed Tech" or "Resubmittal Requested" and send an email to
the applicant with the workflow comments. In addition if the workflow task "Planning Commission Hearing" and workflow
status = "Recommend Denial" then assign the case manager (Comes from the assigned to user in Record Detail tab) to the
workflow task "Add to Council Agenda" or "Appeal/Call Up Period" if either of these tasks are active.

Author: Haitham Eleisah

Functional Area : Records

Notes :
Appeal/Call Up Period task is not exists i think the correct name is Appeal Period
Sample Call:
if (wfTask == "Generate Hearing Results" && checkWFStatus("Complete", [ "Complete - No Council", "Complete Council", "Complete" ])) {
	reactivateTasksAndSendemail("MESSAGE_NOTICE_PUBLIC WORKS", [ "Proceed-Tech", "Resubmittal Requested" ]);
} else if (wfTask == "Planning Commission Hearing" && wfStatus == "Recommend Denial") {
	updateTaskAssignedUserbyCapAssignedUser([ "Add to Council Agenda", "Appeal Period" ]);
}
 */

var generateWorkFlowTask = "Generate Hearing Results";
var generateWorkFlowStatuses = [ "Complete - No Council", "Complete Council", "Complete" ];
var planningWorkFlowTask = "Planning Commission Hearing";
var plangingWorkFlowStatus = "Recommend Denial";
var emailTemplate = "MESSAGE_NOTICE_PUBLIC WORKS";
var reviewTasksStatuses = [ "Proceed-Tech", "Resubmittal Requested" ];
var TasksToBeChecked = [ "Add to Council Agenda", "Appeal Period" ];
if (appTypeArray[2] != "Address") {
	if (wfTask == generateWorkFlowTask && checkWFStatus(wfStatus, generateWorkFlowStatuses)) {
		reactivateTasksAndSendemail(emailTemplate, reviewTasksStatuses);
	} else if (wfTask == planningWorkFlowTask && wfStatus == plangingWorkFlowStatus) {
		updateTaskAssignedUserbyCapAssignedUser(TasksToBeChecked);
	}
}