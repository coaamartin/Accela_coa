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

function getPendingInspections(ret) {
	// returns associative array 
	var inspResultObj = aa.inspection.getInspections(capId);
	if (inspResultObj.getSuccess()) {
		inspList = inspResultObj.getOutput();
		ret["Electrical Final"] = 0;
		ret["Electrical Rough"] = 0;
		ret["Mechanical Final"] = 0;
		ret["Mechanical Rough"] = 0;
		ret["Plumbing Final"] = 0;
		ret["Plumbing Rough"] = 0;
		ret["Framing Final"] = 0;
		ret["Framing Rough"] = 0;

		for (xx in inspList) {
			if (inspList[xx].getInspectionStatus().toUpperCase().equals("PENDING")) {
				if (ret["Electrical Final"] == 0 && String(inspList[xx].getInspectionType()).equalsIgnoreCase("Electrical Final"))
					ret["Electrical Final"] = 1
				if (ret["Electrical Rough"] == 0 && String(inspList[xx].getInspectionType()).equalsIgnoreCase("Electrical Rough"))
					ret["Electrical Rough"] = 1

				if (ret["Mechanical Final"] == 0 && String(inspList[xx].getInspectionType()).equalsIgnoreCase("Mechanical Final"))
					ret["Mechanical Final"] = 1
				if (ret["Mechanical Rough"] == 0 && String(inspList[xx].getInspectionType()).equalsIgnoreCase("Mechanical Rough"))
					ret["Mechanical Rough"] = 1

				if (ret["Plumbing Final"] == 0 && String(inspList[xx].getInspectionType()).equalsIgnoreCase("Plumbing Final"))
					ret["Plumbing Final"] = 1
				if (ret["Plumbing Rough"] == 0 && String(inspList[xx].getInspectionType()).equalsIgnoreCase("Plumbing Rough"))
					ret["Plumbing Rough"] = 1

				if (ret["Structural Final"] == 0 && String(inspList[xx].getInspectionType()).equalsIgnoreCase("Framing Final"))
					ret["Framing Final"] = 1
				if (ret["Structural Rough"] == 0 && String(inspList[xx].getInspectionType()).equalsIgnoreCase("Framing Rough"))
					ret["Framing Rough"] = 1
			}
		}

	}
}