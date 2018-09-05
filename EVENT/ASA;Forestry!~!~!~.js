
/*
Title : Forestry Record Application Submission Actions (ApplicationSubmitAfter,ConvertToRealCapAfter)
Purpose : Actions that need to occur upon submission of a Forestry record of any kind.  Script ID 60 - User Story 5
Author: Ali Othman 
Functional Area : Parcel, Inspections, Custom Fields, Address, Records
Sample Call:
   closeTreeRequestIntakeTask("Source of Request", "Tree Request Intake", ["Assigned"], "Proactive", "Inspection Phase");   
Notes:	
*/

closeTreeRequestIntakeTask("Source of Request", "Tree Request Intake", ["Assigned"], "Proactive", "Inspection Phase");

/*closeTreePlantingIntakeTask(workflowTask, workflowStatusArray, workflowComment, activateTaskName)
closeTreePlantingIntakeTask("Tree Planting Intake", ["Assigned"], "Proactive", "Inspection Phase") */

/*
Title : Forestry Record Application Submission Actions (ApplicationSubmitAfter,ConvertToRealCapAfter)

Purpose : Actions that need to occur upon submission of a Forestry record of any kind. Story 4, 6 

Author: Ali Othman
 
Functional Area : Parcel, Inspections, Custom Fields, Address, Records

Sample Call:
   doForestryRecordsApplicationSubmitActions("Forestry_Inspector_Assignments", "Tree Inspect", "Forestry Inspection");
   
Notes:
	
*/

//commented out due to diplicate functionality from Script 60
doForestryRecordsApplicationSubmitActions("Forestry_Inspector_Assignments", "Tree Inspect", "Forestry Inspection");

/*
Title : Forestry Record Application Submission Actions (ApplicationSubmitAfter,ConvertToRealCapAfter)

Purpose : Actions that need to occur upon submission of a Forestry record of any kind.  -- Story 2, 3

Author: Ali Othman
 
Functional Area : Parcel, Inspections, Custom Fields, Address, Records

Sample Call:
   doForestryPlantingRecordsApplicationSubmitActions("Forestry Site Review", "Tree Planting Intake", ["Add to List"], "Assigned status Plus Proactive", "Site Review","TREE INFORMATION");
   
Notes:
	
*/

doForestryPlantingRecordsApplicationSubmitActions("Forestry Site Review", "Tree Planting Intake", ["Add to List"], "Assigned status Plus Proactive", "Site Review","TREE INFORMATION");

//Start Script 60 - User story 3
//Record Type:
//Forestry/*/*/*
//Event:
//ApplicationSubmitAfter(Civic Platform) or ConvertToRealCapAfter (ACA)
//If criteria:
//On application submission
//Action:
//1. assigned to Forestry Inspector (update record detail Department and User) based on the Record Custom Field Area Number (form GIS or Parcel data) (See script 154 that is working and has the code for this - The layer is here: Database Connections\GISSQL.sde.layeruser.prod.sde\sde.PARKS.Forestry\sde.PARKS.ForestryIndexMapbookPoly).
//2. Update the Record Assigned To the appropriate forestry inspector
//3. If the record type Forestry/Request/Planting/* then schedule inspection type “Forestry Site Review” to the assigned person in the record assigned to.
//4. Take all the address fields that have data and concatenate into a string and update the Application Name field.
//5. If record type Forestry/Request/Citizen/* get value from Custom Field “Source of Request” if value is Staff then insert status of “Assigned” and add the comments “Proactive” in the comments on the workflow task “Tree Request Intake” and move the work flow task forward by Activating the workflow task “Inspection Phase”.
//6. If Record Type Forestry/Request/Citizen/NA or Forestry/Permit/Na/NA Create Scheduled inspection of type “Forestry Inspection” with the inspector assigned to the record assigned to with the current date. 
if (!publicUser) {
	include("60_ForestryInspectionAssignment");
}
//End Script 60 - User story 3


//Script 198
treeInventoryPopulate()