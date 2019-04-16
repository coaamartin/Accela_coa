/* JMPorter - 10/26/2018 - Script Item #73 - Inspection_Leftover 

// If status of 'Leftover' on any scheduled inspection, then automatically schedule the same inspection for the next business day.
 
*/

logDebug("JMPorter JMPorter Alert: ------------------------>> Script Item #73 - Inspection_Leftover");


if (inspResult == "Left Over")
{
  aa.inspection.scheduleInspection(capId, null, aa.date.parseDate(dateAdd(null, 1, true)), null, inspType + "", null); 
  logDebug("JMPorter JMPorter Alert: ------------------------>> Script Item #73 - OK working with current Leftover ... Scheduled New Inspection type and not replicate = " + inspType + "");  
}  
 
/* 
var inspections = aa.inspection.getInspections(capId);
if (inspections.getSuccess()) 
{
   inspections = inspections.getOutput();
	for (i in inspections) 
   {
	   var thisInspection = inspections[i];
  	   if (thisInspection.getInspectionStatus() == "Left Over") 
      {
        logDebug("JMPorter JMPorter Alert: ------------------------>> Script Item #73 - OK I found a Leftover");
        //createInspection(thisInspection.getInspectionType() + "",  aa.date.parseDate(dateAdd(null, 1, true)));
        aa.inspection.scheduleInspection(capId, null, aa.date.parseDate(dateAdd(null, 1, true)), null, thisInspection.getInspectionType() + "", null);
      }
   }
}
*/

