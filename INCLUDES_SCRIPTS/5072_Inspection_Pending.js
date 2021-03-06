/* JMPorter - 10/26/2018 - Script Item #5072 - Inspection_Pending

//   If status of ‘Failed’, ‘Passed’ or ‘Cancelled’ on any scheduled inspection, then auto create that same inspection type and make it ‘Pending’ 
     this applies to all inspection types. Example – if a Mechanical Rough inspection type is given a status of ‘Failed’ then auto create another Mechanical Rough inspection type as Pending.
 
 
*/

logDebug("JMPorter JMPorter Alert: ------------------------>> Script Item #5072 - Inspection Type Failed/Passed/Cancelled");

var inspGroup = "BLD_NEW_CON";

if ((inspResult == "Failed") || (inspResult == "Passed") || (inspResult == "Cancelled"))
{   
  createPendingInspection(inspGroup, inspType + "");
  
  logDebug("JMPorter JMPorter Alert: ------------------------>> Script Item #5072 - OK working with Inspection type Failed/Passed/Cancelled " + inspResult + "");  
}  
 


