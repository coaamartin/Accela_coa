function closeAllTasks(capId, wfComment) {
    var wfstat = "NA",
        task,
        dispositionDate,
        stepnumber;

        var tasks = aa.workflow.getTaskItems(capId, null, null,"N", null, "Y").getOutput();
    
    for (i in tasks) {
        task = tasks[i];
        dispositionDate = aa.date.getCurrentDate();
        stepnumber = task.getStepNumber();

        aa.workflow.handleDisposition(capId, stepnumber, wfstat, dispositionDate, '', wfComment, systemUserObj, "Y");

        logMessage("Closing Workflow Task: " + wfstr + " with status " + wfstat);
        logDebug("Closing Workflow Task: " + wfstr + " with status " + wfstat);
    }

}