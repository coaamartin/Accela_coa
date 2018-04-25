function setWFStatusAndActivate(sName){
	var workflowResult = aa.workflow.getTaskItems(capId, "", "", null, null, null);
	if (workflowResult.getSuccess())
		wfObj = workflowResult.getOutput();
	   
	else {
		logDebug("**ERROR: Failed to get workflow object: " , s_capResult.getErrorMessage());
		return false;
	}

	for (i in wfObj) {
		var fTask = wfObj[i];
		var wStaus="Resubmittal Requested";
		if ((fTask.getDisposition() != null && fTask.getDisposition().toUpperCase().equals(wStaus.toUpperCase())> 0)) {
			var dispositionDate = aa.date.getCurrentDate();
			var stepnumber = fTask.getStepNumber();
			//activate task
			var tResult =aa.workflow.adjustTask(capId, stepnumber, "Y", "N", null, null);
			if (tResult.getSuccess()){
				logDebug("Activated Workflow Task: " , fTask.getTaskDescription());
			}
			// update task status
			var uResult=aa.workflow.handleDisposition(capId, stepnumber,sName, dispositionDate, "", "Updated by Script", systemUserObj, "U");
			if (uResult.getSuccess()){
				logDebug("Set Workflow Task: " + fTask.getTaskDescription(), " Status to : Resubmittal Received");
			}
			
		}
	}
	return true;
}