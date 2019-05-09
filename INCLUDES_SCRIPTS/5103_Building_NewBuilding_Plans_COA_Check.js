// SCRIPTNUMBER: 5103
// SCRIPTFILENAME: 5103_Building_NewBuilding_Plans_COA_Check
// PURPOSE: Make sure final WF steaps for New Building & Permit with Plans record type have correctly passed WF Status
// DATECREATED: 05/08/2019
// BY: JMPorter

logDebug('Started script 5103_Building_NewBuilding_Plans_COA_Check');
var SetCancel = true;

if (wfStatus == "Final CO Issued") && (wfTask == "Certificate of Occupancy")
{
  var workflowResult = aa.workflow.getTasks(capId);
  wfObj = workflowResult.getOutput();
  
  if (SetCancel)
  {
   
   logDebug("Script 5103: WARNING - not all workflows have an acceptable status to allow Certificate of Occupancy");
   comment("<B><Font Color=RED>WARNING - not all workflows have an acceptable status to allow Certificate of Occupancy</Font></B>");
     
   cancel = true;
  }
  
}
logDebug('Ended script 5103_Building_NewBuilding_Plans_COA_Check');