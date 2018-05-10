function createAutoInspection(tasksToCheck) {
	var taskResult = aa.workflow.getTaskItems(capId, null, null, "Y", null, null);
	if (taskResult.getSuccess()) {
		var taskArr = taskResult.getOutput();
	} else {
		logDebug("**ERROR: getting tasks : " + taskResult.getErrorMessage());
		return false;
	}

	var inspArray = [];
	getPendingInspections(inspArray);

	var taskNameInspectionTypeMap = new Array();
	taskNameInspectionTypeMap["Mechanical Plan Review"] = "Mechanical Final,Mechanical Rough";
	taskNameInspectionTypeMap["Electrical Plan Review"] = "Electrical Final,Electrical Final";
	taskNameInspectionTypeMap["Plumbing Plan Review"] = "Plumbing Final,Plumbing Rough";
	taskNameInspectionTypeMap["Structural Plan Review"] = "Framing Final,Framing Rough";

	for (xx in taskArr) {
		if (taskArr[xx].getCompleteFlag().equals("Y") && String(taskArr[xx].getDisposition()).equalsIgnoreCase("Approved")) {
			//if taskArr[x] is required to be checked 
			for (t in tasksToCheck) {
				if (String(taskArr[xx].getTaskDescription()).equalsIgnoreCase(tasksToCheck[t])) {
					//get the inspection types to check exist (Pending)
					var inspectionsToCheck = taskNameInspectionTypeMap[tasksToCheck[t]];
					inspectionsToCheck = inspectionsToCheck.split(",");

					//check both types if has pending and add one if not
					if (inspArray[inspectionsToCheck[0]] == 0) {
						scheduleInspection(inspectionsToCheck[0], 0);
					}
					if (inspArray[inspectionsToCheck[1]] == 0) {
						scheduleInspection(inspectionsToCheck[1], 0);
					}
					break;
				}//task is one of required
			}//for all tasks to check
		}//Approved task
	}//for all tasks on cap
}
