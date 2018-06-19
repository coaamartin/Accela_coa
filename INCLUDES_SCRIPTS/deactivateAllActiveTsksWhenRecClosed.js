//Deactivate all active tasks if the record is closed.
if(cap.getCapStatus() == "Closed"){
    logDebug("Record is Closed.  Closing all active tasks");
    var wfProcess = getWfProcessCodeByCapId(capId);
    if(wfProcess) deactivateActiveTasks();
}
