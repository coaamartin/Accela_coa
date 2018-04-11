
/**
 * Check if Balance=0, record has certain status, record type matches certain type, then update wfTask and App Status
 * 
 * @param recordTypesArray {Array} record types to check if matches (4 levels)
 * @param recordStatusToCheck Cap Status to match with
 * @param wfTaskUpdate wfTask to update then deactivate
 * @param wfStatusUpdate wfStatus to use in wfTask update
 * @param newAppStatus new cap status
 * @returns {Boolean}
 */
function checkBalanceAndStatusUpdateRecord(recordTypesArray, recordStatusToCheck, wfTaskUpdate, wfStatusUpdate, newAppStatus) {
	for (r in recordTypesArray) {
		if (appMatch(recordTypesArray[r]) && balanceDue == 0) {
			if (recordStatusToCheck != null && recordStatusToCheck == cap.getCapStatus()) {
				if (wfTaskUpdate != null && wfStatusUpdate != null) {
					updateTask(wfTaskUpdate, wfStatusUpdate, "by script", "by script");
					deactivateTask(wfTaskUpdate);
				}
				if (newAppStatus != null) {
					updateAppStatus(newAppStatus, "by script");
				}
				return true;
			}//capStatus
		}//type and balance
	}//for all record types
	return false;
}