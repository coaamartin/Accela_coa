/* 80-Require 1 TSI field to be checked for uploads

11/6/2018 Workflow Task – Pre Submittal Meetings and Status Email Applicant then require at least 1 TSI field to be checked.  
          If no fields are checked then display message “Email Applicant Requires at least 1 document type to be checked for the applicant to upload

*/

logDebug("JMP JMP Alert: ------------------------>> Script Item #80 - 80-Require 1 TSI field to be checked for uploads");

if ("Pre Submital Meetings".equals(wfTask) && "Email Applicant".equals(wfStatus)) 
{   

   logDebug("JMP JMP Alert WITHIN LOOP : ------------------------>> ");

	var itemCap = capId;
  	var workflowResult = aa.workflow.getTasks(itemCap);
   var wfObj = workflowResult.getOutput();
   for (i in wfObj) 
   {
		var fTask = wfObj[i];
		var stepnumber = fTask.getStepNumber();
		var processID = fTask.getProcessID();

		//var TSIResult = aa.taskSpecificInfo.getTaskSpecifiInfoByDesc(itemCap, processID, stepnumber, "Pre Submital Meetings");
		//if (TSIResult.getSuccess()) 
      //{
         
         var tsiArray = new Array(); 
         loadTaskSpecific(tsiArray);
         
         for (tsi in TSIArray) 
         {
           logDebug("JMP - IN TSI :" + TSIArray[tsi]);
         }
         /*
			var TSI = TSIResult.getOutput();
			if (TSI != null) 
         {
				var TSIArray = new Array();
				var TSInfoModel = TSI.getTaskSpecificInfoModel();
				var itemValue = TSInfoModel.getChecklistComment();
				logDebug("JMP - IN TSI :" + itemValue);
			} 
         */
         
		//} // found workflow task
	} // each task

} 
 


