function checkAndScheduleInspectionPerTreeId(inspType, guideSheetType, asitFieldName) {

	//get ref on ASIT array object [from event variables]
	var tn = String(asitFieldName).replace(/[^a-zA-Z0-9]+/g, '');
	if (!isNaN(tn.substring(0, 1)))
		tn = "TBL" + tn
	var assignExpr = 'asitValues=' + tn;

	var asitValues = null;
	eval(assignExpr);

	if (asitValues == null || asitValues.length == 0) {
		logDebug("**WARN no rows in ASIT " + asitFieldName);
		return false;
	}

	//load current inspections once
	var inspections = aa.inspection.getInspections(capId).getOutput();

	//collect new inspection/treeId for one-shot update
	var inspectionIdTreeIdMap = new Array();
	var inspectionIdExistingDiameterMap = new Array();

	for (i in asitValues) {
		var treeId = asitValues[i]["Tree ID"].fieldValue;
		var existingDiameter = asitvalues[i]["Existing Diameter"].fieldValue;
		if (!hasInspection(inspections, treeId, inspType)) {
			var capDetails = aa.cap.getCapDetail(capId).getOutput();
			var asgnUserID = capDetails.getAsgnStaff();
			var capView = aa.cap.getCapViewByID(capId).getOutput();
			var capDetailsDesc = capView.getCapWorkDesModel().getDescription();
			var inspectorUser = aa.person.getUser(asgnUserID).getOutput();

			var schedRes = aa.inspection.scheduleInspection(capId, inspectorUser, aa.date.parseDate(nextWorkDay(new Date())), null, inspType, capDetailsDesc);
			if (schedRes.getSuccess()) {
				inspectionId = schedRes.getOutput();
				inspectionIdTreeIdMap[inspectionId] = treeId;
				inspectionIdExistingDiameterMap[inspectionId] = existingDiameter;
				
			} else {
				logDebug("ERROR: scheduling inspection for TreeID (" + treeId + "): " + schedRes.getErrorMessage());
				continue;
			}
		
		}//treeId matched
	}//for all asitValues
	updateInspectionInfo(inspectionIdTreeIdMap, guideSheetType);
	updateInspectionInfo(inspectionIdExistingDiameterMap, guideSheetType);
	
	return true;
}
