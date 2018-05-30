
/**
 * Activate workflow tasks based on the Status of other Tasks
 * @returns {Boolean}
 */
function activateWorkflowTasks() {

	var reviewTasksAry = [ "Structural Plan Review", "Electrical Plan Review", "Mechanical Plan Review", "Plumbing Plan Review", "Bldg Life Safety Review", "Fire Life Safety Review",
			"Structural Engineering Review" ];

	var activeReviewTasksAry = [ "Real Property Review", "Water Review", "Zoning Review", "Traffic Review", "Forestry Review" ];

	var wfTasks = aa.workflow.getTaskItems(capId, null, null, null, null, null);
	if (!wfTasks.getSuccess()) {
		return false;
	}
	wfTasks = wfTasks.getOutput();

	var allMatched = true;

	for (r in reviewTasksAry) {
		for (w in wfTasks) {
			var task = wfTasks[w];
			if (task.getTaskDescription() != reviewTasksAry[r]) {
				continue;
			}
			allMatched = allMatched && (task.getDisposition() == "Approved" || task.getDisposition() == "Not Required");
			break;
		}//for all cap tasks

		if (!allMatched) {
			break;
		}
	}//for reviewTasksAry

	if (allMatched) {
		activateTask("Quality Check");
	}

	allMatched = true;
	for (r in activeReviewTasksAry) {
		for (w in wfTasks) {
			var task = wfTasks[w];
			if (task.getTaskDescription() != activeReviewTasksAry[r]) {
				continue;
			}
			allMatched = allMatched && (task.getDisposition() == "Approved" || task.getDisposition() == "Not Required");
			break;
		}//for all cap tasks

		if (!allMatched) {
			break;
		}
	}//for reviewTasksAry

	var engineeringReviewMatched = true;
	var wasteWaterReviewMatched = true;
	var qualityCheckMatched = true;

	if (allMatched) {
		//stage 2, check other tasks:
		for (w in wfTasks) {
			var task = wfTasks[w];
			if (task.getTaskDescription() == "Engineering Review") {
				engineeringReviewMatched = engineeringReviewMatched
						&& (task.getDisposition() == "Approved" || task.getDisposition() == "Approved with FEMA Cert Required" || task.getDisposition() == "Not Required");
			}

			if (task.getTaskDescription() == "Waste Water Review") {
				wasteWaterReviewMatched = wasteWaterReviewMatched
						&& (task.getDisposition() == "Approved" || task.getDisposition() == "Approved Inspection Required" || task.getDisposition() == "Not Required");
			}

			if (task.getTaskDescription() == "Quality Check") {
				qualityCheckMatched = qualityCheckMatched && task.getDisposition() == "Approved";
			}
		}//for all cap tasks

		if (engineeringReviewMatched && wasteWaterReviewMatched && qualityCheckMatched) {
			activateTask("Fee Processing");
		}

	}//allMatched

	return true;
}