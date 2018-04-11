function CopyCheckList(inspId) {
	try {
		var sourceGuideSheetsList = getSourceGuideSheetList();
		if (sourceGuideSheetsList.size() > 0)
			var copyResult = copyGuideSheetsFromSourceInspection(sourceGuideSheetsList, inspId);

	} catch (e) {
		logDebug("Error in SchedInsp " + e.message);
		return false;
	}
}