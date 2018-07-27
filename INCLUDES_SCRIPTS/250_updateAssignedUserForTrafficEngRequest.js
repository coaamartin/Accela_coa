script250_updateAssignedUserForTrafficEngRequest();

function script250_updateAssignedUserForTrafficEngRequest(){
	useTaskSpecificGroupName=false;

	var assignedTo = getTaskSpecific(wfTask, "Assigned to Investigator");
	logDebug(assignedTo);
	if(assignedTo != false) {
		var userName=assignedTo.split(" ");
		var userObj = aa.person.getUser(userName[0],null,userName[1]).getOutput();
		assignTask("Traffic Investigation",userObj.getUserID());
		updateTaskDepartment("Traffic Investigation",userObj.getDeptOfUser());
		editTaskSpecific("Traffic Investigation", "Assigned to Investigator", userObj.getUserID());	
	}
}	