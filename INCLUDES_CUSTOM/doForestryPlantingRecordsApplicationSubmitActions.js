/*
Title : Forestry Record Application Submission Actions (ApplicationSubmitAfter,ConvertToRealCapAfter)

Purpose : Actions that need to occur upon submission of a Forestry record of any kind.

Author: Ali Othman
 
Functional Area : Parcel, Inspections, Custom Fields, Address, Records

Sample Call:
   doForestryPlantingRecordsApplicationSubmitActions("Forestry Site Review", "Tree Planting Intake", ["Add to List"], "Assigned status Plus Proactive", "Site Review","TREE INFORMATION");
   
Notes:
	
*/

function doForestryPlantingRecordsApplicationSubmitActions(inspectionTypeForestrySiteReview, workflowTask, workflowStatusArray, workflowComment, activateTaskName,treeInformaionCustomListName) {
   // scheduleForestryRequestPlantingSiteReview(inspectionTypeForestrySiteReview);
    closeTreePlantingIntakeTask(workflowTask, workflowStatusArray, workflowComment, activateTaskName);
    ////TODO:
    ///populateTreeInformationCustomList(treeInformaionCustomListName);
}




