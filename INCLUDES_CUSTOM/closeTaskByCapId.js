/*
 * Helper
 * 
 * Desc:            
 * Close Task by capId.  
 * 
 */
function closeTaskByCapId(wfstr,wfstat,wfcomment,wfnote, itemCap) // optional process name
    {
    var useProcess = false;
    var processName = "";
    if (arguments.length == 6) 
        {
        processName = arguments[5]; // subprocess
        useProcess = true;
        }

    var workflowResult = aa.workflow.getTaskItems(itemCap, wfstr, processName, null, null, null);
    if (workflowResult.getSuccess())
        var wfObj = workflowResult.getOutput();
    else
        { logMessage("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage()); return false; }
    
    if (!wfstat) wfstat = "NA";
    
    for (i in wfObj)
        {
        var fTask = wfObj[i];
        if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase())  && (!useProcess || fTask.getProcessCode().equals(processName)))
            {
            var dispositionDate = aa.date.getCurrentDate();
            var stepnumber = fTask.getStepNumber();
            var processID = fTask.getProcessID();

            if (useProcess)
                aa.workflow.handleDisposition(itemCap,stepnumber,processID,wfstat,dispositionDate, wfnote,wfcomment,systemUserObj ,"Y");
            else
                aa.workflow.handleDisposition(itemCap,stepnumber,wfstat,dispositionDate, wfnote,wfcomment,systemUserObj ,"Y");
            
            logMessage("Closing Workflow Task : " + wfstr + " with status " + wfstat + " for capId " + itemCap);
            logDebug("Closing Workflow Task: " + wfstr + " with status " + wfstat + " for capId " + itemCap);
            }           
        }
    }