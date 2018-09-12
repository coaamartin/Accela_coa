logDebug("Script 27 Starting");
include("24_ForestryInspectionResultAutomation");

logDebug("Script 62 Starting");
if (ifTracer(inspType == "Forestry Inspection" && matches(inspResult, "PR1", "PR2", "PR20"), 'inspType == "Forestry Inspection" && matches(inspResult, "PR1", "PR2", "PR20"')) {
	closeTask("Inspection Phase", "Complete", "", "");
	activateTask("Crew Work");
}

// Start Script 27 Create Planting Record
if ("Forestry Inspection".equals(inspType) && matches(inspResult, "Other", "PR1", "PR2", "PR20")) {
	if (!getAppSpecific("No Replant", capId)) {
		treeCreatePlantingRecordReplantFromInsp(inspId);
	}
}
// End Script 27 Create Planting Record

if ("Forestry Inspection".equals(inspType) && matches(inspResult, "Complete")) {
	//Script 201
	var childArray = getChildren("Forestry/Request/Planting/NA", capId);
    if (!childArray || childArray.length == 0) {
		treeCreatePlantingRecordFromInsp(inspId);
	}
}
logDebug("Script 27 Ending");