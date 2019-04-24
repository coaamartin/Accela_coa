//************************************************ >>  5063_Inspection_Phase_Water_Meter.js  << ****************************
// SCRIPTNUMBER: 5063
// SCRIPTFILENAME: 5063_Inspection_Phase_Water_Meter.js
// PURPOSE: ​1 of 2 - Building/Permits/New Building/NA - if status 'Final' is selected on Inspection Phase wf task, verify that the Water Meter wf task and the 
//                   Backflow Preventer wf tasks are not active, if either of those wf tasks are active then prevent the Inspection Phase wf task from proceeding and 
//                   present a message stating "There are workflow tasks still active, Inspection Phase workflow can't proceed."
//  
//                   2 of 2 - Building/Permits/Plans/NA – if status 'Final' is selected on Inspection Phase wf task, verify that the Backflow Preventer wf tasks are not active, 
//                   if that wf task is active then prevent the Inspection Phase wf task from proceeding and present a message stating "There are workflow tasks still active, Inspection 
//                   Phase workflow can't proceed.If status 'Ready For CO' is selected on Inspection Phase wf task, verify there are no Pending or Scheduled inspections and verify that there are no other workflow tasks active, 
//                   if there are then prevent the wf task from proceeding and present a message stating "There are pending or scheduled inspections or workflow tasks active, Inspection Phase workflow can't proceed.
// DATECREATED: 10/26/2018
// BY: JMPorter

logDebug("JMPorter JMPorter Alert: ------------------------>> Script Item #5063 - Inspection_Leftover .. dbl check JP");

if(wfTask =="Inspection Phase" && wfStatus== "Final") 
{
   
   var foundMatch = false;
   var workflowResult = aa.workflow.getTasks(capId);
   
	if (workflowResult.getSuccess()) 
	{
		wfObjs = workflowResult.getOutput();
		for ( var inx in wfObjs) 
		{
			var currentTask = wfObjs[inx];
         
         logDebug("JMPorter JMPorter Alert: ------------------------>> Script Item #63 - " + currentTask.getTaskDescription() + "")
         
         if (appMatch("Building/Permit/New Building/NA"))
         {  
          
            if ((currentTask.getTaskDescription() + "" == "Water Meter") || (currentTask.getTaskDescription() + "" == "Backflow Preventor"))
            {
               
              logDebug( currentTask.getActiveFlag() + "");               
               
              if (currentTask.getActiveFlag() == "Y")
              {  
               foundMatch = true;
              }
            }  
         }
         
         
         
         if (appMatch("Building/Permits/Plans/NA"))
         {
            if ((currentTask.getTaskDescription() + "" == "Backflow Preventor"))
            {
              if (currentTask.getActiveFlag() == "Y")
              {  
               foundMatch = true;
              }
            }       
         }
         
         
		}	
	}
   
   if (foundMatch)
   {
      showMessage = true;
      comment("<h2 style='background-color:rgb(255, 0, 0);'>WARNING - There are workflow tasks still active, Inspection Phase workflow can't proceed.. </h2>");        
      cancel = true;      
   } 
   
}