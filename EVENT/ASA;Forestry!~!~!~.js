/*
Script ID-71:
Emmett T. Wylam 
User Story 1
Update the custom field “Area Number” with the following format from the parcel marked as primary:
Township + Range + 0 + Section
GIS Definitions are as follows:
Township = “Parcel Layer; City Limits; Attribute: JURISDICTION”
Range =  “Parcel Layer; City Limits; Attribute: Shape.STArea() & Shape.StLength();
Section = “Parcel Layer; City Limits; Attribute: Shape_Area;


try {
	if (!publicUser) {
		// Get GIS Information
		var vTownship = getGISInfoArray("AURORACO", "Parcels", "PARCEL_JURISDICTION");
		var vRange = getGISInfoArray("AURORACO", "Parcels", "SHAPE.area");
		var vSection = getGISInfoArray("AURORACO", "Parcels", "SHAPE.len");
		var vArea;
		//  Assume only one return
		if (vTownship.length > 0 && vRange.length > 0 && vSection.length > 0) {
			// Format Data
			vArea = vTownship[0] + vRange[0] + "0" + vSection[0];
			logDebug("Area: " + vArea);
			//Save to ASI field
			editAppSpecific("Area Number", vArea); 
		}
	}

} catch (err) {
	logDebug("A JavaScript Error occurred: ASA:Forestry/*/*/*: Script 71: " + err.message);
	logDebug(err.stack)
};
 */
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



