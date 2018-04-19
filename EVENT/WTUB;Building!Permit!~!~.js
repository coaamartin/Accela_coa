/*
Title : Issue Permit Conditions (WorkflowTaskUpdateBefore) 

Purpose : check if parent of certain type exists, and has a certain capStatus, block workflow submit

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
	validateParentCapStatus([ "Issued" ], "Building/Permit/Master/NA", "Unapproved");
*/

validateParentCapStatus([ "Issued" ], "Building/Permit/Master/NA", "Unapproved");


//Sharepoint script ID 2 part 3
if(wfTask =="Permit Issuance" && wfStatus =="Issued" && balanceDue>0){
	
				cancel=true;
				showMessage=true;
				comment("All fees must be paid prior to issuance");
	
}