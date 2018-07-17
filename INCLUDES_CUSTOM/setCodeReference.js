
/**
 * * If the workflow status = "Issued" and the "Code Reference" custom field is empty, then update the "Code Reference"
 *   field with the value "2015 I-Codes/Aurora Muni Codes/2017-NEC".
 * @returns {void} 
 */

function setCodeReference(wfStatusCompare) {
    var $iTrc = ifTracer;
    logDebug("setCodeReference() started");
    //In case the permit is issued from other event, we hard code the task and status.
    if(vEventName != "WorkflowTaskUpdateAfter"){
        logDebug("Event name is not WTUA");
        wfStatus = "Issued";
    }
	
    if ($iTrc(wfStatus == wfStatusCompare, 'wfStatus == ' + wfStatusCompare)) {
        var codeRefVal = getAppSpecific("Code Reference");
        if ($iTrc(isEmpty(codeRefVal), 'isEmpty(codeRefVal)')) {
            editAppSpecific("Code Reference", "2015 I-Codes/Aurora Muni Codes/2017-NEC");
        }
    }
    logDebug("setCodeReference() ended.");
}
