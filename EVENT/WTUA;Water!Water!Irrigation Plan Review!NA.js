
// JMP TEST 101
//COA Script - Suhail
include("5036_autoCreateTempIrrigationPermit");
include("5034_emailResubmittalPlanReview");

/*
Title : Add Inspection Fee (WorkflowTaskUpdateAfter)

Purpose : check wfTask and wfStatus match, then add a Fee based on ASI value, and send email

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
	addInspectionFeeAndSendEmail("Application Submittal", [ "Plans Required" ], "Type of Project", "MESSAGE_NOTICE_PUBLIC WORKS", "WorkFlowTasksOverdue", rptParams);
	
Notes:
	- Record type: WATER/WATER/IRRIGATION PLAN REVIEW/NA
	- Email sent to Owner, CC Applicant: Applicant used as EmailTO if no owner on record
	- Fee WAT_IPLAN has one Fee Code only (WAT_IPLAN_01) it's used with different amounts (based on ASI)
*/

//Based on report fill report parameters here
var rptParams = aa.util.newHashtable();
rptParams.put("altID", cap.getCapModel().getAltID());

addInspectionFeeAndSendEmail("Application Submittal", [ "Plans Required" ], "Type of Project", "LIR REQUIRE IRRIGATION PLAN 191", "WorkFlowTasksOverdue", rptParams);
addInspectionFeeAndSendEmail("Plans Review", [ "Resubmittal Requested" ], "Type of Project", "LIR REQUIRE IRRIGATION PLAN 191", "WorkFlowTasksOverdue", rptParams);

//script 191
if ("Application Submittal".equals(wfTask) && "Plans Required".equals(wfStatus)) {
	deactivateTask("Fee Processing");
}

//SWAKIL
if ("Plan Review".equals(wfTask) && "Resubmittal Requested".equals(wfStatus)) {
	deactivateTask("Plan Review");
}
