/* JMP - 10/3/2018 - Script Item #62 - Prevent Ready for CO if inspections pending or scheduled or active other wf tasks
// ​If status 'Ready For CO' is selected on Inspection Phase wf task, verify there are no Pending or Scheduled inspections and verify that there are no other workflow tasks active, 
// if there are then prevent the wf task from proceeding and present a message stating "There are pending or scheduled inspections or workflow tasks active, Inspection Phase workflow can't proceed.  
*/

logDebug("JMP JMP Alert: ------------------------>> Called Script Item #62 - 62_Building_Inspection_Check_Pending_Scheduled");

if(wfTask =="Inspection Phase" && wfStatus== "Ready For CO") 
{
  var inspResultObj = aa.inspection.getInspections(capId);
  if (inspResultObj.getSuccess()) 
  {
    inspList = inspResultObj.getOutput();
	for (xx in inspList) 
	{
	  var inspId = inspList[xx].getIdNumber();
	  
	  var inspResult = aa.inspection.getInspection(capId, inspId);	

      logDebug("JMP JMP Alert: ------------------------>> Called Script Item #62 - 62_Building_Inspection_Check_Pending_Scheduled  inspResult=" + inspResult + "");	  
		
	  if ("Pending".equals(inspResult))
	  {
	 
		showMessage = true;
		comment("<h2 style='background-color:rgb(255, 0, 0);'>WARNING - There are pending or scheduled inspections or workflow tasks active, Inspection Phase workflow can't proceed. </h2>");
		deactivateTask("Inspection Phase");
		cancel = true;
		
	  }
	  
	  if ("Scheduled".equals(inspResult))
	  {
	 
		showMessage = true;
		comment("<h2 style='background-color:rgb(255, 0, 0);'>WARNING - There are pending or scheduled inspections or workflow tasks active, Inspection Phase workflow can't proceed. </h2>");
		deactivateTask("Inspection Phase");
		cancel = true;
		
	  }
	}   
  }
}