/**ACCELA CIVIC PLATFORM TO CRM SCRIPTING LOGIC 
 * Workflow automation for all FORESTRY Records 
 * @namespace WTUA:FORESTRY///
 * @requires INCLUDES_CRM
 */ 

//Retreive Enterprise CRM Function File
eval(getScriptText("INCLUDES_CRM", null, false));

logDebug("*** BEGIN process_WF_JSON_Rules for CRM (FORESTRY) ***");
// execute workflow propagation rules
process_WF_JSON_Rules(capId, wfTask, wfStatus);
logDebug("*** FINISH process_WF_JSON_Rules for CRM (FORESTRY) ***");
