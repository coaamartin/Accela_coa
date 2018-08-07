function isHistTaskStatus(wfTask, wfTaskStatus) {
	
	itemCap = capId;
	if (arguments.length == 3) itemCap = arguments[2];
	
    wfObj = aa.workflow.getHistory(itemCap).getOutput();

    for (var x = 0; x < wfObj.length; x++) {
        if (wfObj[x].disposition == wfTaskStatus && wfObj[x].getTaskDescription() == wfTask) {
            return true;
        }
    }
    return false;
}