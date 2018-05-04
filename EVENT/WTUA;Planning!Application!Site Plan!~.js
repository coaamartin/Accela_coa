/* Title :  Send Notice - PC email (WorkflowTaskUpdateAfter)

Purpose :  If workflow task = "Prepare Signs" AND workflow task "Notice - PC" both have a workflow status of "Complete" then email
the Applicant and cc Developer and cc the Case Manager (email from user is the Assigned Staff in Record detail), include
workflow comments. (need email wording from Aurora). Email also needs a form attached for the Applicant to fill out(Aurora
will determine the report).

Author :   Israa Ismail

Functional Area : Records 

Sample Call : sendNoticePCEmail()

Notes : 
		  1-Report name and parameters are not provided, they are handled below in reportName(sample:"WorkFlowTasksOverdue"),rptParams.put...
		  2-Email Template Name is not provided, sample template Name : "MESSAGE_NOTICE_PLANNING"
		  3-The provided wfTasks is not found alternatively wfTask "Prepare Signs and Notice - PC" is used
		  4-Please apply the script on these record types :"PLANNING/APPLICATION/ Conditional Use/NA","PLANNING/APPLICATION/PRELIMINARY PLAT/NA"
		    "PLANNING/APPLICATION/MASTER PLAN/*","PLANNING/APPLICATION/REZONING/NA","PLANNING/APPLICATION/SITE PLAN/*"
*/
sendNoticePCEmail();

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