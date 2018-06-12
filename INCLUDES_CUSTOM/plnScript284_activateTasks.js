//Script 284 Activate tasks with statuses of 
// "Proceed Tech" or "Resubmittal Requested"
function plnScript284_activateTasks() {
    logDebug("plnScript284_activateTasks() started");
    try{
        var reviewTasksStatuses = ["Proceed-Tech", "Resubmittal Requested"];
        var workflowTasks = aa.workflow.getTasks(capId).getOutput();
        for (i in workflowTasks) {
            var wfTask = workflowTasks[i];
            if (wfTask.getTaskDescription().indexOf("Review") != -1 && checkWFStatus(wfTask.getDisposition(), reviewTasksStatuses)) {
                if (!isTaskActive(wfTask.getTaskDescription())) {
                    activateTask(wfTask.getTaskDescription());
                }
            }
        }
    }
    catch(err){
        showMessage=true;
        comment("Error on custom function plnScript284_activateTasks(). Error: " + err + ". Line Number: " + err.lineNumber);
    }
    logDebug("plnScript284_activateTasks() ended");
}//END plnScript284_activateTasks()
