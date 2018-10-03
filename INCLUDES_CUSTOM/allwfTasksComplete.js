function allwfTasksComplete(capId) {
	var ignoreArray = new Array();
	
	for (var i=1; i<arguments.length;i++)  {
		ignoreArray.push(arguments[i])
	}

	// returns true if any of the subtasks are active
	var taskResult = aa.workflow.getTasks(capId);
	
	if (taskResult.getSuccess()) { 
		taskArr = taskResult.getOutput(); 
	} else { 
		logDebug( "**ERROR: getting tasks : " + taskResult.getErrorMessage()); 
		return false 
	}
		
	for (xx in taskArr) {
		if (taskArr[xx].getActiveFlag().equals("Y") && !exists(taskArr[xx].getTaskDescription(),ignoreArray)) {
			return false;
		}
		return true;
	}
}