
//COA Script #48 added by SWAKIL
include("48_RequiredFieldsQualityCheck");

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

