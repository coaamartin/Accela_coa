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
    var vEventName = aa.env.getValue("EventName");
	var params = aa.env.paramValues;
	var keys = params.keys(); // class java.util.Hashtable$Enumerator ;
	var key = null;
    
	logDebug('***** Begin List Environment for the ' + vEventName + ' event *****');
	while (keys.hasMoreElements())
	{
		key = keys.nextElement();
		//logDebug("var " + key + " = aa.env.getValue( \"" + key + "\" ) ;");
		//logDebug("Loaded Env Variable: " + key + " = " + aa.env.getValue(key));
		logDebug('var ' + key + ' = ' + aa.env.getValue(key) + ' ;');
	}
	logDebug('***** End List Environment for the ' + vEventName + ' event *****');
        if($iTrc(inspType == iType && inspResult == iResult, inspType + ' == ' + iType + ' && ' + inspResult + ' == ' + iResult)){
            if($iTrc(createNewInsp, "create new inspection"))
                scheduleInspection(iType, dateAdd(null, 7, true))
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