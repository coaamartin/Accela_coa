
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



