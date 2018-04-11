function copyGuideSheetsFromSourceInspection(sourceGuideSheetList, targetInspectionId) {
	var copyResult = aa.guidesheet.copyGGuideSheetItems(sourceGuideSheetList, capId, parseFloat(targetInspectionId), aa.getAuditID());

	if (copyResult.getSuccess()) {
		logDebug("Successfully copy guideSheet items to cap : " + capId);
	} else {
		logDebug("Failed copy guideSheet items to cap: " + copyResult.getErrorMessage());
	}

}