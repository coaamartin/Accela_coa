/*
Title : Deactivate Pre Submittal Meeting Task and Email (WorkflowTaskUpdateAfter) 

Purpose : check WF task and status, deactivate a Task, and send email

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
	checkWorkflowDeactivateTaskAndSendEmail("Pre Submittal Meetings", [ "Email Applicant" ], "Pre Submittal Meetings", "test_yaz");
	
Notes:
	- Deep URL variable for email template $$recordDeepUrl$$
	- $$altID$$ is used for record#
*/

checkWorkflowDeactivateTaskAndSendEmail("Pre Submittal Meetings", [ "Email Applicant" ], "Pre Submittal Meetings", "PLN PRE SUBMITTAL MEETING #253");
