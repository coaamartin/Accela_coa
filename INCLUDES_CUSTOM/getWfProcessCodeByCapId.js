function getWfProcessCodeByCapId(itemCap){
var workflowResult = aa.workflow.getTaskItemByCapID(itemCap,null);
	if (workflowResult.getSuccess())
		var wfObj = workflowResult.getOutput();
	else {
		logMessage("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage());
		//return false;
	}

	for (i in wfObj) {
		var fTask = wfObj[i];
		var process = fTask.getProcessCode()
		if(process != null && process != "" && process != undefined) return process;
	}
	
	return false;
}