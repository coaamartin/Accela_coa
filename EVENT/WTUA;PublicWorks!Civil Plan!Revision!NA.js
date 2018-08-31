/*
Title : Civil Plans and Drainage update Submittal Number (WorkflowTaskUpdateAfter)

Purpose : Custom Field Submittal Number is to be incremented by 1 when workflow is updated

Author: Ali Othman
 
Functional Area : Workflow, Custom Fields

Sample Call:
	updateSubmittalNumber("Application Submittal", ["Complete", "Accepted"], "Submittal Number");
	
Notes:
    For record type Water/Utility/Master/Study, we don't have any custom field called Submittal Number
*/

updateSubmittalNumber("Completeness Check", ["Complete","Accepted"], "Submittal Number");

if (wfTask == "Quality Check" && wfStatus == "Route for Review"){
    //Script 192
    editWFTaskDueDateOnPlanReviewTimelines();
	//END Script 192
}