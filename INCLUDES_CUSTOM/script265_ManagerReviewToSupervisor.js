//Script 265
//Record Types:	PublicWorks\Traffic\Traffic Engineering Request\NA 
//Event: 		WTUA
//Desc:			Event WorkflowUpdateAfter 
//
//              when WF task 'Supervisor Review' is updated with status 'Approved',
//              then check to see if the status of task 'Draft Workorder' is status
//              'Workorder Drafted' then set assign the task 'Manager Review' to the current user
//
//Created By: Silver Lining Solutions

function script265_ManagerReviewToSupervisor (){
	logDebug("script265_ManagerReviewToSupervisor() started.");
	try{
		var $iTrc = ifTracer;
		var supRevAssigned = isTaskAssigned("Supervisor Review");
		var initSupRevAssi = isTaskAssigned("Initial Supervisor Review");
		var assignedTo = getTaskSpecific("Initial Review", "Assigned to Supervisor");
		
		if($iTrc(!supRevAssigned && !initSupRevAssi, 'Supervisor Review and Initial Supervisor Review are not assigned'))
			assignTaskToTSIUser("Supervisor Review", assignedTo);
		
		if($iTrc(!supRevAssigned && initSupRevAssi, '!supRevAssigned && initSupRevAssi')){
			var initSupRevUser = getTaskAssignedStaff("Initial Supervisor Review");
			assignTask("Supervisor Review", initSupRevUser);
		}
		
		if($iTrc(!supRevAssigned, '!supRevAssigned')){
			var initSupRevUser = getTaskAssignedStaff("Supervisor Review"");
			assignTask("Supervisor Review", initSupRevUser);
		}
	}
	catch(err){
		logDebug("Error on custom function script265_ManagerReviewToSupervisor(). Please contact administrator. Err: " + err);
	}
	logDebug("script265_ManagerReviewToSupervisor() ended.");
};//END script265_ManagerReviewToSupervisor
