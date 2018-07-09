// Scipt 39 - When Record status is Submit Application and a document is uploaded in ACA then 
//Activate the Real Property Pre Acceptance and Planning pre Acceptance tasks with a start date of Today and due date of 2 working days. Also update the record status to Submitted

if(capStatus=="Submit Application") 
 {  
	activateTask("Real Property Pre Acceptance");
	editTaskDueDate("Real Property Pre Acceptance",dateAdd(null, 2));
	activateTask("Planning pre Acceptance");
	editTaskDueDate("Planning pre Acceptance",dateAdd(null, 2));
	updateAppStatus("Submitted",null);
}

//Script 254
/*
Title : Activate the workflow task when all documents are provided (DocumentUploadAfter) 
Purpose : check uploaded documents vs Task TSI, and check app status, then activate a task
Author: Yazan Barghouth  
Functional Area : Records
*/

checkDocumentsActivateTask("Pre Submittal Meetings", [ "Email Applicant", "Note" ], "Pre Submittal Meetings", "Incomplete Submittal");
