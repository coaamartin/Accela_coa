//**************************************************************************
//Function		getTaskAssignedStaff
//Desc:			given a workflow task, return the staff object that has been
// 				assigned to the task.
//
//input:		wfstr: the workflow task name (string)
//				process name (string) [optional]
//
//returns:		people object 
//
//Created By: Silver Lining Solutions
//**************************************************************************
function getTaskAssignedStaff(wfstr) // optional process name
{
	var useProcess = false;
	var processName = "";
	if (arguments.length == 2) {
		processName = arguments[1]; // subprocess
		useProcess = true;
	}

	var workflowResult = aa.workflow.getTaskItems(capId, wfstr, processName, null, null, null);
	
	if (workflowResult.getSuccess()) {
		var wfObj = workflowResult.getOutput();
	}
	else {
		aa.print("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage());
		return false;
	}

	for (i in wfObj) {
		var fTask = wfObj[i];

		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName))) 
		{
			var aStaff = fTask.getAssignedStaff();
			var staffObj = aa.person.getUser(aStaff.firstName, "", aStaff.lastName).getOutput(); 

			return(staffObj);
		}
	}
}