//Deactivate all active tasks.
var wfProcess = getWfProcessCodeByCapId(capId);
logDebug("Closing all active tasks for process code: " + wfProcess);
if(wfProcess) deactivateActiveTasks(wfProcess);
