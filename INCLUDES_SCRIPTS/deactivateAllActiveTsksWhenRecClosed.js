//Deactivate all active tasks if the record is closed.
if(cap.getCapStatus() == "Closed"){
    var wfProcess = getWfProcessCodeByCapId(capId);
	logDebug("Record is Closed.  Closing all active tasks for process code: " + wfProcess);
    if(wfProcess) deactivateActiveTasks(wfProcess);
}
