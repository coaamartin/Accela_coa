script398_ScheduleFinalInspection();

//script 397
logDebug("Script 397 Starting");
if(ifTracer(wfTask == "Closure" && wfStatus == "Closed", "wfTask == Closure && wfStatus == Closed")) {
	include("397_createPpbmpRecordBasedOnCustomListData");
}


//1371
if(wfTask == "Active Permit" && wfStatus == "Periodic Inspections"){
	var tasks = aa.workflow.getTasks(capId).getOutput();
	for (var t in tasks) {
		var task = tasks[t];
		if (task.getTaskDescription() == wfTask && task.getDisposition() == wfStatus) {
			var actionBy = task.getTaskItem().getSysUser();
			aa.print("Action by: " + actionBy.firstName + " " + actionBy.lastName);
			var userObj = aa.person.getUser(actionBy.firstName,null,actionBy.lastName).getOutput();
			assignTask("Closure",userObj.getUserID());
		}
	}
}