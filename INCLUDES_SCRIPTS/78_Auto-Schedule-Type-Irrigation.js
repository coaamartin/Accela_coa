/* JMP - 10/26/2018 - Script Item #78 - 78_Auto-Schedule-Type-Irrigation

// ​After Application for irrigation Permit is submitted, auto schedule the correct type of inspection depending on Type of Property dropdown selection.  
// If the Type of Property dropdown is set to Single Family Residential then schedule a Single Family Res Lawn/Irrigation Inspection as 
// Pending or if the Type of Property dropdown is other then schedule a Commercial Lawn/Irrigation Inspection as Pending.

*/

logDebug("JMP JMP Alert: ------------------------>> Script Item #78 - 78_Auto-Schedule-Type-Irrigation");

if(wfTask =="Application Submittal" && !wfStatus== "Withdrawn")     
{
   
   logDebug("Not withdrawn"); 
   
   /*
   
   var capInspections = aa.inspection.getInspections(capId);
	if (!capInspections.getSuccess()) 
   {
     if(AInfo['Type of Property'] == 'Single Family Residential') 
      {
			addFee('WAT_IP_01', 'WAT_IP', 'FINAL', 1, "Y");                
		} else {
			addFee('WAT_IP_02', 'WAT_IP', 'FINAL', 1, "Y");                
		}
)
     {   
     scheduleInspection("
     
     } 
     
     if(AInfo['Type of Property'] == 'Single Family Residential') {
			addFee('WAT_IP_01', 'WAT_IP', 'FINAL', 1, "Y");                
		} else {
			addFee('WAT_IP_02', 'WAT_IP', 'FINAL', 1, "Y");                
		}

  Check existing Inspections .. 
  
  Assign





  */

}

