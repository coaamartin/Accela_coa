function getSourceGuideSheetList() {
	var guideSheetList = aa.util.newArrayList();
	var itemsResult = aa.inspection.getInspections(capId);
	if (itemsResult.getSuccess()) {
		var inspectionScriptModels = itemsResult.getOutput();
		for ( var k in inspectionScriptModels) {
			if (inspectionScriptModels[k].getIdNumber() == inspId) {
				var inspectionModel = inspectionScriptModels[k].getInspection();
				var gGuideSheetModels = inspectionModel.getGuideSheets();
				if (gGuideSheetModels) {
					for (var i = 0; i < gGuideSheetModels.size(); i++) {
						var guideSheetItemList = aa.util.newArrayList();
						var gGuideSheetModel = gGuideSheetModels.get(i);
						var guideSheetNumber = gGuideSheetModel.getGuidesheetSeqNbr();

						var gGuideSheetItemModels = gGuideSheetModel.getItems();
						if (gGuideSheetItemModels) {
							for (var j = 0; j < gGuideSheetItemModels.size(); j++) {
								var gGuideSheetItemModel = gGuideSheetItemModels.get(j);
								if ((gGuideSheetItemModels.get(j).getGuideItemStatus() == "Yes") && (gGuideSheetItemModels.get(j).getGuideItemText() != "Inspect")) {
									guideSheetItemList.add(gGuideSheetItemModel);
								}
							}
						}

						if (guideSheetItemList.size() > 0) {
							var gGuideSheet = gGuideSheetModel.clone();
							gGuideSheet.setItems(guideSheetItemList);
							guideSheetList.add(gGuideSheet);
						}
					}
				} else {
					logDebug("There is no guideSheets from this inspection: " + inspId);
				}
			}
		}
	}
	return guideSheetList;
}
