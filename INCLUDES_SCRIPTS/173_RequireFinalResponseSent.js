script173_RequireFinalResponseSent()

function script173_RequireFinalResponseSent() {
    var errMsg = '',
        finalRespReq=getAppSpecific("Final Response Required", capId),
        tasks = aa.workflow.getHistory(capId).getOutput();
    if (ifTracer(finalRespReq=="CHECKED", 'finalRespReq==CHECKED')) {
        for (var t in tasks) {
            var task = tasks[t];
            if (ifTracer(task.getTaskDescription() == 'Final Response Required' ||  task.getTaskDescription() == 'Final Request Sent', 'one of the adhoc workflows are in history - must be done')) {
             //   if(task.disposition == 'Complete')
            //    printObjProps(task);  
                return true;
            }
        }
    }
	showMessage = true;
	comment("Final Response Sent needs to be completed");
	cancel = true;

}