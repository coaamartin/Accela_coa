function copyAppName(srcCapId, targetCapId){
    logDebug("copyAppName() started");
    try{
        var parCapResult = aa.cap.getCap(srcCapId);
        if(!parCapResult.getSuccess()) { logDebug("WARNING: Unable to get application name from source cap id " + srcCapId); return false; }
        
        var parAppName = getAppName(srcCapId);
        
        if(parAppName == null || parAppName == "" || parAppName == undefined) { logDebug("Parent Record " + srcCapId.getCustomID() + " has no Application Name to copy"); return false; }
        
        return editAppName(parAppName, targetCapId);
    }
    catch(err){
        showMessage = true;
        comment("Error on copyAppName(). Err: " + err + ". Line Number: " + err.lineNumber + ". Stack: " + err.stack);
        logDebug("Error on copyAppName(). Err: " + err + ". Line Number: " + err.lineNumber + ". Stack: " + err.stack);
    }    
}//END copyAppName()