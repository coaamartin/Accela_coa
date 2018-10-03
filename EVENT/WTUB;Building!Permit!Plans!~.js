/*------------------------------------------------------------------------------------------------------/
Title 		: Final CO Issued checks Special Inspections (WorkflowTaskUpdateBefore).

Purpose		: If workflow task = Certificate of Occupancy and workflow status = Final CO Issued then check that all Special
			inspectionCustom Fields have data in them. If any of the fields do not have data then block the progress of the workflow
			and display message that "the special inspection fields must have data".
			
Author :   Israa Ismail

Functional Area : Records 

Sample Call : checkSpecialInspections()
/------------------------------------------------------------------------------------------------------*/

checkSpecialInspections();