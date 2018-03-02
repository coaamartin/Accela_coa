/*
Title : Remove Master Plan from Shared Drop Down List (ApplicationStatusUpdateAfter) 

Purpose : If application status = Unapproved or Withdrawn then delete the row in the shared Drop-down list called
“BLD_CODE_REF” which is used by custom field “Code Reference” where the value is equal to Application name field

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
	removeMasterPlanDataFromShrdDDList([ "Unapproved", "Withdrawn" ], "BLD_CODE_REF");

Notes:
	- could not find delete for standard-choice, used INACTIVE instead
*/

removeMasterPlanDataFromShrdDDList([ "Unapproved", "Withdrawn" ], "BLD_CODE_REF");
