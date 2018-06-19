script250_updateAssignedUserForTrafficEngRequest();

function script250_updateAssignedUserForTrafficEngRequest(){
var assignToUserName = AInfo['Updated.Assigned To']

	useTaskSpecificGroupName=false;
	var tsiArray = new Array(); 
		
	loadTaskSpecific(tsiArray);
	for (i in tsiArray){
		if (ifTracer(i=="Assigned To", "i == Assigned To")) {
			var assignedTo=tsiArray[i];
			if (ifTracer(assignedTo!=null && assignedTo!="", "assignedTo is valid")) {
				logDebug(assignedTo);
				var userName=assignedTo.split(" ");
				var userObj = aa.person.getUser(userName[0],null,userName[1]).getOutput();
		//		printObjProps(userObj);
				assignTask("Traffic Investigation",userObj.getUserID());
				updateTaskDepartment("Traffic Investigation",userObj.getDeptOfUser());		
			}	
		}
	}
	 	
}
