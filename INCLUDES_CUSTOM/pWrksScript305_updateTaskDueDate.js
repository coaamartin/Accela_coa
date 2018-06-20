function pWrksScript305_updateTaskDueDate(){
    logDebug("pWrksScript305_updateTaskDueDate() started");
    try{
        var newDueDate = dateAdd(wfDateMMDDYYYY, 180);
        editTaskDueDate("Signatures", newDueDate);
        editAppSpecific("Signed Easement Due Date", newDueDate);
    }
    catch(err){
        showMessage = true;
        comment("Error on function pWrksScript305_updateTaskDueDate(). Err: " + err + ". Line Number: " + err.lineNumber + ". Stack: " + err.stack);
        logDebug("Error on function pWrksScript305_updateTaskDueDate(). Err: " + err + ". Line Number: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("pWrksScript305_updateTaskDueDate() ended");
}//END pWrksScript305_updateTaskDueDate()