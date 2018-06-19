
function getTaskSpecific(wfName, itemName) { // optional: itemCap
	var i = 0;
	var itemCap = capId;
	if (arguments.length == 4)
		itemCap = arguments[3]; // use cap ID specified in args

	//
	// Get the workflows
	//
	var workflowResult = aa.workflow.getTasks(itemCap);
	if (workflowResult.getSuccess())
		var wfObj = workflowResult.getOutput();
	else {
		logDebug("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage());
		return false;
	}

	//
	// Loop through workflow tasks
	//
	for (i in wfObj) {
		var fTask = wfObj[i];
		var stepnumber = fTask.getStepNumber();
		var processID = fTask.getProcessID();
		if (wfName.equals(fTask.getTaskDescription())) { // Found the right Workflow Task
			var TSIResult = aa.taskSpecificInfo.getTaskSpecifiInfoByDesc(itemCap, processID, stepnumber, itemName);
			if (TSIResult.getSuccess()) {
				var TSI = TSIResult.getOutput();
				if (TSI != null) {
					var TSIArray = new Array();
					var TSInfoModel = TSI.getTaskSpecificInfoModel();
					var itemValue = TSInfoModel.getChecklistComment();
					return itemValue;
				} else {
					logDebug("No task specific info field called " + itemName + " found for task " + wfName);
					return false;
				}
			} else {
				logDebug("**ERROR: Failed to get Task Specific Info objects: " + TSIResult.getErrorMessage());
				return false;
			}
		} // found workflow task
	} // each task
	return false;
}