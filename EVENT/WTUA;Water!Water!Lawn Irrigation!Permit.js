/*
Title : Update workflow task due date for postponed status (WorkflowTaskUpdateAfter)
Purpose : When the workflow status ="Postponed" then update the workflow due date of the current workflow task by 30 calendar
days.

Author: Haitham Eleisah

Functional Area : Records

Notes :

Sample Call:
UpdateworkFlowTaskDueDate("Note",30)
 */
 
 // Added 10-26-18 JMPorter
 include("78_Auto-Schedule-Type-Irrigation");

var workFlowTasktobeChecked = "Note";
var numberOfdayes = 30;
UpdateworkFlowTaskDueDate(workFlowTasktobeChecked, numberOfdayes);


//Scripts 193 is now fired from ASA, script 195 no longer needed
//script193_WatIrrigationAddInspFee();
//include("script195_ActivateFeeIrrPermit");

