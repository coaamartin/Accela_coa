/*
Title : Prevent License Issuance until Inspections are completed (WorkflowTaskUpdateBefore) 

Purpose : Event WorflowUpdateBefore Criteria wfTask = License Issuance and Status = Issued Action check that all Scheduled
Inspections are done, if not raise error message.

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
	checkInspectionsAndPreventLicenseIssuance("License Issuance", [ "Issued" ]);
*/

checkInspectionsAndPreventLicenseIssuance("License Issuance", [ "Issued" ]);


//SW ID 8
include("9_allInspectionsResultedWF");
