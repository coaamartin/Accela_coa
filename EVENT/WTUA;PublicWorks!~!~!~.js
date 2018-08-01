/**ACCELA CIVIC PLATFORM TO CRM SCRIPTING LOGIC 
 * Workflow automation for all PUBLIC WORKS Records 
 * @namespace WTUA:PUBLICWORKS///
 * @requires INCLUDES_CRM
 */ 

//Retreive Enterprise CRM Function File
eval(getScriptText("INCLUDES_CRM", null, false));

logDebug("*** BEGIN process_WF_JSON_Rules for CRM (Public Works) ***");
// execute workflow propagation rules
process_WF_JSON_Rules(capId, wfTask, wfStatus);
logDebug("*** FINISH process_WF_JSON_Rules for CRM (Public Works) ***");

//Start Logic For Building Workflow Statuses that trigger when comments status updates are published to the shadow record which will push to CRM System
if (appMatch("PublicWorks/Traffic/Traffic Engineering Request/NA")) {

var parent = getParent();

if(parent){
	if(matches(wfStatus,"Accepted","Workorder Drafted","Generated","Assigned","Assigned to Supervisor","Draft Work Order")){

		createCapComment(wfComment,parent);
		updateAppStatus("In Progress","Updated via Script",parent);


	}

	if(matches(wfStatus,"Request Complete","Complete","Refer to Code Enforcement","No Change Warranted","Refer to Forestry","Completed","Approved","Denied")){

		createCapComment(wfComment,parent);
		updateAppStatus("Completed","Updated via Script",parent);

		}
	}
}