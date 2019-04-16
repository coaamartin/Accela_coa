/* JMPorter - 10/4/2018 - Script Item #74 - 74_Building_WF_Accept_Plans_Withdrawn
// ​	Withdrawn on Accept Plans or Accepted in House deactives active tasks
// 	If the status of 'Withdrawn' on Accept Plans wf task or "Withdrawn" on Accepted In House wf task, then deactivate all active workflow tasks.
*/

logDebug("JMPorter JMPorter Alert: ------------------------>> Script Item #74 - 74_Building_WF_Accept_Plans_Withdrawn");

var Deactivate = false;

if(wfTask =="Accept Plans" && wfStatus== "Withdrawn")     
{
	Deactivate = true;
}

if(wfTask =="Accepted In House" && wfStatus== "Withdrawn")     
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