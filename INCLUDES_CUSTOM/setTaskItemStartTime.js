function setTaskItemStartTime(wfstr, dateStr){
    //Optional parameter capId
    //Optional parameter processName
    var useProcess = false;
    var processName = "";
    if (arguments.length == 4){
        processName = arguments[3]; // subprocess
        useProcess = true;
    }
    
    var itemCap = capId
    if(arguments.length == 3) itemCap == arguments[2];
    
    var workflowResult = aa.workflow.getTaskItems(itemCap, wfstr, processName, null, null, null);
    
    var workflowResult = aa.workflow.getTaskItems(capId, wfstr, processName, null, null, null);
    if (workflowResult.getSuccess())
        var wfObj = workflowResult.getOutput();
    else
        { logMessage("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage()); return false; }
    
    var retVal = new Date(String(dateStr));
    if (retVal.toString().equals("Invalid Date")){
        logDebug("WARNING: Unable to set start date on workflow task " + wfstr + ". " + dateStr + " is invalid.");
        return retVal;
    }
    
    for (i in wfObj) {
        var fTask = wfObj[i];
        if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName))) {
            var stepnumber = fTask.getStepNumber();
            var processID = fTask.getProcessID();
            var completeFlag = fTask.getCompleteFlag();

            fTask.setStatusDate(aa.date.parseDate(dateStr));
            //fTask.setStatusDateString(dateStr);
            fTask.setStartTime(aa.util.parseDate(dateStr));
            /*if (useProcess) {
                aa.workflow.adjustTask(itemCap, stepnumber, processID, "Y", "N", null, null)
            } else {
                aa.workflow.adjustTask(itemCap, stepnumber, "Y", "N", null, null)
            }*/
			var fTaskModel = fTask.getTaskItem();
			var tResult = aa.workflow.adjustTaskWithNoAudit(fTaskModel);
			if (tResult.getSuccess())
				logDebug("Set Workflow Task: " + fTask.getTaskDescription() + " start date " + dateStr);
			else {
				logMessage("**ERROR: Failed to update due date on workflow: " + tResult.getErrorMessage());
				return false;
			}
            //logDebug("Setting start date for task " + wfstr + " to " + dateStr);
        }
    }
}