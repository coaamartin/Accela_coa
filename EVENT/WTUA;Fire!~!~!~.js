// WTUA:Fire/*/*/*

// moving to WTUB
//checkRecordAssignedUser();

/*
Title : Assign inspection Task (WorkflowTaskUpdateAfter) 

Purpose : Check WfTasks and WfStatuses, if matched, Activate and Assign a task to the user identified on the Record tab

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
	activateAndAssignWfTask([ "Assign Complaint", "Assign Inspection" ], [ "Complete" ], "Inspection");
	
Notes:
	- for assure WF-Task will be usable in all situation, setCompleteFlag=N added to script
*/

activateAndAssignWfTask([ "Assign Complaint", "Assign Inspection" ], [ "Complete" ], "Inspection");

/**ACCELA CIVIC PLATFORM TO CRM SCRIPTING LOGIC 
 * Workflow automation for all FIRE Records 
 * @namespace WTUA:FIRE///
 * @requires INCLUDES_CRM
 */ 

//Retreive Enterprise CRM Function File
eval(getScriptText("INCLUDES_CRM", null, false));

logDebug("*** BEGIN process_WF_JSON_Rules for CRM (FIRE) ***");
// execute workflow propagation rules
process_WF_JSON_Rules(capId, wfTask, wfStatus);
logDebug("*** FINISH process_WF_JSON_Rules for CRM (Fire) ***");

//Retreive Custom CRM Logic File
includesCrmCustomWorkflowRules();