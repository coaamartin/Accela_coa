script250_updateAssignedUserForTrafficEngRequest();

function script250_updateAssignedUserForTrafficEngRequest(){
var assignToUserName = AInfo['Updated.Assigned To']

	useTaskSpecificGroupName=false;
	var tsiArray = new Array(); 
		
	loadTaskSpecific(tsiArray);
	for (i in tsiArray){
	logDebug(i)
    if (i=="Assigned To"){
    	var assignedTo=tsiArray[i];
    	if (assignedTo!=null && assignedTo!=""){
    			var userName=assignedTo.split(" ");
    			var userObj = aa.person.getUser(userName[0],null,userName[1]).getOutput();
    			assignTask("Traffic Investigation",userObj.getUserID());
    			updateTaskDepartment("Traffic Investigation",userObj.getDeptOfUser());		
    	}	
     }
    	
    }
	
}
