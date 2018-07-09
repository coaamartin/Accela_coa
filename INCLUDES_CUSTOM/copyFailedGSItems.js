//copy failed guidesheet (checklist) items from one inspection to another in the same record 
function copyFailedGSItems(sInspId, tInspId){
	var currInspGSObj = aa.guidesheet.getFailGGuideSheetItemsByCapIDAndInspID(capId, sInspId, false);
	
    if(!currInspGSObj.getSuccess()) { logDebug("WARNING: Unable to load failed guidesheet items."); }
    var currInspGS = currInspGSObj.getOutput();
    
    var copyResult = aa.inspection.saveCarryOverItems(currInspGS, capId, tInspId);
    
    if (copyResult.getSuccess()) {
    	logDebug("Successfully copied failed guideSheet items to new inspection ID : " + tInspId);
    } else {
    	logDebug("Failed copied failed guideSheet items to cap: " + copyResult.getErrorMessage());
    }
}