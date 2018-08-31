function editWFTaskDueDatebyName(sName,stdTimeline, workingDays){
		var workflowResult = aa.workflow.getTaskItems(capId, "", "", null, null, null);
		if (workflowResult.getSuccess())
			wfObj = workflowResult.getOutput();
		else {
			logMessage("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage());
			return false;
		}

		var dueDate = "";
		if(workingDays) dueDate = dateAdd(null,stdTimeline, true);
		else dueDate = dateAdd(null,stdTimeline);
		
		for (i in wfObj) {
			var fTask = wfObj[i];
			if ((fTask.getTaskDescription().toUpperCase().indexOf(sName.toUpperCase())> 0)) {
				// the new due date value could be changed according to the returned value from the standard choice, for now assuming the value type "Date"
				wfObj[i].setDueDate(aa.date.parseDate(dueDate));
				var fTaskModel = wfObj[i].getTaskItem();
				var tResult = aa.workflow.adjustTaskWithNoAudit(fTaskModel);
				if (tResult.getSuccess())
					logDebug("Set Workflow Task: " + fTask.getTaskDescription() + " due Date " + aa.date.parseDate(dueDate));
				else {
					logMessage("**ERROR: Failed to update due date on workflow: " + tResult.getErrorMessage());
					return false;
				}
			}
		}
		return true;
}