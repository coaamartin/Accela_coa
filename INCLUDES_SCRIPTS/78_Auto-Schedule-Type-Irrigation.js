/* JMPorter - 10/26/2018 - Script Item #78 - 78_Auto-Schedule-Type-Irrigation

// ​After Application for irrigation Permit is submitted, auto schedule the correct type of inspection depending on Type of Property dropdown selection.  
// If the Type of Property dropdown is set to Single Family Residential then schedule a Single Family Res Lawn/Irrigation Inspection as 
// Pending or if the Type of Property dropdown is other then schedule a Commercial Lawn/Irrigation Inspection as Pending.

*/

if (appTypeResult == "Water/Water/Lawn Irrigation/Permit") 
{   

logDebug("JMPorter JMPorter Alert: ------------------------>> Script Item #78 - 78_Auto-Schedule-Type-Irrigation");

if(wfTask =="Application Submittal" && !wfStatus== "Withdrawn")     
{
   
   var inspectionExist = aa.inspection.getInspections(settings.capId);
	if (!inspectionExist.getSuccess()) 
   {
      
   
      if(AInfo['Type of Property'] == 'Single Family Residential') 
      {
         scheduleInspection("Single Family Res Lawn/Irrigation Inspection", dateAdd(null, 0));            
      } 
      
      else 
         
      {
         scheduleInspection("Commercial Lawn/Irrigation Inspection", dateAdd(null, 0));       
      }
      
   }
}
}
