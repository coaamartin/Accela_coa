function createPPBMPRecord(workFlowTask, workflowStatusArray, asitName) {

    if(vEventName != "WorkflowTaskUpdateAfter"){
		var wfTask = "Permit Issued";
		var wfStatus = "Complete";
	}

	if (wfTask == workFlowTask) {

		var statusMatch = false;

		for (s in workflowStatusArray) {
			if (wfStatus == workflowStatusArray[s]) {
				statusMatch = true;
				break;
			}
		}//for all status options

		if (!statusMatch) {
			return false;
		}

		var recordParentCapId = null;

		//get parent
		var parents = getParents("PublicWorks/Civil Plan/Review/NA");
		if (!parents || parents.length == 0) {
			logDebug("**WARN no parents found for record, capId=" + capId);
			return false;
		}
		var olduseAppSpecificGroupName = useAppSpecificGroupName;
		useAppSpecificGroupName = false;
		recordParentCapId = parents[0];
		var pondTypes = loadASITable(asitName, recordParentCapId);
		if (!pondTypes) {
			//parent has ASIT empty, try grand parent
			var tmpCapId = capId;
			capId = parents[0];//try to find grand parent
			var grandParents = getParents("PublicWorks/Civil Plan/Review/NA");
			capId = tmpCapId;

			if (!grandParents || grandParents.length == 0) {
				logDebug("**WARN no data found in ASIT for parent and no grand parent found, capId=" + capId);
				return false;
			}//no grand parent

			recordParentCapId = grandParents[0];
			pondTypes = loadASITable(asitName, recordParentCapId);
			useAppSpecificGroupName = olduseAppSpecificGroupName;

			if (!pondTypes) {
				logDebug("**WARN no data found in ASIT of parent or grand parent, capId=" + capId);
				return false;
			}//no ASIT on grand parent
		}//no ASIT on parent

		var parentCapScriptModel = aa.cap.getCap(recordParentCapId).getOutput();
		var parentAppName = parentCapScriptModel.getSpecialText();

		for (p in pondTypes) {
			var pondNum = pondTypes[p]["Pond Number"];
			var pondType = pondTypes[p]["Pond Type"];
			var createdAppId = createCap("Water/Water/PPBMP/NA", parentAppName + " " + pondNum);
			if (!createdAppId) {
				logDebug("**WARN failed to create child app Water/Water/PPBMP/NA, pondNum=" + pondNum);
				continue;
			}

			aa.cap.createAppHierarchy(capId, createdAppId);
			editAppSpecific("PPBMP Type", pondType, createdAppId);

			//copy APO
			copyAddresses(recordParentCapId, createdAppId);
			copyParcels(recordParentCapId, createdAppId);
			copyOwner(recordParentCapId, createdAppId);

			linkDocuments(recordParentCapId, createdAppId, [ "Pond Certification", "Inspection & Maintenance Plan" ]);
		}
	} else {
		return false;
	}
	return true;
}
