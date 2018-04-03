/*COA Script - Suhail
Criteria   Inspection = ECKO Initial Inspection and result = Fail   
Action   Auto send email with inspection comments included to applicant (need email template) 
(Need to know if schedule another inspection or will Applicant schedule in ACA from COA Water staff)  
Or 
Criteria  Inspection = ECKO Initial Inspection and result = Passed  
Action  Schedule a Routine Inspection in child SWMP Permit record (SWMP Permit Inspection group) for 30 business days 
to the same Inspector who did this status and set the record status to closed
*/
include("12_SWMPPermitScheduleRoutine");