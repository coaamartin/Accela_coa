/* JMP - 11/5/2018 - Script Item #68 - 68_Workflow_Traffic_Review_Assign_People
// ​​If Info Field ‘Project Category’ has “Assembly Building”, “Business Use Building”, “Factory Use Building”, “Group E Building”, “Group U Building”, “Hotel Building”, 
// “Institutional Use Building”, “Mercantile Use Building”, “Non-Res Addition” or “Storage Use Building” selected, then the Traffic Review workflow task is assigned to Brianna Medema 
// instead of Lance Littleton
 
*/

logDebug("JMP JMP Alert: ------------------------>> Script Item #68 - 68_Workflow_Traffic_Review_Assign_People");

if(wfTask == "Traffic Review" && (!wfStatus == "Not Required")) 
{
  
  logDebug (AInfo["Project Category"] + "");

}