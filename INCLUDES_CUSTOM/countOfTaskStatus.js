//Returns how many times a task was resulted with the same status
function countOfTaskStatus(wfTask, wfTaskStatus) {
	var count = 0;
	
	itemCap = capId;
	if (arguments.length == 3) itemCap = arguments[2];
	
    wfObj = aa.workflow.getHistory(itemCap).getOutput();

    for (var x = 0; x < wfObj.length; x++) {
        if (wfObj[x].disposition == wfTaskStatus && wfObj[x].getTaskDescription() == wfTask) {
            count++;
        }
    }
    return count;
}