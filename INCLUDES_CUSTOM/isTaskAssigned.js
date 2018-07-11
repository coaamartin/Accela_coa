function isTaskAssigned(wfstr) // optional process name
{
	// Assigns the task to a user.  No audit.
	//
	var useProcess = false;
	var processName = "";
	if (arguments.length == 2) {
		processName = arguments[1]; // subprocess
		useProcess = true;
    }
		
	var workflowResult = aa.workflow.getTaskItems(capId, wfstr, processName, null, null, null);
 	if (workflowResult.getSuccess())
  	 	var wfObj = workflowResult.getOutput();
  	else { logMessage("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage()); return false; }
	
	for (i in wfObj){
   		var fTask = wfObj[i];
 		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase())  && (!useProcess || fTask.getProcessCode().equals(processName))){
			var staffObj = fTask.getAssignedStaff();
			if(staffObj.getFirstName() != undefined && staffObj.getFirstName() != null && staffObj.getFirstName() != "") return true;
		}
	}
	return false;
}