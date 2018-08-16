function includesCrmCustomWorkflowRules(){

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


}