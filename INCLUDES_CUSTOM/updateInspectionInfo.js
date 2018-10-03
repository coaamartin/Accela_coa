function updateInspectionInfo(inspectionIdTreeIdMap, inspectionIdExistingDiameterMap, guideSheetType) {
	//can't get specific inspection by ID, guideSheets will be null
	var inspections = aa.inspection.getInspections(capId).getOutput();
	for (x in inspectionIdTreeIdMap) {
		var treeId = inspectionIdTreeIdMap[x];
		for (i in inspections) {
			if (inspections[i].getIdNumber() == x) {
				var inspc = inspections[i].getInspection();

				//update guideSheet ID:
				var guideSheets = inspc.getGuideSheets();
				for (g = 0; g < guideSheets.size(); g++) {
					if (guideSheets.get(g).getDispGuideType() == guideSheetType) {
						var guideSheet = guideSheets.get(g);
						guideSheet.setIdentifier(treeId);
						var updated = aa.guidesheet.updateGGuidesheet(guideSheet, aa.getAuditID());
						if (!updated.getSuccess()) {
							logDebug("**WARN updateGGuidesheet failed, inspecId:" + x + " Err:" + updated.getErrorMessage());
						}
						break;
					}//guidesheetType matched
				}//for all guideSheets

				//update unitNbr:
				var act = inspc.getActivity();
				act.setUnitNBR(treeId);
				updated = aa.inspection.editInspection(inspections[i]);
				if (!updated.getSuccess()) {
					logDebug("**WARN editInspection failed, inspecId:" + x + " Err:" + updated.getErrorMessage());
				}
			}//inspId matched
		}//for all inspections
	}//for inspectionIdTreeIdMap
	
	for (x in inspectionIdExistingDiameterMap) {
		var existingDiameter = inspectionIdExistingDiameterMap[x];
		for (i in inspections) {
			if (inspections[i].getIdNumber() == x) {
				var inspc = inspections[i].getInspection();

				//update guideSheet ID:
				var guideSheets = inspc.getGuideSheets();
				for (g = 0; g < guideSheets.size(); g++) {
					if (guideSheets.get(g).getDispGuideType() == guideSheetType) {
						var guideSheet = guideSheets.get(g);
						guideSheet.setIdentifier(treeId);
						var updated = aa.guidesheet.updateGGuidesheet(guideSheet, aa.getAuditID());
						if (!updated.getSuccess()) {
							logDebug("**WARN updateGGuidesheet failed, inspecId:" + x + " Err:" + updated.getErrorMessage());
						}
						break;
					}//guidesheetType matched
				}//for all guideSheets

				//update Existing Diameter (renamed Vehicle ID):
				var act = inspc.getActivity();
				act.setVehicleID(existingDiameter);
				updated = aa.inspection.editInspection(inspections[i]);
				if (!updated.getSuccess()) {
					logDebug("**WARN editInspection failed, inspecId:" + x + " Err:" + updated.getErrorMessage());
				}
			}//inspId matched
		}//for all inspections
	}//for inspectionIdExistingDiameterMap
		
	return false;
}