/**
 * if a document uploaded with type equals documentTypeUploaded, update all tasks that have status wfStatusNamesArray to newTaskStatus and activate
 * @param documentTypeUploaded
 * @param wfStatusNamesArray
 * @param newTaskStatus
 * @returns {Boolean}
 */
function ActivateWorkflowTasksBasedOnDocumentUpload(documentTypeUploaded, wfStatusNamesArray, newTaskStatus) {
	if (typeof documentModelArray !== 'undefined' && documentModelArray == null || documentModelArray.length == 0) {
		return false;
	}
	for (var d = 0; d < documentModelArray.size(); d++) {
		if (documentModelArray.get(d).getDocCategory().equalsIgnoreCase(documentTypeUploaded)) {
			//if docType matched, no need to complete the loop
			return updateTaskStatusAndActivate(wfStatusNamesArray, newTaskStatus);
		}
	}
	return false;
} 