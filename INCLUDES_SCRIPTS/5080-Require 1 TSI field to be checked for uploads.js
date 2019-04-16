/* 80-Require 1 TSI field to be checked for uploads

11/6/2018 Workflow Task – Pre Submittal Meetings and Status Email Applicant then require at least 1 TSI field to be checked.  
          If no fields are checked then display message “Email Applicant Requires at least 1 document type to be checked for the applicant to upload  

*/

logDebug("JMPorter JMPorter Alert: ------------------------>> Script Item #80 - 80-Require 1 TSI field to be checked for uploads");

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
      
      //logDebug("JMPorter JMPorter Post Pre Submittal : 1 ------------------------>> ");
      
		if ("Pre Submittal Meetings".equals(fTask.getTaskDescription()))          
      // tempjp
      { 
      
         var TSIResult = aa.taskSpecificInfo.getTaskSpecificInfoByTask(capId, processID, stepnumber)  // 
			if (TSIResult.getSuccess()) 
         {
            
            var TSI = TSIResult.getOutput();
            if (TSI != null) 
               
            for (dmyIttr in TSI) //JMPorter 
            {          
            
              //logDebug("JMPorter - IN TSI :" + TSI[dmyIttr].getCheckboxDesc());   // JMPorter
              //logDebug("JMPorter - Comment TSI :" + TSI[dmyIttr].getChecklistComment());   // JMPorter
              
              if (TSI[dmyIttr].getChecklistComment() != null)
              {   
                if (TSI[dmyIttr].getChecklistComment() == "CHECKED") 
                {
                   foundCheckBox = true;
                   //logDebug("JMPorter JMPorter Found Checkbox "); //
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
 


