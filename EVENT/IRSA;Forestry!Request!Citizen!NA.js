logDebug("Script 27 Starting");
include("24_ForestryInspectionResultAutomation");

logDebug("Script 62 Starting");
if (ifTracer(inspType == "Forestry Inspection" && matches(inspResult, "PR1", "PR2", "PR20"), 'inspType == "Forestry Inspection" && matches(inspResult, "PR1", "PR2", "PR20"')) {
	closeTask("Inspection Phase", "Complete", "", "");
	activateTask("Crew Work");
}

// Start Script 27 Create Planting Record
if ("Forestry Inspection".equals(inspType) && matches(inspResult, "Other", "PR1", "PR2", "PR20")) {
	var createPlanting = false;
	var fgs = getGuideSheetObjects(inspId);
	if (fgs) {
		for (var gsitems in fgs) {
			var fgsi = fgs[gsitems]; // guidesheet item
			if ("Removal".equals(fgsi.text) && "Yes".equals(fgsi.status)) {
				createPlanting = true;
				break;
			}
		}
	}
	if (createPlanting) {
		vPlantRecId = createChild("Forestry", "Request", "Planting", "NA");
		copyAddress(capId, vPlantRecId);
		copyParcels(capId, vPlantRecId);
		copyASIInfo(capId, vPlantRecId);
		copyASITables(capId, vPlantRecId);
		copyContacts3_0(capId, vPlantRecId);
		aa.cap.copyCapWorkDesInfo(capId, vPlantRecId);
		editAppName(getAppName(capId), vPlantRecId);
	}
}
// End Script 27 Create Planting Record

if ("Forestry Inspection".equals(inspType) && matches(inspResult, "Complete")) {
	//Script 201
	showDebug = true
	treeCreatePlantingRecordFromInsp(inspId)
	}
