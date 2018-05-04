/**
 * check if the provided status in the provided array
 * @param workflowStatus status to be checked
 * @param statusesArray array to be checked
 * @returns {Boolean} true if exists else will return false
 */
function checkWFStatus(workflowStatus, statusesArray) {

	for ( var i in statusesArray) {
		if (statusesArray[i] == workflowStatus)
			return true;
	}
	return false;
}
