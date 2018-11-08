/* 80-Require 1 TSI field to be checked for uploads

11/6/2018 Workflow Task – Pre Submittal Meetings and Status Email Applicant then require at least 1 TSI field to be checked.  
          If no fields are checked then display message “Email Applicant Requires at least 1 document type to be checked for the applicant to upload  

*/

logDebug("JMP JMP Alert: ------------------------>> Script Item #80 - 80-Require 1 TSI field to be checked for uploads");

if ((wfTask == "Pre Submittal Meetings") && (wfStatus == "Email Applicant"))
{   

   var foundCheckBox = false;   
	var workflowResult = aa.workflow.getTasks(capId);
   var wfObj = workflowResult.getOutput();
   
   for (i in wfObj) 
   {
      var fTask = wfObj[i];
		var stepnumber = fTask.getStepNumber();
		var processID = fTask.getProcessID();
      
      //logDebug("JMP JMP Post Pre Submittal : 1 ------------------------>> ");
      
		if ("Pre Submittal Meetings".equals(fTask.getTaskDescription()))          
      // tempjp
      { 
      
         var TSIResult = aa.taskSpecificInfo.getTaskSpecificInfoByTask(capId, processID, stepnumber)  // 
			if (TSIResult.getSuccess()) 
         {
            
            var TSI = TSIResult.getOutput();
            if (TSI != null) 
               
            for (dmyIttr in TSI) //JMP 
            {          
            
              logDebug("JMP - IN TSI :" + TSI[dmyIttr].getCheckboxDesc());   // JMP
              logDebug("JMP - Comment TSI :" + TSI[dmyIttr].getChecklistComment());   // JMP
              
              if (!TSI[dmyIttr].getChecklistComment() == null)
              {   
                if (!TSI[dmyIttr].getChecklistComment().ignoreCase == "CHECKED") 
                {
                   foundCheckBox = true;
                   logDebug("JMP JMP Found Checkbox ");
                }
              }  
            }
            
         }      
      }
	
   }
   
   if (!foundCheckBox)
   {
      showMessage = true;
	   comment("<h2 style='background-color:rgb(255, 0, 0);'>Email applicant requires at least one document type to be checked for the upload to continue.</h2>");
      cancel = true;
   }
} 
 


