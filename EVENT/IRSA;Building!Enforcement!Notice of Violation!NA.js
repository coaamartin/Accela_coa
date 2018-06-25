var $iTrc = ifTracer;

if(inspType == "Notice of Violation Inspection"){
    //Script 332
    //processNotOfViolInsp(inspectionType to check for, Inspection result to check for, createNewInspection, updateworflow, task2update, status2updateto);
    processNotOfViolInsp("Notice of Violation Inspection", "First Notice", true, "Notice of Violation Inspection", true, "Notice of Violation", "First Notice");
    processNotOfViolInsp("Notice of Violation Inspection", "Second Notice", true, "Notice of Violation Inspection", true, "Notice of Violation", "Second Notice");
    processNotOfViolInsp("Notice of Violation Inspection", "Third Notice", true, "Notice of Violation Inspection", true, "Notice of Violation", "Third Notice");
    processNotOfViolInsp("Notice of Violation Inspection", "Issue Summons", false, null, true, "Notice of Violation", "Issue Summons");
    
    if(inspResult == "Issue Summons") createPreCourtInvestigationInsp();
    if(inspResult == "Compliance"){
        var wfTsk2Update = "Notice of Violation", wfSt2Update = "Compliance";
        if(isTaskActive(wfTsk2Update))
            updateTask(wfTsk2Update, wfSt2Update);
        else{
            activateTask(wfTsk2Update);
            updateTask(wfTsk2Update, wfSt2Update);
        }
        updateAppStatus("Closed", "Updated via IRSA");
        var wfProcess = getWfProcessCodeByCapId(capId);
        logDebug("Record is Closed.  Closing all active tasks for process code: " + wfProcess);
        if(wfProcess) deactivateActiveTasks(wfProcess);
    }
    //Script 332 end
}
