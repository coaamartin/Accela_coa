if(wfTask=="Water Meter Set" && wfStatus=="Completed"){
	var valid = false;
	var taskstatustocheck = "Ready to Pay with Specific Contract Fees";
	var newAppStatus = "Closed-Specific Contract Fees";
	var tasks = aa.workflow.getHistory(capId).getOutput();
	for (i in tasks){
		task = tasks[i];
		if(task.getDisposition() == taskstatustocheck)	{	
			valid = true;	
			break;
		}
	}
	if(valid){
		updateAppStatus(newAppStatus, "Updated by EMSE");
		logDebug("Updated App Status");
	}
}