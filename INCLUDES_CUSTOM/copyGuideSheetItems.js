function copyGuideSheetItemsByStatus(fromInspId, toInspId)
{
	try 
		{
			//use capId by default
			var itemCap = capId;
			//previous inspection and current inspection
			var pInsp, cInsp;

			//optional capId
			if (arguments.length > 2) itemCap = arguments[2];

			//Get inspections
			var insps = aa.inspection.getInspections(itemCap).getOutput();
			if (!insps || insps.length == 0) return false;

			for (var i in insps)
			{
				if (insps[i].getIdNumber() == fromInspId)
				{
					pInsp = insps[i].getInspection();
				}
				else if (insps[i].getIdNumber() == toInspId)
				{
					cInsp = insps[i].getInspection();
				}
			}

			//If cannot find inspections then return false
			if (!pInsp || !cInsp) return false;

			//Clear the guidesheet items on current inspection before copying
			var gGuideSheetBusiness = aa.proxyInvoker.newInstance("com.accela.aa.inspection.guidesheet.GGuideSheetBusiness").getOutput();
			if (!gGuideSheetBusiness) {
				throw "Could not invoke GGuideSheetBusiness";
			}
			gGuideSheetBusiness.removeGGuideSheetByCap(itemCap, toInspId, aa.getAuditID());

			//if previous inspection has no guidesheet then theres nothing to copy
			if (!pInsp.getGuideSheets() || pInsp.getGuideSheets().size() == 0) return false;

			// Copy prev guidesheets
			var gsArr = pInsp.getGuideSheets().toArray();
			var guideSheetList = aa.util.newArrayList();			
			for (gsIdx in gsArr) {
				var gGuideSheetModel = gsArr[gsIdx];
				var guideSheetItemList = aa.util.newArrayList();
				var gGuideSheetItemModels = gGuideSheetModel.getItems();
				if (gGuideSheetItemModels) {
					for (var j = 0; j < gGuideSheetItemModels.size(); j++) {
						var gGuideSheetItemModel = gGuideSheetItemModels.get(j);
						guideSheetItemList.add(gGuideSheetItemModel);
					}
				}

				if (guideSheetItemList.size() > 0) {
					var gGuideSheet = gGuideSheetModel.clone();
					gGuideSheet.setItems(guideSheetItemList);
					guideSheetList.add(gGuideSheet);
				}
			}
			if (guideSheetList.size() > 0) {
				
				var copyResult = aa.guidesheet.copyGGuideSheetItems(guideSheetList, itemCap, parseInt(toInspId), aa.getAuditID());
				if (copyResult.getSuccess()) {
					logDebug("Successfully copy guideSheet items");
					return true;
				} else {
					logDebug("Failed copy guideSheet items. Error: " + copyResult.getErrorMessage());
					return false;
				}
			}			
		}
	catch (e) 
		{
			showDebug = true;
			showMessage = true;
			logDebug(e);
		}
}