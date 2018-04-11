function checkInspResultsAndUpdateWF(inpectionType, inspResultArr, updateTaskName, updateStatusName, activateTaskName) {
	if (inspType == inpectionType) {
		var statusMatch = false;
		for (s in inspResultArr) {
			var inspectionResult = inspResultArr[s];
			if (inspResult == inspectionResult) {
				statusMatch = true;
				break;
			}
		}
		if (statusMatch) {
			closeTask(updateTaskName, updateStatusName, "", ""); 
			activateTask(activateTaskName);
		}
	}
}