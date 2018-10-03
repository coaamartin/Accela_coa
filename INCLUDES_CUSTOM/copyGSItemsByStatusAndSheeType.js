//copyGSItemsByStatusAndSheeType()
// copy guidesheet items by type and item status
function copyGSItemsByStatusAndSheeType(fromInspId, toInspId, gsType, itemStatus){ //OPTIONAL: fromCap, toCap
    try{
        logDebug("Copying checklist items with status of " + itemStatus + " from checklist " + gsType);
        //use capId by default
        var fromCap = capId;
        var toCap = capId;
        //previous inspection and current inspection
        var pInsp, cInsp;
        
        //optional capId
        if (arguments.length > 4) fromCap = arguments[4];
        if (arguments.length > 5) toCap = arguments[5];
        
        logDebug("Copying from record: " + fromCap.getCustomID() + " to " + toCap.getCustomID()); 
        
        //Get inspections
        var insps = aa.inspection.getInspections(fromCap).getOutput();
        if (!insps || insps.length == 0) { logDebug("No inspections in " + fromCap.getCustomID()); return false;}
        
        for (var i in insps)
            if (insps[i].getIdNumber() == fromInspId)
                pInsp = insps[i].getInspection();
        
        var inspsTo = aa.inspection.getInspections(toCap).getOutput();
        for(var i in inspsTo)
            if (inspsTo[i].getIdNumber() == toInspId)
                cInsp = inspsTo[i].getInspection();
        
        
        //If cannot find inspections then return false
        if (!pInsp || !cInsp) { logDebug("No inspections found."); return false; }
        
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
                    if(gGuideSheetType == gsType){ 
                        for(idxStatus in itemStatus)
                            if(gGuideSheetItemStatus == itemStatus[idxStatus])
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
        if (guideSheetList.size() > 0) {
            
            var copyResult = aa.guidesheet.copyGGuideSheetItems(guideSheetList, toCap, parseInt(toInspId), aa.getAuditID());
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