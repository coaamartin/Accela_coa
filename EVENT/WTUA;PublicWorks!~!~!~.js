/**
 * Workflow automation for all Public Works
 * @namespace WTUA:Public Works///
 * @requires INCLUDES_CRM
 */

eval(getScriptText("INCLUDES_CRM", null, false));

logDebug("*** BEGIN process_WF_JSON_Rules for CRM (Public Works) ***");
// execute workflow propagation rules
process_WF_JSON_Rules(capId, wfTask, wfStatus);
logDebug("*** FINISH process_WF_JSON_Rules for CRM (Public Works) ***");

if (appMatch("PublicWorks/Traffic/Traffic Engineering Request/NA")) {

var parent = getParent();
if(matches(wfStatus,"Accepted","Workorder Drafted","Generated","Assigned","Assigned to Supervisor","Draft Work Order")){

createCapComment(wfComment,parent);
updateAppStatus("In Progress","Updated via Script",parent);


}

if(matches(wfStatus,"Request Complete","Complete","Refer to Code Enforcement","No Change Warranted","Refer to Forestry","Completed","Approved","Denied")){

createCapComment(wfComment,parent);
updateAppStatus("Completed","Updated via Script",parent);


}
}