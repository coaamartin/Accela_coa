function pWrksScript145_updateAppName(srcCapId, targetCapId){
    logDebug("pWrksScript145_updateAppName() started");
    try{
	    var $iTrc = ifTracer;
        var parentCapId = getParent();
	    if($iTrc(parentCapId, parentCapId)) copyAppName(parentCapId, capId);
    }
    catch(err){
        showMessage = true;
        comment("Error on pWrksScript145_updateAppName(). Err: " + err + ". Line Number: " + err.lineNumber + ". Stack: " + err.stack);
        logDebug("Error on pWrksScript145_updateAppName(). Err: " + err + ". Line Number: " + err.lineNumber + ". Stack: " + err.stack);
    }    
}//END pWrksScript145_updateAppName()