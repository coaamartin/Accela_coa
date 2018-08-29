function getTaskStatusDate(vWfTask, vWfStatus) // optional process name, capId
{
	var itemCap = capId;
	var useProcess = false;
	var processName = "";
	var workflowResult;
	var wfObj;
	var fTask;
	var vStatusDate;
	var vStatusDate_mm;
	var vStatusDate_dd
	var vStatusDate_yyyy;
	var vStatusDateString;
	var vReturn = false;

	if (arguments.length == 3) {
		itemCap = arguments[2]; // use cap ID specified in args
	}

	if (arguments.length > 2 && arguments[2] != null) {
		processName = arguments[2]; // subprocess
		useProcess = true;
	}

	workflowResult = aa.workflow.getWorkflowHistory(itemCap, vWfTask, null);
	if (workflowResult.getSuccess())
		wfObj = workflowResult.getOutput();
	else {
		logDebug("**ERROR: Failed to get workflow object: " + wfObj.getErrorMessage());
		return false;
	}

	for (i in wfObj) {
		fTask = wfObj[i];
		logDebug("1) " + fTask.getTaskDescription());
		logDebug("2) " + fTask.getDisposition());
		if (fTask.getTaskDescription().toUpperCase().equals(vWfTask.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName)) && (fTask.getDisposition().toUpperCase().equals(vWfStatus.toUpperCase()))) {
			if (fTask.getStatusDate() != null) {
				vStatusDate = fTask.getStatusDate();
				vStatusDate_mm = vStatusDate.getMonth() + 1;
				vStatusDate_mm = (vStatusDate_mm < 10) ? '0' + vStatusDate_mm : vStatusDate_mm;
				vStatusDate_dd = vStatusDate.getDate();
				vStatusDate_dd = (vStatusDate_dd < 10) ? '0' + vStatusDate_dd : vStatusDate_dd;
				vStatusDate_yyyy = vStatusDate.getYear() + 1900;
				vStatusDateString = vStatusDate_mm + "/" + vStatusDate_dd + "/" + vStatusDate_yyyy;
				vReturn = true;
			} 
		}
	}
	if (vReturn == true) {
		return vStatusDateString;
	} else {
		return false;
	}
}