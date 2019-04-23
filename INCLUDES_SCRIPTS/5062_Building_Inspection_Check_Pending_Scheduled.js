//************************************************ >>  62_Building_Inspection_Check_Pending_Scheduled.js  << ****************************
// SCRIPTNUMBER: 62
// SCRIPTFILENAME: 62_Building_Inspection_Check_Pending_Scheduled.js
// PURPOSE: ​If status 'Ready For CO' is selected on Inspection Phase wf task, verify there are no Pending or Scheduled inspections and verify that there are no other workflow tasks active, 
//          if there are then prevent the wf task from proceeding and present a message stating "There are pending or scheduled inspections or workflow tasks active, Inspection Phase workflow can't proceed.
// DATECREATED: 10/3/2018
// BY: JMPorter

//logDebug("JMPorter JMPorter Alert: ------------------------>> Called Script Item #62 - 62_Building_Inspection_Check_Pending_Scheduled");

if(wfTask =="Inspection Phase" && wfStatus== "Ready for CO") 
{
	
  logDebug("JMPorter JMPorter Alert: ------------------------>> Called Script Item #62 - 62_Building_Inspection_Check_Pending_Scheduled  within logic loop ");	  
  
  var inspResultObj = aa.inspection.getInspections(capId);
  var FoundStatus = false;
  
  if (inspResultObj.getSuccess()) 
  {
    var inspList = inspResultObj.getOutput();
	
	//jmain debug
	//var stuff = printObject(inspList);
	//logDebug(stuff);

	for (xx in inspList)
	{
	  //inspResult = "NadaJP" + "";
	  //inspId = inspList[xx].getIdNumber();
	  inspResult = inspList[xx].getInspectionStatus();
		
	  if ("Pending".equals(inspResult))
	  {
		FoundStatus = true;
	  }
	  
	  if ("Scheduled".equals(inspResult))
	  {
		FoundStatus = true;
	  }
	  
	}   
  }
  
  if (FoundStatus)
  {
	showMessage = true;
	comment("<h2 style='background-color:rgb(255, 0, 0);'>WARNING - There are pending or scheduled inspections or workflow tasks active, Inspection Phase workflow can't proceed. </h2>");
	deactivateTask("Inspection Phase");
	cancel = true;
  }
}