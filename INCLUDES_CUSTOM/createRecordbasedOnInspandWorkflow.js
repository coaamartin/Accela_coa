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
function createRecordbasedOnInspandWorkflow(workFLowTasktoBechecked, workFlowStatustoBeChecked, inspectionType, inspCheckList, customField, customFieldValue, PlantingRecordType) {
	if (wfTask == workFLowTasktoBechecked && wfStatus == workFlowStatustoBeChecked) {
		var inspectionList = aa.inspection.getInspections(capId).getOutput();
		for ( var i in inspectionList) {
			var inspObj = inspectionList[i];
			if (inspObj.getInspectionType().equalsIgnoreCase(inspectionType)) {
				var Insp = inspectionList[i].getIdNumber();
				var objeclist = getGuideSheetObjects(Insp);
				for ( var ob in objeclist) {

					if (objeclist[ob].gsType.equalsIgnoreCase(inspCheckList)) {
						objeclist[ob].loadInfo();
						if (objeclist[ob].info[customField] == customFieldValue) {
							createRecordAndCopyData(PlantingRecordType);

						}
					}
				}
			}

		}

	}
}
