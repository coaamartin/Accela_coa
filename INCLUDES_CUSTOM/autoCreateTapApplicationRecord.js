/**
 * this function will create child record based on TSIs field values.
 * @param workflowTasktoCheck work flow task to check
 * @param workflowStatustoCheck work flow status to check
 * @param tsiIsTAPrecordrequired TSI field to check
 * @param tsiNumberOfTaprecords TSI field to check
 * @param childRecordToCreated child record to create
 * @param ofResidentialUnitsASI  ASI to be updated
 * @param BuildingSqFt ASI to be updated
 * @param parentofResidentialUnitsASI 
 * @param parentBuildingSqFt
 * @param utilityServiceRecord
 */
function autoCreateTapApplicationRecord(workflowTasktoCheck, workflowStatustoCheck, tsiIsTAPrecordrequired, tsiNumberOfTaprecords, childRecordToCreated, ofResidentialUnitsASI,
		BuildingSqFt, parentofResidentialUnitsASI, parentBuildingSqFt, utilityServiceRecord) {
	if (wfTask == workflowTasktoCheck && wfStatus == workflowStatustoCheck) {
		var TAPRecordsRequiredflag = false;
		var tsiNumberOfTaprecordsNumber = 0
		var TSIArray = new Array();
		loadTaskSpecific(TSIArray);
		for (tsi in TSIArray) {
			if (tsi == tsiIsTAPrecordrequired && TSIArray[tsi] == "Yes") {
				TAPRecordsRequiredflag = true;
			}

			if (tsi == tsiNumberOfTaprecords && Number(TSIArray[tsi]) > 0) {
				tsiNumberOfTaprecordsNumber = Number(TSIArray[tsi]);
			}
		}

		if (TAPRecordsRequiredflag && tsiNumberOfTaprecordsNumber > 0) {
			for (var i = 0; i < tsiNumberOfTaprecordsNumber; i++) {
				var childRecordToCreatedStructure = childRecordToCreated.split("/");
				var utilityServiceRecordStructure = utilityServiceRecord.split("/");
				var appCreateResult = aa.cap.createApp(childRecordToCreatedStructure[0], childRecordToCreatedStructure[1], childRecordToCreatedStructure[2],
						childRecordToCreatedStructure[3], "");

				if (appCreateResult.getSuccess()) {
					var newId = appCreateResult.getOutput();
					aa.cap.createAppHierarchy(capId, newId);
					copyAddresses(capId, newId);
					copyParcels(capId, newId);
					copyOwner(capId, newId);
					copyContacts(capId, newId);
					editAppSpecific(ofResidentialUnitsASI, AInfo[parentofResidentialUnitsASI], newId);
					editAppSpecific(BuildingSqFt, AInfo[parentBuildingSqFt], newId);
					logDebug("child cap has been created and copy the data : " + newId);
				} else {
					logDebug("Unable to create planting record ex. : " + appCreateResult.getErrorMessage());
				}

				var appServiceResult = aa.cap.createApp(utilityServiceRecordStructure[0], utilityServiceRecordStructure[1], utilityServiceRecordStructure[2],
						utilityServiceRecordStructure[3], "");
				if (appServiceResult.getSuccess()) {
					var newServiceId = appServiceResult.getOutput();
					aa.cap.createAppHierarchy(capId, newServiceId);
					logDebug("service child cap has been created  : " + newId);
				} else {
					logDebug("Unable to create planting record ex. : " + appServiceResult.getErrorMessage());
				}
			}
		}
	}
}
