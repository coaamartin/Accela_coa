/**
 * main function
 * 
 */
         
function planningCaseAssignmentChange(){
	try {
		   var assignedStaff=getAssignedStaff(capId);
		logDebug("assignedStaff:" + assignedStaff);
   		if (typeof(assignedStaff)!="undefined" && assignedStaff!=null && assignedStaff!=""){
   			assignWfTask(assignedStaff,capId);
		}
		
	}catch(err){
		aa.debug("planningCaseAssignmentChange " , err);
	}
}