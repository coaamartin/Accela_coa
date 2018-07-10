function checkDocumentsActivateTask(workFlowTask, workflowStatusArray, activateAndTsiTaskName, recordStatus) {
	logDebug("DONB x1")
	if (cap.getCapStatus() != recordStatus) {
		return false;
	}
	logDebug("DONB x2")
	var matched = false;
	for (s in workflowStatusArray) {
		if (isTaskStatus(workFlowTask, workflowStatusArray[s])) {
			matched = true;
			break;
		}
	}//for all statuses

	if (!matched) {
		return false;
	}
	logDebug("DONB x3")	
	var olduseTaskSpecificGroupName = useTaskSpecificGroupName;
	useTaskSpecificGroupName = true;
	var tsiValues = new Array();
	loadTaskSpecific(tsiValues);
	useTaskSpecificGroupName = olduseTaskSpecificGroupName;

	var totalUploaded = 0, totalChecked = 0;

	if (!tsiValues) {
		logDebug("**WARN no TSI found workflow, capId=" + capId);
		return false;
	}

	for (t in tsiValues) {
		if (t.indexOf(activateAndTsiTaskName) != -1 && tsiValues[t] == "CHECKED") {
			var uploaded = checkDocumentUploaded(t);
			++totalChecked;
			logDebug("DONB1 totalChecked" + totalChecked)
			if (uploaded) {
				++totalUploaded;
				logDebug("DONB2 totalUploaded" + totalUploaded)
			}
		}//checked TSI for required task
	}//for all TSIs

	if (totalChecked == totalUploaded) {
		var task = aa.workflow.getTask(capId, activateAndTsiTaskName);
		if (task.getSuccess()) {
			task = task.getOutput();
		}
		task.setActiveFlag("Y");
		task.setStatusDate(aa.date.getScriptDateTime(new Date()));
		task.setDueDate(aa.date.getScriptDateTime(convertDate(dateAdd(new Date(), 1))));
		var edited = aa.workflow.editTask(task);
		if (!edited.getSuccess()) {
			logDebug("**WARN Task Update Failed, Err:" + edited.getErrorMessage());
		}
	}
	return true;
}
