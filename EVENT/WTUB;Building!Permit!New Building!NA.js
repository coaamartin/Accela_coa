/* JMP - 10/2/2018 - Script Item #71 - Certificate of Occupancy checked
  If Inspection Phase workflow task has the status of ‘Ready for CO’ verify the Info Field ‘Certificate of Occupancy’ is checked, 
  if it is unchecked then stop the workflow progression and give an error message that says “There is not a Certificate of Occupancy required on this record.
    if it is unchecked then stop the workflow progression and give an error message that says “There is not a Certificate of Occupancy required on this record.
		  
   JMP - 10/3/2018 - Script Item #62 - Prevent Ready for CO if inspections pending or scheduled or active other wf tasks
  If status 'Ready For CO' is selected on Inspection Phase wf task, verify there are no Pending or Scheduled inspections and verify that there are no other workflow tasks active, 
  if there are then prevent the wf task from proceeding and present a message stating "There are pending or scheduled inspections or workflow tasks active, Inspection Phase workflow can't proceed.
  
   JMP - Changed order of scripts as requirements for #52 & # 70 overlap and believe 70 will catch letter discrepancy quicker
*/

include("70_Inspection_Phase_Letters");      
include("63_Inspection_Phase_Water_Meter"); 
include("71_Certificate_Occpancy_Checked");	
include("62_Building_Inspection_Check_Pending_Scheduled");

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
if (wfTask == "Certificate of Occupancy" && wfStatus == "Final CO Issued")
		{
		checkSpecialInspections();
		}


//COA Script #48 added by SWAKIL
include("48_RequiredFieldsQualityCheck");