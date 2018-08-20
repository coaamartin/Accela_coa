
/**
 * 
 * @param inspectionType
 * @param inspectionResultArray
 * @param checkListItemName
 * @param asitFieldName
 * @param schedTypeIfChecked
 * @param schedTypeIfNotChecked
 * @param department 6-levels department to assign inspection to
 * @returns {Boolean}
 */
function stumpGrindInspectionScheduling(inspectionType, inspectionResultArray, checkListItemName, asitFieldName, schedTypeIfChecked, schedTypeIfNotChecked, department) {

	if (inspType == inspectionType) {
		var resultMatched = false;
		for (s in inspectionResultArray) {
			if (inspResult == inspectionResultArray[s]) {
				resultMatched = true;
				break;
			}
		}//for all status options

		if (!resultMatched) {
			return false;
		}

		//get checkListItemName value:
		var guideSheetsAry = getGuideSheetObjects(inspId);
		if (!guideSheetsAry || guideSheetsAry.length == 0) {
			logDebug("**WARN getGuideSheetObjects failed, capId=" + capId);
		} else {
			for (g in guideSheetsAry) {
				if (guideSheetsAry[g].gsType == "FORESTRY INSPECTOR" && guideSheetsAry[g].text == checkListItemName) {
					resultMatched = (String(guideSheetsAry[g].status).toLowerCase() == "yes");
				}
			}
		}

		if (!resultMatched) {
			return false;
		}

		var asiFieldValue = null;
		/*if (useAppSpecificGroupName) {
			var olduseAppSpecificGroupName = useAppSpecificGroupName;
			useAppSpecificGroupName = false;
			asiFieldValue = getAppSpecific(asitFieldName);
			useAppSpecificGroupName = olduseAppSpecificGroupName;
		} else {*/
			asiFieldValue = AInfo[asitFieldName];
		//}
		logDebug("asiFieldValue = " + asiFieldValue);
		logDebug("asitFieldName = " + asitFieldName);
		aa.print(asitFieldName + "=" + asiFieldValue);
		var inspToSched = null;
		if (asiFieldValue && asiFieldValue != null && asiFieldValue == "CHECKED") {
			inspToSched = schedTypeIfChecked;
		} else {
			inspToSched = schedTypeIfNotChecked;
		}

		//Schedule Inspection and assign to department
		var user = aa.people.getSysUserModel();
		user.setServiceProviderCode(aa.getServiceProviderCode());
		var deptLevels = department.split("/");
		user.setAgencyCode(deptLevels[0]);
		user.setBureauCode(deptLevels[1]);
		user.setDivisionCode(deptLevels[2]);
		user.setSectionCode(deptLevels[3]);
		user.setGroupCode(deptLevels[4]);
		user.setOfficeCode(deptLevels[5]);
		user.setFirstName("");
		user.setMiddleName("");
		user.setLastName("");
		user.setUserID("");
		var schedResult = aa.inspection.scheduleInspection(capId, user, aa.date.parseDate(dateAdd(null, 0)), null, inspToSched, "Scheduled via Script");
	} else {
		return false;
	}
	return true;
}