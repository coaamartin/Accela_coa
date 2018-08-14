// Begin script 27 Create Planting Record
if (wfTask == "Inspection Phase" && wfStatus == "Complete" && getAppSpecific("No Replant") != "CHECKED") {
	var vPlantRecId;

	//Check for inspection and guide sheet item
	var inspResultObj = aa.inspection.getInspections(capId);
	var inspList;
	var vInspId;
	var vGuideSheetArray = [];
	var vGuideSheetObj;
	var xx;
	var yy;
	var vInspectionType = "Forestry Inspection";
	var vInspectionResultList = ["Complete", "Other"];
	var vHasInspAndGuideSheetItem = false;
	if (inspResultObj.getSuccess()) {
		var inspList = inspResultObj.getOutput();
		xx = 0;
		for (xx in inspList) {
			if (vInspectionType == inspList[xx].getInspectionType() && exists(inspList[xx].getInspectionStatus(), vInspectionResultList)) {
				logDebug("inspList[xx].getInspectionType(): " + inspList[xx].getInspectionType());
				logDebug("inspList[xx].getInspectionStatus(): " + inspList[xx].getInspectionStatus());
				vInspId = inspList[xx].getIdNumber();
				vGuideSheetArray = getGuideSheetObjects(vInspId);
				yy = 0;
				for (yy in vGuideSheetArray) {
					vGuideSheetObj = vGuideSheetArray[yy];
					if (vGuideSheetObj.gsType == "FORESTRY INSPECTOR" && vGuideSheetObj.text == "Removal" && vGuideSheetObj.status == "Yes") {
						vHasInspAndGuideSheetItem = true;
						break;
					}
				}
			}
		}
	}
	logDebug("vHasInspAndGuideSheetItem: " + vHasInspAndGuideSheetItem);
	// Create child if Forestry Inspector - Removal - Yes (Guidesheet Type - Item - Status)
	if (vHasInspAndGuideSheetItem == true) {
		vPlantRecId = createChild("Forestry", "Request", "Planting", "NA");

		//Copy addresses from child to license
		copyAddress(capId, vPlantRecId);

		//Copy Parcels from license to renewal
		copyParcels(capId, vPlantRecId);

		//Copy ASI from child to license
		copyASIInfo(capId, vPlantRecId);

		//Copy ASIT from child to license
		copyASITables(capId, vPlantRecId);

		//Copy Contacts from child to license
		copyContacts3_0(capId, vPlantRecId);

		//Copy Work Description from child to license
		aa.cap.copyCapWorkDesInfo(capId, vPlantRecId);

		//Copy application name from child to license
		editAppName(getAppName(capId), vPlantRecId);
	}

}
// End script 27 Create Planting Record
