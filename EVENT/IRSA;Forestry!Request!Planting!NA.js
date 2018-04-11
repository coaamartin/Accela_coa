/* Title :  Update workflow, add inspection and create new record (InspectionResultSubmitBefore)

Purpose :   If the Non-warranty Inspection has an inspection result = Passed then deactivate any remaining workflow tasks. If the
inspection result = "Failed" then auto create the inspection type "Tree Removal" and Auto create child record
Forestry/Request/Planting/NA and enter "Staff" in Custom Field "Source of Request" and update the workflow task = "Tree
Planting Intake" with the workflow status = "Add to List" and activate the workflow task = "Site Review".

Author :   Israa Ismail

Functional Area : Records
 
Notes : If inspResult=="Failed" , Assumed that : enter "Staff" in Custom Field "Source of Request" and update the workflow task = "Tree
Planting Intake" with the workflow status = "Add to List" and activate the workflow task = "Site Review" must be done on the Child Record
,if it must be done on the Parent record please use the function activateTask and remove the ChildCapId from all functions calls (updateTask,editAppSpecific).

Sample Call : UpdateWFAddInspAndCreateNewRecord()

*/

UpdateWFAddInspAndCreateNewRecord();

/*
Title : Stump Grind Inspection Scheduling (InspectionResultSubmitAfter) 

Purpose : schedule other inspections based on inspection type / result and ASI field value

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
	stumpGrindInspectionScheduling("Non-warranty Inspection", [ "Passed" ], "Grind Stump", "Priority 1 Stump Grind", "Priority 1 Stump Grind", "Priority 2 Stump Grind","FORESTRY>NA>NA>NA>NA>FT_FC");
	
Notes:
	- Inspection correct result is Passed (Complete not found)
*/

stumpGrindInspectionScheduling("Non-warranty Inspection", [ "Passed" ], "Grind Stump", "Priority 1 Stump Grind", "Priority 1 Stump Grind", "Priority 2 Stump Grind","FORESTRY/NA/NA/NA/NA/FT_FC");
