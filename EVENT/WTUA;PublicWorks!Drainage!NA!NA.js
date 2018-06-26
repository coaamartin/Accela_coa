var $iTrc = ifTracer;
/*------------------------------------------------------------------------------------------------------/
Title 		: Set workflow due date based on plan review timelines(WorkflowTaskUpdateAfter).

Purpose		:When the workflow task = "Quality Check" and the workflow status = "Route for Review" then take the value from the
		custom field "Submittal Number" and perform a lookup on the standard choice "Civil Construction Plan Review Timelines"
		and use the value returned and update the workflow due date on every task that has the string "review" in the workflow task
		name. NOTE – Table of the # of review days based on submittal will be provided by Aurora.
			
Author :   Israa Ismail

Functional Area : Records 

Sample Call : editWFTaskDueDateOnPlanReviewTimelines()

Notes		: The Standard choice "Civil Construction Plan Review Timelines" must be provided by Aurora
			  For Now ,the number of workflow due days is not available , alternatively use 0 days 
/------------------------------------------------------------------------------------------------------*/
editWFTaskDueDateOnPlanReviewTimelines();

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



// per customer direction during script testing, it was determined that this functionality should 
// be completed on task 'Completeness Check' and status 'Complete'
updateSubmittalNumber("Completeness Check", ["Complete"], "Submittal Number");

if($iTrc(wfTask == "Plans Coordination" && wfStatus == "Resubmittal Requested", 'wfTask == "Plans Coordination" && wfStatus == "Resubmittal Requested"')){
	//Script 125
	deactivateTask("Completeness Check");
}

if($iTrc(wfTask == "Plans Coordination" && wfStatus == "SS Requested", 'wfTask == "Plans Coordination" && wfStatus == "SS Requested"')){
	//Script 125
	deactivateTask("Completeness Check");
}

if($iTrc(wfTask == "Completeness Check" && wfStatus == "Incomplete", 'wfTask == "Completeness Check" && wfStatus == "Incomplete"')){
	//Script 125
	deactivateTask("Completeness Check");
}