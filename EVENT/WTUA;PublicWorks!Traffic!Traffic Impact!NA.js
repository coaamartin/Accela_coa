/* WTUA for Public Works/Traffic/Traffic Impact/NA */

script271_AssignmentsDueWhenSitePlanIsDue();

/* Title :  Deactivate Workflow task(WorkflowTaskUpdateAfter)

Purpose :   If workflow task status equals resubmittal requested
then deactivate the task that it was selected on.

Author :   Israa Ismail

Functional Area : Records

*/

if (wfStatus=="Resubmittal Requested"){
	deactivateTask(wfTask);
}