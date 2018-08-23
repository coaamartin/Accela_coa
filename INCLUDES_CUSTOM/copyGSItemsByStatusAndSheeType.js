//copyGSItemsByStatusAndSheeType()
// copy guidesheet items by type and item status
function copyGSItemsByStatusAndSheeType(fromInspId, toInspId, gsType, itemStatus){
    try{
        //use capId by default
        var itemCap = capId;
        //previous inspection and current inspection
        var pInsp, cInsp;
        
        //optional capId
        if (arguments.length > 4) itemCap = arguments[4];
        
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
                    if(gGuideSheetType == gsType && gGuideSheetItemStatus == itemStatus)
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
    catch(err){
        showMessage = true;
        comment("Error on custom function copyGSItemsByStatus(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function copyGSItemsByStatus(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
}//END copyGSItemsByStatus()