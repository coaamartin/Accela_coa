/* Title :  Update Assigned To User for Planning Records (WorkflowTaskUpdateAfter)

Purpose :   When a particular workflow task and workflow status is selected update the identified workflow task assigned to user using
the assigned to user on the record detail tab. NOTE - There is an extensive list of workflow tasks per record type so please
reference the attached word document that outlines when each workflow task is assigned following the Workflow
Task/Status trigger column.

Author :   Israa Ismail

Functional Area : Records
 
Sample Call : updateAssignedToUser()

*/
//Diabled by Don Bates until error can be resolved
//updateAssignedToUser();

/*
Title : Set E-Agenda Due Date (WorkflowTaskUpdateAfter) 

Purpose : When the workflow task 'Generate Hearing Results' has a status of 'Complete' then activate the workflow 
task 'Create E-Agenda' and set the workflow due date to 15 calendar days prior to the meeting type
(from the meetings tab) 'City Council'.

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
	setEAgendaDueDate("Generate Hearing Results", [ "Complete" ], "Create E-Agenda", "City Council");
	
Notes:
	Meeting 'City Council' was not found -could not be scheduled?!-, Script tested with 'Planning Commission' Meeting
*/

setEAgendaDueDate("Generate Hearing Results", [ "Complete" ], "Create E-Agenda", "City Council");
