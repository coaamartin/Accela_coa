//Assign Task to TSI user
function assignTaskToTSIUser(wfTaskStr, assignedTo){
	if(assignedTo != false) {
		var userName=assignedTo.split(" ");
		var userObj = aa.person.getUser(userName[0],null,userName[1]).getOutput();
		if(userObj){
		    assignTask(wfTaskStr,userObj.getUserID());
		    updateTaskDepartment(wfTaskStr,userObj.getDeptOfUser());		
		}
	}
}