script224_ActivatePlanningSupervisorReview();
script133_AutoCreateTraffic();

//COA - JMAIN
include("38_ODAPreApplicationMeetingAgenda");

//COA - JMAIN
include("4_odaPlanningSupervisorReviewAssigned");

//
/*
Title : Send Meeting Confirmation Email (WorkflowTaskUpdateAfter) 
Purpose : check if workflow task/status matches, send email to multiple parties.
Author: Yazan Barghouth  
Functional Area : Records
Sample Call:
    sendMeetingConfirmationEmail("Finalize Agenda", [ "Complete" ], "MESSAGE_NOTICE_PUBLIC WORKS");
*/

sendMeetingConfirmationEmail("Finalize Agenda", [ "Complete" ], "ODA FINALIZE AGENDA #222");

if(ifTracer(wfTask == "Prepare Final Letter" && wfStatus == "Complete", 'wf:Prepare Final Letter/Complete')){
    //Script 225
    odaScript225_emailMeetingNotes();
}

if(ifTracer(wfTask == "Pre App Meeting Request" && wfStatus == "Scheduled", 'wf:Pre App Meeting Request/Scheduled')){
    //Script 221
    activateTask("Pre Application Meeting");
}