//Assign Task to TSI user
function assignTaskToTSIUser(wfTaskStr, tsiField){
	useTaskSpecificGroupName=false;

	var assignedTo = getTaskSpecific(wfTask, tsiField);
	logDebug(assignedTo);
	if(assignedTo != false) {
		var userName=assignedTo.split(" ");
		var userObj = aa.person.getUser(userName[0],null,userName[1]).getOutput();
		assignTask(wfTaskStr,userObj.getUserID());
		updateTaskDepartment(wfTaskStr,userObj.getDeptOfUser());		
	}
}