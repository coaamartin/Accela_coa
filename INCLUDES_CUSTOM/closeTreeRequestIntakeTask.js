/*
Title : Forestry Record Application Submission Actions (ApplicationSubmitAfter,ConvertToRealCapAfter)

Purpose : Actions that need to occur upon submission of a Forestry record of any kind. - Script 60 - User Story 5

Author: Ali Othman
 
Functional Area : Parcel, Inspections, Custom Fields, Address, Records

Sample Call:
   closeTreeRequestIntakeTask("Source of Request", "Tree Request Intake", ["Assigned"], "Proactive", "Inspection Phase");
   
Notes:
	
*/
function closeTreeRequestIntakeTask(customFieldName, workflowTask, workflowStatusArray, workflowComment, activateTaskName) {
    var sourceOfRequest = getAppSpecific(customFieldName, capId);
    if (typeof (sourceOfRequest) != "undefined" && sourceOfRequest != null && sourceOfRequest != "") {
        if (sourceOfRequest.toLowerCase() == "staff") {
            if (workflowStatusArray != null && workflowStatusArray.length > 0) {
                var workflowStatus;
                workflowStatus = workflowStatusArray[0];
                closeTask(workflowTask, workflowStatus, workflowComment, "");
                activateTask(activateTaskName);
            }
        }
    }
}