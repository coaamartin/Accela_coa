// SCRIPTNUMBER: 5088
// SCRIPTFILENAME: 5088_LawnIrrigationPermitFeesPaid.js
// PURPOSE: Update record status depending on inspection state
// DATECREATED: 02/20/2019
// BY: JMP
// CHANGELOG: Per issue tracker instructions #26 sent on 2/14

logDebug("Script #5088 - Irrigation Permit Fees Paid - Start");
logDebug(capStatus + "");

if (appTypeResult == "Water/Water/Lawn Irrigation/Permit") 
{ 

if (balanceDue == 0)
{
	var contacts = "Applicant";
	var template = "WAT_IP_PERMIT FEES PAID";	

	var eParams = aa.util.newHashtable();
	emailContacts(contacts, template, eParams, "", "", "N", "");	

   updateTaskAndHandleDisposition("Fee Processing", "Fees Paid");
   
   var vInspType = inspType;
	var vInspStatus = "Pending";
   var lastInspectionObj = getLastCreatedInspection(capId, vInspType, vInspStatus);
   if (lastInspectionObj != null) 
   { 
	  updateAppStatus("Pending Inspection");
   }  
	
  logDebug("Script #5088 - Irrigation Permit Fees Paid - End");    
  
}


 function updateTaskAndHandleDisposition(taskName, taskStatus)
{//Optional capId to use
    try
    {
        var itemCap = null;

        if(arguments.length > 2)
        {
            itemCap = arguments[2]
        }
        else
        {
            itemCap = capId;
        }
        var functionName = "updateTaskAndHandleDisposition";
        var taskResult = aa.workflow.getTask(itemCap, taskName);

        if(!taskResult.getSuccess())
        {
            logDebug("Problem while getting task " + taskResult.getErrorMessage());
        }
        task = taskResult.getOutput();
        task.setDisposition(taskStatus);  
        var updateResult = aa.workflow.handleDisposition(task.getTaskItem(),itemCap); 
        if(!updateResult.getSuccess())
        {
            logDebug("Problem while updating workflow " + updateResult.getErrorMessage());
        }

    }
    catch(e)
    {
        aa.debug("**EXCEPTION in function " + functionName, e);
        throw(e);
    }

}
}