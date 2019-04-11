//created by swakil
//Updated per Issue Tracker #8 JMP: 4/11/19

logDebug("Script #32 - Start");

if(wfTask=="Application Submittal" && wfStatus=="Completed"){
	var valid = false;
	var taskstatustocheck = "Ready to Pay with Specific Contract Fees";
	var newAppStatus = "Specific Contract Fees-Accepted";
	var tasks = aa.workflow.getHistory(capId).getOutput();
	for (i in tasks){
		task = tasks[i];
		if(task.getDisposition() == taskstatustocheck)	{	
			valid = true;	
			break;
		}
	}
	if(valid){
		updateAppStatus(newAppStatus, "Updated by EMSE Script #32");
		logDebug("Updated App Status");
	}
}

logDebug("Script #32 - End");