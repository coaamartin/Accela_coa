//COA Script - Suhail
include("36_autoCreateTempIrrigationPermit");
include("34_emailResubmittalPlanReview");

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

addInspectionFeeAndSendEmail("Application Submittal", [ "Plans Required" ], "Type of Project", "WAT_IRRIGATION PLAN REVIEW INVOICED #193", "WorkFlowTasksOverdue", rptParams);
