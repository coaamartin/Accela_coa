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
 */
function autoCreateTapApplicationRecord(workflowTasktoCheck, workflowStatustoCheck, tsiIsTAPrecordrequired, tsiNumberOfTaprecords, childRecordToCreated, ofResidentialUnitsASI,
		BuildingSqFt, parentofResidentialUnitsASI, parentBuildingSqFt) {
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
				//var utilityServiceRecordStructure = utilityServiceRecord.split("/");
				
				
				var childCapId = createChildGeneric(
					childRecordToCreatedStructure[0], 
					childRecordToCreatedStructure[1], 
					childRecordToCreatedStructure[2],
					childRecordToCreatedStructure[3],
					{
						createAsTempRecord: true,
						accessByACA: true,
						copyParcels: true,
						copyAddresses: true,   
						copyOwner: true,
						copyContacts: true,
						customFields: [
							{ key: ofResidentialUnitsASI, val: AInfo[parentofResidentialUnitsASI] },
							{ key: BuildingSqFt, val: AInfo[parentBuildingSqFt] }
						] 					
					}
				)
				
				removeContactsNonApplicantFromCap(childCapId);
				
				//var appCreateResult = aa.cap.createApp(childRecordToCreatedStructure[0], childRecordToCreatedStructure[1], childRecordToCreatedStructure[2],
				// 		childRecordToCreatedStructure[3], "");

				// if (appCreateResult.getSuccess()) {
				// 	var newId = appCreateResult.getOutput();
				// 	aa.cap.createAppHierarchy(capId, newId);
				// 	copyAddresses(capId, newId);
				// 	copyParcels(capId, newId);
				// 	copyOwner(capId, newId);
				// 	copyContacts(capId, newId);
				// 	editAppSpecific(ofResidentialUnitsASI, AInfo[parentofResidentialUnitsASI], newId);
				// 	editAppSpecific(BuildingSqFt, AInfo[parentBuildingSqFt], newId);
				// 	logDebug("child cap has been created and copy the data : " + newId);
				// } else {
				// 	logDebug("Unable to create planting record ex. : " + appCreateResult.getErrorMessage());
				//}

				//Removed the creation of the Utility Service record per latest specs.
			}
		}
	}
}

//removes all non-applicant contacts. if a primary applicant is set, removes all other applicants
function removeContactsNonApplicantFromCap(itemCapId){
    var cons = aa.people.getCapContactByCapID(itemCapId).getOutput();
	var primaryPresent = null;
    for (x in cons) {
        conSeqNum = cons[x].getPeople().getContactSeqNumber();
	    if (conSeqNum) {	
			if (cons[x].getPeople().getContactType() != "Applicant") {
				aa.people.removeCapContact(itemCapId, conSeqNum);
			} else if (cons[x].getPeopleModel().getFlag() == "Y") {
				primaryPresent = true;
			} else {
				primaryPresent = false;
			}
	    }
    }
	
	if (primaryPresent = true) {
		for (y in cons) {
			conSeqNum = cons[y].getPeople().getContactSeqNumber();
			if (conSeqNum) {
				if (cons[y].getPeopleModel().getFlag() != "Y") {
					aa.people.removeCapContact(itemCapId, conSeqNum);
				}
			} else {
				logDebug("There are no remaining contacts on this record");
			}
		}
	}
	logDebug("Removed Non-Applicant Contacts from TMP record");
}