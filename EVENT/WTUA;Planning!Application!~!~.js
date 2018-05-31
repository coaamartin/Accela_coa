/*
Title : Hearing Scheduled email and update hearing date field (WorkflowTaskUpdateAfter) 

Purpose : If the workflow task = Hearing Scheduling and workflow status = Scheduled 
then get the meeting type "Planning Commission" from the meeting tab and get the meeting date and then update
the Custom Field "Planning Commission Hearing Date".
In addition email the applicant that their hearing has been scheduled. Email template and content will be provided by Aurora.

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
	sendHearingScheduledEmailAndUpdateASI("Hearing Scheduling", [ "Scheduled" ], "Planning Commission", "Planning Commission Hearing Date", "MESSAGE_NOTICE_PUBLIC WORKS");
	
	Note:
		this script will abort if subType = "Address", requested in PDF:
		... Record Type: Planning/Application/{*}/{*} (except Planning/Application/Address/{*})
*/
if(!appMatch(("Planning/Application/Address/*"))){

sendHearingScheduledEmailAndUpdateASI("Hearing Scheduling", [ "Scheduled" ], "Planning Commission", "Planning Commission Hearing Date", "PLN PUBLIC HEARING EMAIL # 278");
}

/*
Title : Update Workflow Task for Traffic/ODA (WorkflowTaskUpdateAfter) 

Purpose : When Record Type Planning/Application/Master Plan/NA, Planning/Application/Preliminary Plat/NA, Planning/Application/Site
Plan/Major, Planning/Application/Site Plan/Minor Event: WorkflowTaskUpdateAfter If criteria: wfTask = Traffic Review and
Status = "Comments not Received" or "Resubmittal Requested" when the TSI field "Is a Traffic Impact Study Required?" =
yes (this is currently in the Accela change log) and there is not already a child Traffic Impact record Action: Then
automatically create a child PublicWorks/Traffic/Traffic Impact/NA record and copy all relevant information (Record
Application Name, Description, APO, Applicant and all Contacts on the record).

Author: Mohammed Deeb 
 
Functional Area : Workflow , Records
*/

createRecordAndCopyInfo([ "Planning/Application/Master Plan/NA", "Planning/Application/Preliminary Plat/NA", "Planning/Application/Site Plan/Major",
		"Planning/Application/Site Plan/Minor" ], "Traffic Review", [ "Comments Not Received", "Resubmittal Requested" ], "Is a Traffic Impact Study Required?",
		"PublicWorks/Traffic/Traffic Impact/NA");


/*
Title : Auto create Master Utility Study record (WorkflowTaskUpdateAfter) 

Purpose : Event WorkflowTaskUpdateAfter 
Criteria wfTask = Water Dept Review and wfTaskStatus = Resubmittal Requested or Complete or Comments Not Received 
and TSI Is a Master Utility Plan Required = Yes on Water Dept Review Task and there not a child Master Utility Study record already
-- this was modified according to the new specs
Author: Yazan Barghouth 
 
Functional Area : Records
Sample Call:
	autoCreateMasterUtilStudyApplication("Water Dept Review", [ "Comments Not Received", "Resubmittal Requested",  "Complete"], "Is a Master Utility Plan Required", "Water Dept Review",
		"Water/Utility/Master Utility/NA");
Notes:
	- child record type is "Water/Utility/Master Utility/Study" (Study not NA)
*/

autoCreateMasterUtilStudyApplication("Water Dept Review", [ "Comments Not Received", "Resubmittal Requested",  "Complete"], "Is a Master Utility Plan Required", "Water Dept Review",
		"Water/Utility/Master Utility/Study");

		
