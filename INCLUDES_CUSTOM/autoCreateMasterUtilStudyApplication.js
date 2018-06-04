/**
 * check wfTask/status an TSI if matched, creates a child record
 * @param wfTaskName task name to check match
 * @param workflowStatusArray array of statuses to check match
 * @param tsiFieldName name of TSI field
 * @param tsiTaskname name of task TSI exists on
 * @param appTypeStr child app to create
 * @returns {Boolean}
 */
function autoCreateMasterUtilStudyApplication(wfTaskName, workflowStatusArray, tsiFieldName, tsiTaskname, appTypeStr) {

	if (wfTask == wfTaskName) {

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

		var olduseTaskSpecificGroupName = useTaskSpecificGroupName;
		useTaskSpecificGroupName = true;
		var tsiValuesArray = new Array();
		loadTaskSpecific(tsiValuesArray);
		useTaskSpecificGroupName = olduseTaskSpecificGroupName;

		var tsiFieldValue = null;
		for (t in tsiValuesArray) {
			if (String(t).indexOf(tsiTaskname + "." + tsiFieldName) != -1) {
				tsiFieldValue = tsiValuesArray[t];
				break;
			}
		}//for all TSIs

		if (tsiFieldValue == null || !tsiFieldValue.equalsIgnoreCase("yes")) {
			return false;
		}

		var cTypeArray = appTypeStr.split("/");
		var createChildResult = aa.cap.createApp(cTypeArray[0], cTypeArray[1], cTypeArray[2], cTypeArray[3], "");

		if (createChildResult.getSuccess()) {
			createChildResult = createChildResult.getOutput();
			//createAppHierarchy and copy data
			var appHierarchy = aa.cap.createAppHierarchy(capId, createChildResult);
			copyRecordDetailsLocal(capId, createChildResult);
			copyAddresses(capId, createChildResult);
			copyParcels(capId, createChildResult);
			copyOwner(capId, createChildResult);
		} else {
			aa.print("**ERROR create record failed, error:" + createChildResult.getErrorMessage());
			return false;
		}
	} else {
		return false;
	}
	return true;
}
