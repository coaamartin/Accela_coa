/* JMP - 10/2/2018 - Script Item #62 - Prevent Ready for CO if inspections pending or scheduled or active other wf tasks
// ​If status 'Ready For CO' is selected on Inspection Phase wf task, verify there are no Pending or Scheduled inspections and verify that there are no other workflow tasks active, 
// if there are then prevent the wf task from proceeding and present a message stating "There are pending or scheduled inspections or workflow tasks active, Inspection Phase workflow can't proceed.  
*/

logDebug("JMP JMP Alert: ------------------------>> Called Script Item #62 - 62_Building_Inspection_Check_Pending_Scheduled");

if(wfTask =="Inspection Phase" && wfStatus== "Ready For CO") // 
{
  
  if ("Pending".equals(inspResult)) || ("Scheduled".equals(inspResult)) 
  {
	showMessage = true;
	comment("<h2 style='background-color:rgb(255, 0, 0);'>WARNING - There are pending or scheduled inspections or workflow tasks active, Inspection Phase workflow can't proceed. </h2>");
	deactivateTask("Inspection Phase");
	cancelcel = true;
  }
}