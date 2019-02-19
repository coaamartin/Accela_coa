// SCRIPTNUMBER: 5084
// SCRIPTFILENAME: 5084_Irrigation_Inspection_Pending.js
// PURPOSE: Called when custom field "Type of Property" = "Other" OR "Single Family Residential"
// DATECREATED: 02/19/2019
// BY: JMP 
// CHANGELOG: 

logDebug("Script 5084_Irrigation_Inspection_Pending - Started");

var inspGroup = "WAT_LI";
var inspType = "Single Family Res Lawn/Irrigation Inspection";

if (appTypeResult == "Water/Water/Lawn Irrigation/Permit") {
   
   logDebug ("Script 5084 - Creating Pending Inspection");   
   createPendingInspection(inspGroup, inspType + "");
  	
}
  
  // createPendingInspection(inspGroup, inspType + "");
  
  // logDebug("JMP JMP Alert: ------------------------>> Script Item #72 - OK working with Inspection type Failed/Passed/Cancelled " + inspResult + "");  

 


