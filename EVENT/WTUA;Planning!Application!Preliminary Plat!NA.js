var $iTrc = ifTracer;
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

if($iTrc(wfTask == "Generate Hearing Results" && wfStatus == "Technical Submittal", 'wf:Generate Hearing Results/Technical Submittal')){
	plnScript284_activateTasks();
}

//Script 58

//setEAgendaDueDate("Generate Hearing Results", [ "Review Complete" ], "Complete E-Agenda", "City Council");

/*
Script 274
Record Types:	Planning/Application/Preliminary Plat/NA
				Planning/Application/Site Plan/Major
Desc:			Spec:  (from spec: 274) and tracker comments
Created By: Silver Lining Solutions
*/

if (ifTracer(wfTask == "Review Distribution" && wfStatus == "In Review", 'wf:Review Distribution/In Review')) {
    script274_WTUA_CalcReviewDueDatesAndPotentialPCHearingSchedule2()
}
