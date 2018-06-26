/* Title :  Auto Create Irrigation Plan Record (WorkflowTaskUpdateAfter)

Purpose :  On PublicWorks/Civil Plans/Review/NA record if wfTask "Water Review" has a wfStatus of "Signature Set Requested" and
TSI field Field Irrigation Plan Required = Yes then auto create child Water/Irrigation Plan/NA/NA record with Address,
Parcel, Contacts.

Author :   Israa Ismail

Functional Area : Records 

Sample Call : AutoCreateIrrigationPlanRecord()

Notes : 
	-The specified child record found on the environment is : "Water/Water/Irrigation Plan Review/NA" not  "Water/Irrigation Plan/NA/NA"
*/

AutoCreateIrrigationPlanRecord();

/*
Title : Auto Create Temp SWMP Application record from Civil Plans (WorkflowTaskUpdateAfter) 
Purpose : create temp record (as child) copy some data from parent IF wfstatus/task and asiField matches criteria

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
	autoCreateTempSWMPApplication("Plans Coordination", [ "Approved" ], "Erosion (SWMP) Report", "Water/Water/SWMP/Application");
*/

autoCreateTempSWMPApplication("Plans Coordination", [ "Approved" ], "Erosion (SWMP) Report", "Water/Water/SWMP/Application", "SWMP REQUIRES STORMWATER PERMIT # 101");

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


