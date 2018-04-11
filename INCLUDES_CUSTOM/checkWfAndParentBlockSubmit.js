function checkWfAndParentBlockSubmit(workFlowTask, workflowStatusArray, parentType, parentStatus) {
	if (wfTask == workFlowTask) {
		var statusMatch = false;
		for (s in workflowStatusArray) {
			if (wfStatus == workflowStatusArray[s]) {
				statusMatch = true;
				break;
			}
		}//for all status options

		if (!statusMatch) {
			return false;
		}

		//get parent of type parentType
		var parentsAry = getParents(parentType);
		if (parentsAry == null || parentsAry.length == 0) {
			return false;
		}

		//check parent status
		for (p in parentsAry) {
			var tmpCap = aa.cap.getCap(parentsAry[p]).getOutput();
			if (tmpCap.getCapStatus() == parentStatus) {
				cancel = true;
				showMessage = true;
				comment("Master is previous code year, cannot issue permit");
				return true;
			}//parent with matched status found
		}//for all paretns
	}//wfTask matched
	return false;
}