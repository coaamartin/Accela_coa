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

var workFlowTasktobeChecked = "Note";
var numberOfdayes = 30;
UpdateworkFlowTaskDueDate(workFlowTasktobeChecked, numberOfdayes);


script193_WatIrrigationAddInspFee();

script195_ActivateFeeIrrPermit();
