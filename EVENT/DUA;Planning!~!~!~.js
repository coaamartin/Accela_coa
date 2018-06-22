var $iTrc = ifTracer;
// Script 34
//Planning/*/*/* When Record status is Waiting on Documents and the last Workflow status on WF Task Review Consolidation is Resubmital Requested 
//and a document is uploaded in ACA then Activate the Submission Quality Check Task with a start date of Today and due date of 2 working days.

if($iTrc(capStatus == "Waiting on Documents" && isTaskStatus("Review Consolidation", "Resubmittal Requested"), 'Waiting on Documents && wf:Review Consolidation/Resubmittal Requested')){
    var workflowTsk = "Submission Quality Check";
    var todayString = aa.util.formatDate(new Date(), "MM/dd/YYYY");
    var next2ndWorkDay = dateAdd(null, 2, true);
    deactivateTask("Review Consolidation")
    activateTask(workflowTsk);
    setTaskItemStartTime(workflowTsk, todayString);
    editTaskDueDate(workflowTsk, next2ndWorkDay);
}

