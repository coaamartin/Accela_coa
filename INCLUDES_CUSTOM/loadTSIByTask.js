function loadTSIByTask(thisArr, wfTsk){
    // If useTaskSpecificGroupName==true, appends wf process code.wftask. to TSI field label
    // Optional second parameter, cap ID to load from
    //
    
    var itemCap = capId;
    if (arguments.length == 3) itemCap = arguments[2]; // use cap ID specified in args

    var workflowResult = aa.workflow.getTasks(itemCap);
    if (workflowResult.getSuccess())
        var wfObj = workflowResult.getOutput();
    else
        { logMessage("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage()) ; return false; }
 
    for (i in wfObj) {
        var fTask = wfObj[i];
        var stepnumber = fTask.getStepNumber();
        var processID = fTask.getProcessID();
        var TSIResult = aa.taskSpecificInfo.getTaskSpecificInfoByTask(itemCap, processID, stepnumber)
        if (TSIResult.getSuccess()) {
            var TSI = TSIResult.getOutput();
            for (a1 in TSI) {
                if(fTask.getTaskDescription() == wfTsk) thisArr[TSI[a1].getCheckboxDesc()] = TSI[a1].getChecklistComment();
            }
        }
    }
}