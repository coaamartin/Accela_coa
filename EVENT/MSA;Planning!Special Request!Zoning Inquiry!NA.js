/*
Title : Update Workflow Due Date with Zoning Inquiry Meeting Date and send email (MeetingScheduleAfter) 
Purpose : If certain meeting type was scheduled, update a Task status and due date, and send an email
Author: Yazan Barghouth 
Functional Area : Records

Sample Call:
	editTaskDatesAndSendEmail("Zoning Inquiry Meeting", "Tuesday Zoning Inquiry", "MESSAGE_NOTICE_PUBLIC WORKS");
	
Notes:
	make sure meeting type "Tuesday Zoning Inquiry" Meeting exist (configured), you can pass any type as parameter 'meetingType'

*/
//Script 32
editTaskDatesAndSendEmail("Zoning Inquiry Meeting", "TUESDAY ZONING INQUIRY", "PLN ZONING INQUIRY MEETING #32");