/* JMP - 11/5/2018 - Script Item #68 - 68_Workflow_Traffic_Review_Assign_People
// ​​If Info Field ‘Project Category’ has “Assembly Building”, “Business Use Building”, “Factory Use Building”, “Group E Building”, “Group U Building”, “Hotel Building”, 
// “Institutional Use Building”, “Mercantile Use Building”, “Non-Res Addition” or “Storage Use Building” selected, then the Traffic Review workflow task is assigned to Brianna Medema 
// instead of Lance Littleton
 
*/

logDebug("JMP JMP Alert: ------------------------>> Script Item #68 - 68_Workflow_Traffic_Review_Assign_People");

logDebug (AInfo["Project Category"] + "");

if ((AInfo["Project Category"] == "Assembly Building") || (AInfo["Project Category"] == "Business Use Building") || (AInfo["Project Category"] == "Factory Use Building") || (AInfo["Project Category"] == "Group E Building") || (AInfo["Project Category"] == "Group U Building") || (AInfo["Project Category"] == "Hotel Building") || (AInfo["Project Category"] == "Institutional Use Building") || (AInfo["Project Category"] == "Mercantile Use Building") || (AInfo["Project Category"] == "Non-Res Addition") || (AInfo["Project Category"] == "Storage Use Building"))
{
  logDebug("JMP JMP - Within code block to assign individual");

  var taskResult = aa.workflow.getTask(capId, "Traffic Review");
  var currentTask = taskResult.getOutput();
  if (currentTask != null && currentTask != "") 
     
  {
     logDebug("JMP - JMP = Within code block to assign individual WFTASK of Traffic Review");
     
     var assignedTo = "Brianna Medema"
     var userName=assignedTo.split(" ");
     var userObj = aa.person.getUser(userName[0],null,userName[1]).getOutput();
     
     logDebug("JMP - JMP - JMP = " + userName[1] + "");
     
     assignTask("Traffic Investigation",userObj.getUserID());
     
     var taskUserResult = aa.person.getUser("Brianna Medema");
	  if (taskUserResult.getSuccess())
     {
       taskUserObj = taskUserResult.getOutput();
       logDebug ("Brianna Medema is in " + taskUserObj + "")  
     }
     
     var workflowTask = aa.workflow.getTask(capId, "Traffic Review");
     var fTask = workflowTask.getOutput();
     var taskUserObj = fTask.getTaskItem().getAssignedUser();
     
     //var taskUserDept = getAssignedDept();
     
     logDebug(taskUserObj);
     // logDebug(taskUserDept); //
     
     activateTask("Traffic Review");
     assignTask("Traffic Review","Brianna Medema");
     
     //editTaskSpecific("Traffic Review", "ASSIGNED", "Brianna Medema");
     //editTaskSpecific("Traffic Review", "Assigned to", "Brianna Medema");
     //editTaskSpecific("Traffic Review", "Assigned", "Brianna Medema");
     
     logDebug("Assigned Brianna Medema .. double check ");
     //AssignTask("Traffic Review","Brianna Medema");	
  }
  
function getAssignedUser() 
{
	if (capId != null) 
   {
		capDetail = aa.cap.getCapDetail(capId).getOutput();

		userObj = aa.person.getUser(capDetail.getAsgnStaff());  ///
      
		if (userObj.getSuccess()) 
      {
			staff = userObj.getOutput();
			userID = staff.getUserID();
			return userID;
		} 
      else 
      {
			return false;
		}
	} else
		return false;
}  



}




