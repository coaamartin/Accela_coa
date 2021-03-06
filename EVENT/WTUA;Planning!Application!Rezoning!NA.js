 logDebug("Script 58 Starting");
if (ifTracer(wfTask == "Generate Hearing Results" && wfStatus == "Complete", 'wfTask == "Generate Hearing Results" && wfStatus == "Complete"')) {
    include("58_SetEAgendaDueDate");
}
  


/*
Title : Set Rezoning Expiration Date (WorkflowTaskUpdateAfter) 

Purpose : When the workflow task "City Council Meeting" has a status of "Approved" then update the expiration date to 5 years from
the current date.

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
	calculateAndUpdateRezoningExpirationDate("City Council Meeting", [ "Approved" ], "Expiration Date", 5);
	
Notes:
	- used ASI 'Expiration Date'
*/

calculateAndUpdateRezoningExpirationDate("City Council Meeting", [ "Approved" ], "Expiration Date", 5);

/* Title :  Send Notice - PC email (WorkflowTaskUpdateAfter)

Purpose :  If workflow task = "Prepare Signs" AND workflow task "Notice - PC" both have a workflow status of "Complete" then email
the Applicant and cc Developer and cc the Case Manager (email from user is the Assigned Staff in Record detail), include
workflow comments. (need email wording from Aurora). Email also needs a form attached for the Applicant to fill out(Aurora
will determine the report).

Author :   Israa Ismail

Functional Area : Records 

Sample Call : sendNoticePCEmail()

Notes : 
		  1-Report name and parameters are not provided, they are handled below in reportName(sample:"WorkFlowTasksOverdue"),rptParams.put...
		  2-Email Template Name is not provided, sample template Name : "MESSAGE_NOTICE_PLANNING"
		  3-The provided wfTasks is not found alternatively wfTask "Prepare Signs and Notice - PC" is used
		  4-Please apply the script on these record types :"PLANNING/APPLICATION/ Conditional Use/NA","PLANNING/APPLICATION/PRELIMINARY PLAT/NA"
		    "PLANNING/APPLICATION/MASTER PLAN/*","PLANNING/APPLICATION/REZONING/NA","PLANNING/APPLICATION/SITE PLAN/*"
*/
sendNoticePCEmail();

//Script 58

//setEAgendaDueDate("Generate Hearing Results", [ "Complete" ], "Complete E-Agenda", "City Council");

/*
Script 277
Record Types:	​Planning/Application/Conditional Use/NA 
				Planning/Application/Rezoning/NA 
				Planning/Application/Site Plan/Major
				Planning/Application/​​Site Plan/Amendment

Desc:			see Script Tracker for script 277

Created By: Silver Lining Solutions
*/
logDebug("START of script277_WTUA_Assign Case Manager to Hearing Scheduled.");
if (wfTask == "Review Consolidation" && (wfStatus == "Review Complete" || wfStatus == "Ready for Planning Commission"))
{
	logDebug("script277_Match on task/status");
	// get Record assigned staff 
	var assignedStaff = getAssignedStaff();
	logDebug("script277 assignedstaff =" + assignedStaff);
	assignTask("Hearing Scheduling",assignedStaff);
	
	logDebug("**script277 preparing email**");
	
    // Get the Applicant's email
	var recordApplicant = getContactByType("Applicant", capId);
	var applicantEmail = null;
	if (!recordApplicant || recordApplicant.getEmail() == null || recordApplicant.getEmail() == "") {
		logDebug("**WARN no applicant or applicant has no email, capId=" + capId);
	} else {
		applicantEmail = recordApplicant.getEmail();
	}
	
	// Get the Case Manager's email
	var caseManagerEmail=getAssignedStaffEmail();
	var caseManagerPhone=getAssignedStaffPhone();
	
	var cc="";
	
	if (isBlankOrNull(caseManagerEmail)==false){
		if (cc!=""){
			cc+= ";" +caseManagerEmail;
		}else{
			cc=caseManagerEmail;
		}
	}	
	// send an email to the applicant - we're waiting on the actual template here.
	var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
	
	var emailParameters = aa.util.newHashtable();
	addParameter(emailParameters, "$$altID$$", cap.getCapModel().getAltID());
	addParameter(emailParameters, "$$recordAlias$$", cap.getCapType().getAlias());
	addParameter(emailParameters, "$$StaffPhone$$", caseManagerPhone);
	addParameter(emailParameters, "$$StaffEmail$$", caseManagerEmail);
	addParameter(emailParameters, "$$applicantFirstName$$", recordApplicant.getFirstName());
	addParameter(emailParameters, "$$applicantLastName$$", recordApplicant.getLastName());
	var reportFile = [];
	
	var sendResult = sendNotification("noreply@aurora.gov",applicantEmail,"","PLN HEARING SCHEDULED # 277",emailParameters,reportFile,capID4Email);
	if (!sendResult) 
		{ logDebug("UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
	else
		{ logDebug("Sent Notification"); }	
}
logDebug("END of script277_WTUA_Assign Case Manager to Hearing Scheduled.");

/*
Script 275
Record Types:	Planning/Application/Master Plan/NA
				Planning/Application/Rezoning/NA
Desc:			Spec:  (from spec: 275) and tracker comments
Created By: Silver Lining Solutions

removed per instructions on 7/18 - this functionality remains for the Master Plan
*/

/*
Script 273
Record Types:		Planning/Application/Site Plan/Amendment
			Planning/Application/Conditional Use/NA 
			Planning/Application/Site Plan/Minor
Desc:			Spec:  (from spec: 273/Script-273-version3.pdf) and tracker comments

Created By: Silver Lining Solutions
*/

if (wfTask == "Review Distribution" && wfStatus == "In Review") {
    if(countOfTaskStatus("Review Distribution", "In Review") > 1) script273_WTUA_CalcReviewDueDatesAndPotentialPCHearingSchedule();
}