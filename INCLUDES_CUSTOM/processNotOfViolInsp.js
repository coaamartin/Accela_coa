/* Process Notice of Violation script
 * Params:
 * @iType (String) - Inspection Type to check for
 * @iResult (String) - Inspection Result to check for
 * @createNewInsp (boolean) - Create new Notice of Violation inspection
 * @updateWf (boolean) - Update a workflow task with a status
 * @wfTsk2Update (String) - workflow task to update
 * @wfSt2Update (String) - workflow task status to update the task to
 */
function processNotOfViolInsp(iType, iResult, createNewInsp, updateWf, wfTsk2Update, wfSt2Update){
    logDebug("noticeOfViolationInspection() started");
    try{
        var $iTrc = ifTracer;
        var newInspReqComments = getInspReqCommsByInspID(inspId) + " " + inspComment;
        var inspector = getInspectorByInspID(inspId);
        if($iTrc(inspType == iType && inspResult == iResult, inspType + ' == ' + iType + ' && ' + inspResult + ' == ' + iResult)){
            if($iTrc(createNewInsp, "create new inspection"))
                scheduleInspection(iType, dateAdd(inspResultDate, 7, true), inspector, null, newInspReqComments);
            if($iTrc(updateWf, "update worflow"))
                updateTask(wfTsk2Update, wfSt2Update);
        }
    }
    catch(err){
        showMessage = true;
        comment("Error on noticeOfViolationInspection(). Err: " + err + ". Line Number: " + err.lineNumber + ". Stack: " + err.stack);
        logDebug("Error on noticeOfViolationInspection(). Err: " + err + ". Line Number: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("noticeOfViolationInspection() ended");
}