/**
 * 
 * @param workFLowTasktoBechecked work flow task to be checked
 * @param workFlowStatustoBeChecked work flow status to be checked 
 * @param inspectionType inspection type to be checked 
 * @param inspCheckList inspection check list
 * @param customField custom field
 * @param customFieldValue custom field value
 * @param PlantingRecordType  4 levels type to be created 
 */
/**
 * this function to create the record type and copy the related data
 * @param PlantingRecordType the 4 levels of the record type that needs to be create
 */

function createRecordAndCopyInfo(appType, workflowTaskName, workflowStatus, tsiName, childRecord) {
for ( var i in appType) {
if (appMatch(appType[i])) {
	for ( var j in workflowStatus) {
		if (wfTask == workflowTaskName && wfStatus == workflowStatus[j]) {
			var attributes = {};
			loadTaskSpecific(attributes);
			if (attributes[tsiName] == "Yes") {
				var trafficRecordStructure = childRecord.split("/");
				var newId = createChild(trafficRecordStructure[0], trafficRecordStructure[1], trafficRecordStructure[2], trafficRecordStructure[3], "");
				copyOwner(capId, newId);

				//Set Application Name.
				var capDetails = aa.cap.getCap(capId).getOutput();
				var appName = capDetails.getSpecialText();
				var newCapModel = aa.cap.getCap(newId).getOutput().getCapModel();
				newCapModel.setSpecialText(appName);
				aa.cap.editCapByPK(newCapModel);

				//Set Description.
				var capView = aa.cap.getCapViewByID(capId).getOutput();
				var capDetailsDesc = capView.getCapWorkDesModel().getDescription();
				var workDescResult = aa.cap.getCapWorkDesByPK(newId);
				if (workDescResult.getSuccess()) {
					var workDesObj = workDescResult.getOutput().getCapWorkDesModel();
					workDesObj.setDescription(capDetailsDesc);
					aa.cap.editCapWorkDes(workDesObj);
				}
			}
		}
	}
}
}
}