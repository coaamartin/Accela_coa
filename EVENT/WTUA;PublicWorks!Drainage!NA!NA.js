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
