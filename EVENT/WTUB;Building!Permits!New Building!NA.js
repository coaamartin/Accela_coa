/* JMP - 10/2/2018 - Script Item #71 - Certificate of Occupancy checked
  If Inspection Phase workflow task has the status of ‘Ready for CO’ verify the Info Field ‘Certificate of Occupancy’ is checked, 
  if it is unchecked then stop the workflow progression and give an error message that says “There is not a Certificate of Occupancy required on this record.
*/
   
include("71_Certificate_Occpancy_Checked");	

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

requireDataInSpecialInspections();



