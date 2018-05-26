/*
Title : Forestry Record Application Submission Actions (ApplicationSubmitAfter,ConvertToRealCapAfter)

Purpose : Actions that need to occur upon submission of a Forestry record of any kind. - Script 60 - User Story 2

Author: Ali Othman
 
Functional Area : Parcel, Inspections, Custom Fields, Address, Records

Sample Call:
   closeTreeRequestIntakeTask("Source of Request", "Tree Request Intake", ["Assigned"], "Proactive", "Inspection Phase");
   
Notes:
	
*/
function closeTreePlantingIntakeTask(workflowTask, workflowStatusArray, workflowComment, activateTaskName) {
    if (workflowStatusArray != null && workflowStatusArray.length > 0) {
        var workflowStatus;
        workflowStatus = workflowStatusArray[0];
        closeTask(workflowTask, workflowStatus, workflowComment, "");
        activateTask(activateTaskName);
    }
}