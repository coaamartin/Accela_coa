/*
Title : Forestry Record Application Submission Actions (ApplicationSubmitAfter,ConvertToRealCapAfter)

Purpose : Actions that need to occur upon submission of a Forestry record of any kind.

Author: Ali Othman
 
Functional Area : Parcel, Inspections, Custom Fields, Address, Records

Sample Call:
   doForestryRecordsApplicationSubmitActions("Forestry_Inspector_Assignments", "Tree Inspect", "Forestry Inspection");
   
Notes:
	
*/


function doForestryRecordsApplicationSubmitActions(stdForestryInspectorAssignments, inspectionGroupCode, inspectionTypeForestryInspection) {
    getPrimaryParcelAttributesAndUpdateCustomField(stdForestryInspectorAssignments);
    updateApplicationNameWithAddressInfo();
    //commented out due to duplicate functionality from Script 60
	//createAndAssignPendingInspection(inspectionGroupCode, inspectionTypeForestryInspection);
}










