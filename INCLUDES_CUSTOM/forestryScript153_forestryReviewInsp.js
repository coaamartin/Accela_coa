function forestryScript153_forestryReviewInsp(){
    logDebug("forestryScript153_forestryReviewInsp() started");
    try{
        if(ifTracer(matches(inspResult, "Plant", "Plant - Letter"), 'res:Plan/Plant - Letter')){
            if(ifTracer(isTaskActive("Tree Planting Intake"), 'isTaskActive("Tree Planting Intake")'))
                resultWorkflowTask("Tree Planting Intake", "Add to List");
            
            if(ifTracer(!isScheduled("Planting"), 'Planting inspection NOT scheduled')){
                var plantInspId = scheduleInspectionCustom("Planting", 35);
                copyGuideSheetItemsByStatus(inspId, plantInspId);
            }
            
            resultWorkflowTask("Site Review", "Plant");
            activateTask("Property Owner Response");
        }
        
        if(ifTracer(inspResult == "No Plant", 'res: No Plant')){
            resultWorkflowTask("Site Review", "No Plant");
            updateAppStatus("Complete", "Updated via EMSE");
            var wfProcess = getWfProcessCodeByCapId(capId);
            logDebug("Record is complete.  Closing all active tasks for process code: " + wfProcess);
            if(wfProcess) deactivateActiveTasks(wfProcess);
        }
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function forestryScript153_forestryReviewInsp(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function forestryScript153_forestryReviewInsp(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("forestryScript153_forestryReviewInsp() ended");
}//END forestryScript153_forestryReviewInsp