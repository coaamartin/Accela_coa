/* #81 - Add Fees and Invoice may not have happened

11/8/2018 Event: WorkflowTaskUpdateBefore

If Task = Application Acceptance and Status is Ready To Pay (maybe Accepted as well - confirm with Planning) 

Check to see if there is at least one fee and that all Fees are invoiced. 

If not, then raise message "Fees must be added and invoiced to Accept the Application Acceptance" 
  

*/

logDebug("JMPorter JMPorter Alert: ------------------------>> Script Item #81 - Add Fees and Invoice may not have happened");

if (((wfTask == "Application Acceptance") && (wfStatus == "Ready to Pay")) || ((wfTask == "Application Acceptance") && (wfStatus == "Accepted")))
{   

   //logDebug("JMPorter JMPorter -- Balance Due:" + balanceDue + "");   

   if (balanceDue > 0)
   {
      showMessage = true;
	   comment("<h2 style='background-color:rgb(255, 0, 0);'>Fees must be added and invoiced to Accept the Application Acceptance.</h2>");
      cancel = true;     
      
   }
} 
 


