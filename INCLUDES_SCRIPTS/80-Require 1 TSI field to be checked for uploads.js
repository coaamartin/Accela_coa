/* 80-Require 1 TSI field to be checked for uploads

11/6/2018 Workflow Task – Pre Submittal Meetings and Status Email Applicant then require at least 1 TSI field to be checked.  
          If no fields are checked then display message “Email Applicant Requires at least 1 document type to be checked for the applicant to upload

*/

logDebug("JMP JMP Alert: ------------------------>> Script Item #80 - 80-Require 1 TSI field to be checked for uploads");

if ("Pre Submital Meetings".equals(wfTask) && "Email Applicant".equals(wfStatus)) 
{

  var workflowResult = aa.workflow.getTasks(itemCap);
  var wfObj = workflowResult.getOutput();

  for (i in wfObj) 
  {
    var fTask = wfObj[i];
    var stepnumber = fTask.getStepNumber();
    var processID = fTask.getProcessID();
    var TSIResult = aa.taskSpecificInfo.getTaskSpecificInfoByTask(itemCap, processID, stepnumber)
    if (TSIResult.getSuccess()) 
    {
      var TSI = TSIResult.getOutput();
      for (a1 in TSI) 
      {
        logDebug("JMP - IN TSI :" + fTask.getTaskDescription() + "");  
      
      }
    }
  }  
}

