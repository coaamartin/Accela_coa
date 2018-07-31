/* Process Notice of Violation script
 * Params:
 * @iType (String) - Inspection Type to check for
 * @iResult (String) - Inspection Result to check for
 * @createNewInsp (boolean) - Create new Notice of Violation inspection
 * @updateWf (boolean) - Update a workflow task with a status
 * @wfTsk2Update (String) - workflow task to update
 * @wfSt2Update (String) - workflow task status to update the task to
 */
function processNotOfViolInsp(iType, iResult, createNewInsp, insp2Create, updateWf, wfTsk2Update, wfSt2Update){
    logDebug("noticeOfViolationInspection() started");
    try{
        var $iTrc = ifTracer;
        var newInspReqComments = getInspReqCommsByInspID(inspId);
        var inspector = getInspectorByInspID(inspId);
        var inspDaysAhead = days_between(aa.util.parseDate(dateAdd(null, 0)), aa.util.parseDate(dateAdd(inspResultDate, 7, true)));
        if($iTrc(inspType == iType && inspResult == iResult, inspType + ' == ' + iType + ' && ' + inspResult + ' == ' + iResult)){
            if($iTrc(createNewInsp, "create new inspection"))
                scheduleInspection(insp2Create, inspDaysAhead, inspector, null, newInspReqComments);
            if($iTrc(updateWf, "update worflow")){
                if(!isTaskActive(wfTsk2Update))
                    activateTask(wfTsk2Update);
                
                //if(wfTsk2Update == "Investigation" && wfSt2Update == "Notice of Violation")
                //    closeTask(wfTsk2Update, wfSt2Update);
                //else
                //    updateTask(wfTsk2Update, wfSt2Update);
			    resultWorkflowTask(wfTsk2Update, wfSt2Update);
            }
        }
    }
    catch(err){
        showMessage = true;
        comment("Error on noticeOfViolationInspection(). Err: " + err + ". Line Number: " + err.lineNumber + ". Stack: " + err.stack);
        logDebug("Error on noticeOfViolationInspection(). Err: " + err + ". Line Number: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("noticeOfViolationInspection() ended");
}