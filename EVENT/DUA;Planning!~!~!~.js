// Script 34
//Planning/*/*/* When Record status is Waiting on Documents and the last Workflow status on WF Task Review Consolidation is Resubmital Requested 
//and a document is uploaded in ACA then Activate the Submission Quality Check Task with a start date of Today and due date of 2 working days.

if (capStatus=="Waiting on Documents") // && wfTask == "Review Consolidation" && wfStatus == "Resubmittal Requested" )
 {
    activateTask("Submission Quality Check");
    editTaskDueDate("Submission Quality Check",dateAdd(null, 2));
}
