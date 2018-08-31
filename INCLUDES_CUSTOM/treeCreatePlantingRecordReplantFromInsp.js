function treeCreatePlantingRecordReplantFromInsp(inspId)
	{
	// Script 27
	var doRePlant = false;
	var fgs = getGuideSheetObjects(inspId);
	if (fgs) {
		for (var gsitems in fgs) {
			var fgsi = fgs[gsitems]; // guidesheet item
			if ("Removal".equals(fgsi.text) && "Yes".equals(fgsi.status)) {
				doRePlant = true;
				break;
			}
		}
	}
	if (doRePlant) {
		//resultWorkflowTask("Tree Request Intake", "Assigned", "", "Updated by Script 201");
		//resultWorkflowTask("Inspection Phase", "Complete", "", "Updated by Script 201");
		//resultWorkflowTask("Crew Work", "Complete", "", "Updated by Script 201");
		//updateAppStatus("Complete","Updated by Script 201");

		var options = {
			parentCapID: capId,
			appName: (inspObj.getInspection().getActivity().vehicleID) ? "Tree ID removed" + (inspObj.getInspection().getActivity().vehicleID) : "",
			createAsTempRecord: false,
			copyParcels: true,
			copyAddresses: true,
			copyOwner: true,
			copyContacts: true
		}
		var plantingRecordId = createChildGeneric("Forestry", "Request", "Planting", "NA", options);
		var parentInspectorId = getLastInspector("Forestry Inspection")
		var tmpId = capId;
		capId = plantingRecordId;
		resultWorkflowTask("Tree Planting Intake", "Add to List", "", "");
		//resultWorkflowTask("Site Review", "Plant", "", "");
		//resultWorkflowTask("Property Owner Response", "Plant Tree", "", "");
		//activateTask("Quality Control");
		
		scheduleInspection("Forestry Site Review", 0,parentInspectorId);
		
		//get GIS objects
		copyParcelGisObjects();
		treeInventoryPopulate(plantingRecordId)
		capId = tmpId;
		aa.cap.copyCapWorkDesInfo(capId, plantingRecordId);
		}
	}