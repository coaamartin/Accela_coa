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
