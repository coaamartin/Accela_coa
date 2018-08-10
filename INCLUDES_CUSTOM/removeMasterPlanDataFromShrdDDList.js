
function removeMasterPlanDataFromShrdDDList(appStatusArray, stdChoiceName) {
    logDebug("removeMasterPlanDataFromShrdDDList() started");
    var statusMatch = false;
    var currentAppStatus = cap.getCapModel().getCapStatus();

    for (s in appStatusArray) {
        if (currentAppStatus == appStatusArray[s]) {
            var appName = cap.getSpecialText();
            if (appName == null || appName == "") {
                logDebug("application name is null or empty, capId=" + capId);
                return false;
            }
            deactivateSD(stdChoiceName, appName);
            clearBizDomainCache();
			logDebug("removeMasterPlanDataFromShrdDDList() ended with true");
            return true;
        }
    }//for all status options
	
	logDebug("removeMasterPlanDataFromShrdDDList() ended with false");
    return false;
}