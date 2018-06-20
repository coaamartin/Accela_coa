function closeAllTasks(capId, wfComment) {
    var wfstat = "NA";
        task,
        dispositionDate,
        stepnumber;
    var workflowResult = aa.workflow.getTaskItems(capId, 'wfstr', processName, null, null, null);
    
    if (workflowResult.getSuccess())
        var wfObj = workflowResult.getOutput();
    else
    { logMessage("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage()); return false; }

    for (i in wfObj) {
        fTask = wfObj[i];
        dispositionDate = aa.date.getCurrentDate();
        stepnumber = fTask.getStepNumber();

        aa.workflow.handleDisposition(capId, stepnumber, wfstat, dispositionDate, '', wfComment, systemUserObj, "Y");

        logMessage("Closing Workflow Task: " + wfstr + " with status " + wfstat);
        logDebug("Closing Workflow Task: " + wfstr + " with status " + wfstat);
    }

}