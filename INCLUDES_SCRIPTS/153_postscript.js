// extension of script #153 - update app status
updateAppStatus("Complete", "Updated via EMSE");
var wfProcess = getWfProcessCodeByCapId(capId);
logDebug("Record is complete.  Closing all active tasks for process code: " + wfProcess);
if(wfProcess) deactivateActiveTasks(wfProcess);
