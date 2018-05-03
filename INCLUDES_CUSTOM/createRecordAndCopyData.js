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
function createRecordAndCopyData(PlantingRecordType) {
	var plantingRecordStructure = PlantingRecordType.split("/");
	var appCreateResult = aa.cap.createApp(plantingRecordStructure[0], plantingRecordStructure[1], plantingRecordStructure[2], plantingRecordStructure[3], "");

	if (appCreateResult.getSuccess()) {
		var newId = appCreateResult.getOutput();
		copyAddresses(capId, newId);
		copyParcels(capId, newId);
		copyOwner(capId, newId);
		copyContacts(capId, newId);
	} else {
		logDebug("Unable to create planting record ex. : " + appCreateResult.getErrorMessage());
	}
}
