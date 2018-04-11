/* Title :  Create child water utility permit records (WorkflowTaskUpdateAfter)

Purpose :   If workflow task = “Fire Life Safety Review” and workflow status = “Approved” and the TSI field “Is there a private fire line” =
“Yes” and the custom field “Number of Fire Lines” > 0 then auto create a child Water Utility Permit record
(Water/Utility/Permit/NA) for each number listed in the TSI field “Number of Fire Lines” as a child of the
Building/Permit/New Building/NA or Building/Permit/Plan/NA. When creating these child records copy address, parcel,
owner and contact information. In addition set the custom field “Utility Permit Type” = “Private Fire Lines” On the Utility
Permit record.

Author :   Israa Ismail

Functional Area : Records
 
Record Types : Building/Permit/New Building/NA or Building/Permit/Plan/NA and
Water/Utility/Permit/NA

Sample Call : createChildWaterUtilityPermitRecords()

*/

createChildWaterUtilityPermitRecords();
script207_SetTotalSqFtOnFireRecord();
script206_DeactivateFEMA();

/*
Title : Calculate and assess Construction Building Fees (WorkflowTaskUpdateAfter) 

Purpose : For record type Building/Permit/New Building/NA fees are not assessed at intake so will need to be assessed on workflow
task update.

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
	calculateAndAssessConstructionBuildingFees("BLD_NEW_CON", [ "BLD_NEW_12", "BLD_NEW_14" ], "Quality Check", [ "Approved" ], "Fee Processing", [ "Ready to Pay" ]);

*/

calculateAndAssessConstructionBuildingFees("BLD_NEW_CON", [ "BLD_NEW_12", "BLD_NEW_14" ], "Quality Check", [ "Approved" ], "Fee Processing", [ "Ready to Pay" ]);

/*
Title : Activate workflow tasks (WorkflowTaskUpdateAfter) 

Purpose : Activate workflow tasks based on the Status of other Tasks

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
	activateWorkflowTasks();

Notes:
	- Workflow task names are not accurate (not as in config)
	- Use arrays reviewTasksAry and activeReviewTasksAry to edit and correct task names
*/

activateWorkflowTasks();
