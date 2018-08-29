
function copyCheckListByItemStatus(fromInspId, toInspId, itemStatus){ //OPTIONAL: fromCap, toCap
    try{
		logDebug("Copying checklist(s) items with status of " + itemStatus);
        //use capId by default
        var fromCap = capId;
		var toCap = capId;
        //previous inspection and current inspection
        var pInsp, cInsp;
        
        //optional capId
        if (arguments.length > 3) fromCap = arguments[3];
		if (arguments.length > 4) toCap = arguments[4];
        
		logDebug("Copying from record: " + fromCap.getCustomID() + " to " + toCap.getCustomID()); 
		
        //Get inspections
        var insps = aa.inspection.getInspections(fromCap).getOutput();
        if (!insps || insps.length == 0) return false;
        
        for (var i in insps)
            if (insps[i].getIdNumber() == fromInspId)
                pInsp = insps[i].getInspection();
		
        var inspsTo = aa.inspection.getInspections(toCap).getOutput();
		for(var i in inspsTo)
			if (inspsTo[i].getIdNumber() == toInspId)
                cInsp = inspsTo[i].getInspection();
		
        
        //If cannot find inspections then return false
        if (!pInsp || !cInsp) return false;
        
        for (var i in insps)
        {
            if (insps[i].getIdNumber() == fromInspId)
            {
                pInsp = insps[i].getInspection();
            }
        }
		
        var gsArr = pInsp.getGuideSheets().toArray();
        var guideSheetList = aa.util.newArrayList();
        
        for (gsIdx in gsArr) {
            var gGuideSheetModel = gsArr[gsIdx];
            var guideSheetItemList = aa.util.newArrayList();
            var gGuideSheetItemModels = gGuideSheetModel.getItems();
            if (gGuideSheetItemModels) {
                for (var j = 0; j < gGuideSheetItemModels.size(); j++) {
                    var gGuideSheetItemModel = gGuideSheetItemModels.get(j);
                    var gGuideSheetType = gGuideSheetItemModel.getGuideType();
                    var gGuideSheetItemStatus = gGuideSheetItemModel.getGuideItemStatus(); 
					for(idxStatus in itemStatus)
					    if(gGuideSheetItemStatus == itemStatus[idxStatus])
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
                
                var copyResult = aa.guidesheet.copyGGuideSheetItems(guideSheetList, toCap, parseInt(toInspId), aa.getAuditID());
                if (copyResult.getSuccess()) {
                    logDebug("Successfully copy guideSheet items");
                } else {
                    logDebug("Failed copy guideSheet items. Error: " + copyResult.getErrorMessage());
                }
            }
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function copyGSItemsByStatus(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function copyGSItemsByStatus(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
}//END copyGSItemsByStatus()