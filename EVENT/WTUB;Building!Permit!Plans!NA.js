/*
Title : Unapproved permit with plans (WorkflowTaskUpdateBefore) 

Purpose : Check for a wfTask and wfStatus, then check if parent record of certain type has a certain status

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
	checkWfAndParentBlockSubmit("Permit Issuance", [ "Issued" ], "Building/Permit/Master/NA", "Unapproved");

Notes:
	- Record type is 'BUILDING/PERMIT/PLAN(S)/NA' not Plan
*/

checkWfAndParentBlockSubmit("Permit Issuance", [ "Issued" ], "Building/Permit/Master/NA", "Unapproved");

/*------------------------------------------------------------------------------------------------------/
Title 		: Final CO Issued checks Special Inspections (WorkflowTaskUpdateBefore).

Purpose		: If workflow task = Certificate of Occupancy and workflow status = Final CO Issued then check that all Special
			inspectionCustom Fields have data in them. If any of the fields do not have data then block the progress of the workflow
			and display message that "the special inspection fields must have data".
			
Author :   Israa Ismail

Functional Area : Records 

Sample Call : checkSpecialInspections()
/------------------------------------------------------------------------------------------------------*/

//checkSpecialInspections();

/* Title :  Require Data in Special Inspections (WorkflowTaskUpdateBefore)

Purpose :  If workflow task "Special Inspection" and the workflow status is "Final" and check that all the custom fields in the custom
fields subgroup "SPECIAL INSPECTIONS" have data and if they do not all have data then prevent the workflow from
proceeding and show an error message "The following data is required" and show all the custom fields in the sub group
that do not have data.

Author :   Israa Ismail

Functional Area : Records 

Sample Call : requireDataInSpecialInspections()

Notes : 
	-The Status "FINAL" is not configured for the "Special Inspections Check" task ,accordingly  replace the "Report Received" with the corrct Status
	-The WTUA could not be used to prevent the workflow from proceeding , alternatively we use WTUB
*/
//Script 13
requireDataInSpecialInspections();

//Script 9

checkSpecialInspections();
