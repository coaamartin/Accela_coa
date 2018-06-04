/*
Title : Auto Close Building Workflow (PaymentReceiveAfter) 

Purpose : check Balance, Update WfTasks and AppStatus

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
	autoCloseWorkflow();
	
Notes:
	- in specs: records with 2nd level='Permits', correct name is 'Permit'
	- for record "Building/Permit/Plans/NA" Task name is 'Special Inspection Check' not 'Special Inspection'
*/

autoCloseWorkflow();
script381_UpdatCustomFieldPermitExpirationDates();