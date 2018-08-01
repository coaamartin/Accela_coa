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

//Start Logic For Building Workflow Statuses that trigger when comments status updates are published to the shadow record which will push to CRM System
if (appMatch("Forestry/Permit/NA/NA")||appMatch("Forestry/Request/Citizen/NA")||appMatch("Forestry/Request/Planting/NA")) {

var parent = getParent();
if(parent){
	if(matches(wfStatus,"Incomplete","Removal","No Replant","Replant","Assigned","No Plant","Returned to Sender","Vacant Property","Plant Tree","Plant","Add to List")){

		createCapComment(wfComment,parent);
		updateAppStatus("In Progress","Updated via Script",parent);


	}

	if(matches(wfStatus,"Complete","Issued","Owner Denied","Duplicate","Complete Staked","Complete Not Staked","Remove from List")){

		createCapComment(wfComment,parent);
		updateAppStatus("Completed","Updated via Script",parent);


		}
	}
}
