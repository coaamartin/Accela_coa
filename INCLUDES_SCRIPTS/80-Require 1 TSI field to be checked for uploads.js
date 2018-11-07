/* 80-Require 1 TSI field to be checked for uploads

11/6/2018 Workflow Task – Pre Submittal Meetings and Status Email Applicant then require at least 1 TSI field to be checked.  
          If no fields are checked then display message “Email Applicant Requires at least 1 document type to be checked for the applicant to upload  

*/

logDebug("JMP JMP Alert: ------------------------>> Script Item #80 - 80-Require 1 TSI field to be checked for uploads");

if ((wfTask == "Pre Submittal Meetings") && (wfStatus == "Email Applicant"))
{   

   logDebug("JMP JMP Alert WITHIN LOOP : ------------------------>> ");
   
   var i = 0;
	var workflowResult = aa.workflow.getTasks(CapId);
   var wfObj = workflowResult.getOutput();
   
   for (i in wfObj) 
   {
      var fTask = wfObj[i];
		var stepnumber = fTask.getStepNumber();
		var processID = fTask.getProcessID();
		if ("Pre Submittal Meetings".equals(fTask.getTaskDescription())) 
      { 
			var TSIResult = aa.taskSpecificInfo.getTaskSpecifiInfoByDesc(itemCap, processID, stepnumber, "Pre Submittal Meetings");
			if (TSIResult.getSuccess()) 
         {
				var TSI = TSIResult.getOutput();
				if (TSI != null) 
            {
					var TSInfoModel = TSI.getTaskSpecificInfoModel();
               for (dmyIttr in TSIInfoModel) 
               {
                  logDebug("JMP - IN TSI :" + TSInfoModel[dmyIttr]);
               }
            }
         }      
      }
	
   }
} 
 


