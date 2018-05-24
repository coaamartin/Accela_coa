/*
Title : Activate the workflow task when all documents are provided (DocumentUploadAfter)
 
Purpose : check uploaded documents vs Task TSI, and check app status, then activate a task

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
	checkDocumentsActivateTask("Pre Submittal Meetings", [ "Email Applicant", "Note" ], "Pre Submittal Meetings", "Incomplete Submittal");


checkDocumentsActivateTask("Pre Submittal Meetings", [ "Email Applicant", "Note" ], "Pre Submittal Meetings", "Incomplete Submittal");

*/