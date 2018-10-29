/* JMP - 10/26/2018 - Script Item #63 - Inspection_Phase_Water_Meter

// Prevent Inspection phase if Water Meter of Bacflow Preventer wf Task active

// 1 of 2 - Building/Permits/New Building/NA - if status 'Final' is selected on Inspection Phase wf task, verify that the Water Meter wf task and the 
   Backflow Preventer wf tasks are not active, if either of those wf tasks are active then prevent the Inspection Phase wf task from proceeding and 
   present a message stating "There are workflow tasks still active, Inspection Phase workflow can't proceed."
   
   2 of 2 - Building/Permits/Plans/NA – if status 'Final' is selected on Inspection Phase wf task, verify that the Backflow Preventer wf tasks are not active, 
   if that wf task is active then prevent the Inspection Phase wf task from proceeding and present a message stating "There are workflow tasks still active, Inspection 
   Phase workflow can't proceed."
 
*/

logDebug("JMP JMP Alert: ------------------------>> Script Item #63 - Inspection_Leftover .. dbl check JP");

if(wfTask =="Inspection Phase" && wfStatus== "Final") 
{   
 var workflowResult = aa.workflow.getTasks(capId);
	if (workflowResult.getSuccess()) 
	{
		wfObjs = workflowResult.getOutput();
		for ( var inx in wfObjs) 
		{
			var currentTask = wfObjs[inx];
         
         logDebug("JMP JMP Alert: ------------------------>> Script Item #63 - " + currentTask.getTaskDescription() + "")
         
			if ((currentTask.getTaskDescription() + "" == "Water Meter") || (currentTask.getTaskDescription() + "" == "Backflow Preventor"))
			{
			  if (currentTask.getActiveFlag() + "" == "Y")
           {  
	         showMessage = true;
	         comment("<h2 style='background-color:rgb(255, 0, 0);'>WARNING - There are workflow tasks still active, Inspection Phase workflow can't proceed.. </h2>");        
           cancel = true;
           }
			}  
                    
		}	
	}

}