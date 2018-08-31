script173_RequireFinalResponseSent();

function script173_RequireFinalResponseSent() {
	var completeFlag = false;
    var errMsg = '',
        finalRespReq=getAppSpecific("Final Response Required", capId),
        tasks = aa.workflow.getHistory(capId).getOutput();
        
    if (finalRespReq=="CHECKED") {
        for (var t in tasks) {
            var task = tasks[t];
			//logDebug("Task Debug Output" + " " + task.getTaskDescription() + task.getDisposition());

			if ((task.getTaskDescription() == 'Final Response Required' && task.getDisposition() == 'Completed') || task.getTaskDescription() == 'Final Response Sent' && task.getDisposition() == 'Completed') {		
                completeFlag = true;
				logDebug("Found Completed task");
            }
        }
    }
	if(!completeFlag){
	showMessage = true;
	comment("Final Response Sent needs to be completed");
	cancel = true;
	
	}
}