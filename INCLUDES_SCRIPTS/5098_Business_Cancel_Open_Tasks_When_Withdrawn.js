************************************************ >>  5098_Business_Cancel_Open_Tasks_When_Withdrawn.js  << ****************************
// SCRIPTNUMBER: 5098
// SCRIPTFILENAME: 5098_Business_Cancel_Open_Tasks_When_Withdrawn.js
// PURPOSE: Issue log #56 - Building Permit with Plans - Needa script; to close all open active tasks when the workflow task "Accept Plans" = "Withdrawn";
// DATECREATED: 04/16/2019
// BY: JMP


logDebug("BEGIN: ------------------------>> Script Item #5098 - 5098_Business_Cancel_Open_Tasks_When_Withdrawn");

var Deactivate = false;

if(wfTask =="Accept Plans" && wfStatus== "Withdrawn")     
{
	Deactivate = true;
}

if (Deactivate)
{
  var workflowResult = aa.workflow.getTasks(capId);
	if (workflowResult.getSuccess()) 
	{
		wfObjs = workflowResult.getOutput();
		for ( var inx in wfObjs) 
		{
			var currentTask = wfObjs[inx];
			if (currentTask.getActiveFlag().equals("Y")) 
			{
			   deactivateTask(currentTask.getTaskDescription());
			}   
		}	
	}     
}

logDebug("END: ------------------------>> Script Item #5098 - 5098_Business_Cancel_Open_Tasks_When_Withdrawn");