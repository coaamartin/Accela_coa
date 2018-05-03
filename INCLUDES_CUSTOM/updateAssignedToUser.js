function updateAssignedToUser() {
	var assignedStaff = getAssignedStaff();
	var wfTaskToUpdate=getWorkflowTaskName();	
	if (wfTaskToUpdate!=null && wfTaskToUpdate!=""){
		if (wfTaskToUpdate.indexOf(",")> 0) {
			wfTaskToUpdate=wfTaskToUpdate.split(",")
			for (i in wfTaskToUpdate){
				assignTask(wfTaskToUpdate[i], assignedStaff,wfProcess);
			}
		}else {
			
			assignTask(wfTaskToUpdate, assignedStaff,wfProcess);
		}		
	}
		
}