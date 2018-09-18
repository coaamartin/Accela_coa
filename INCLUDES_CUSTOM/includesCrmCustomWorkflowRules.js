function includesCrmCustomWorkflowRules(){

//START FORESTRY RECORD WORKFLOW CRM LOGIC

//Start Logic For Building Workflow Statuses that trigger when comments status updates are published to the shadow record which will push to CRM System
if (appMatch("Forestry/Permit/NA/NA")||appMatch("Forestry/Request/Citizen/NA")||appMatch("Forestry/Request/Planting/NA")) {

var parent = getParent();
if(parent){
	if(matches(wfStatus,"Incomplete","Removal","No Replant","Replant","Assigned","No Plant","Returned to Sender","Vacant Property","Plant Tree","Plant","Add to List")){

		createCapComment(wfComment,parent);
		updateAppStatus("In Progress","Updated via Script",parent);
		createCapComment(wfComment);


	}

	if(matches(wfStatus,"Complete","Issued","Owner Denied","Duplicate","Complete Staked","Complete Not Staked","Remove from List")){

		createCapComment(wfComment,parent);
		updateAppStatus("Completed","Updated via Script",parent);
		createCapComment(wfComment);

		}
	}
}

//END FORESTRY RECORD WORKFLOW CRM LOGIC

//START BUILDING RECORD WORKFLOW CRM LOGIC

//Start Logic For Building Workflow Statuses that trigger when comments status updates are published to the shadow record which will push to CRM System
if (appMatch("Building/Enforcement/Notice of Violation/NA")) {
    var parent = getParent();
    if(parent){
        if(matches(wfStatus,"Fire Call","Assigned","In Progress","Extension","Issue Summons","Notice of Violation","Third Notice","First Notice","Second Notice","Non Compliance")){
            createCapComment(wfComment,parent);
            updateAppStatus("In Progress","Updated via Script",parent);
			createCapComment(wfComment);
        }
        
        if(matches(wfStatus,"Duplicate","Referred","Complete","Reasign to another Division","No Violation Observed","Compliance")){
            createCapComment(wfComment,parent);
            updateAppStatus("Completed","Updated via Script",parent);
			createCapComment(wfComment);
        }
    }
}

//END BUILDING RECORD WORKFLOW CRM LOGIC

//START ENFORCEMENT RECORD WORKFLOW CRM LOGIC

//Start Logic For Building Workflow Statuses that trigger when comments status updates are published to the shadow record which will push to CRM System
if (appMatch("Enforcement/Incident/Abatement/NA")||appMatch("Enforcement/Incident/Summons/NA")||appMatch("Enforcement/Housing/Inspection/NA")||appMatch("Enforcement/Incident/Informational/NA")||appMatch("Enforcement/Neighborhood/NA/NA")||appMatch("Enforcement/Incident/Record with County/NA")||appMatch("Enforcement/Incident/Snow/NA")||appMatch("Enforcement/Incident/Zoning/NA")) {

var parent = getParent();
if(parent){
	if(matches(wfStatus,"Assigned","Graffiti Abatement Redo","Bill and Photo Denied","Invoice Approved","Invoice Denied","Bill and Photo Approved","Called Service Request","Invoiced - City Paid","Invoiced","Taken and Stored","Rescheduled","Reschedule upon Re-Inspect","Record Reception","Lien Paid","Submit Recording","Released to County","Record Reception","Submitted","FTA - Visit","FTA - Inspection Scheduled","FTA","Continuance","Trial Issue New Summons","NFZV - 1 Year","Non-Compliant","Court Ordered Re-Inspect","Trial","Non-Complance New Summons","Pre-Trial","Sent - Regular","Sent - Certified","Complete","5 - Summons File to CA","4 - Summons to Docketing","1 - Create Summons File","6 - Citation File to CA", "2 - Summons to Court Liaison","3 - File to Court Liaison","Unverifiable","Taken and Stored - Citation","Taken and Stored - Summons","Visit/Attempted Contact","Personal Service","Letter to be Sent","No Show","Inspection Failed","Extension - No Fee","Extension - Fee","Skip to Summons","Inspection Passed","CO Verified","Scheduled","Pending Housing Inspection","Packet Mailed","Housing Letter Sent","Release to County","Record Submitted","Record Reception","Lien Paid","Record Reception","Record Submitted","Pictures Only","Garage Sales","Banners","Misc.","Second Notice","First Notice","Expiring","Renewed","Expiring","Failed")){

		createCapComment(wfComment,parent);
		updateAppStatus("In Progress","Updated via Script",parent);
		createCapComment(wfComment);


			}

	if(matches(wfStatus,"Completed Service Request","Canceled","Dismissed","Compliance","Complete","Cancelled","Withdrawn","Compliance/Complete","No Violation","Closed","Final Notice","Duplicate","Referred","New Owner","Compliant")){

		createCapComment(wfComment,parent);
		updateAppStatus("Completed","Updated via Script",parent);
		createCapComment(wfComment);


			}
		}
}

//END ENFORCEMENT RECORD WORKFLOW CRM LOGIC

//START FIRE RECORD WORKFLOW CRM LOGIC

//Start Logic For Building Workflow Statuses that trigger when comments status updates are published to the shadow record which will push to CRM System
if (appMatch("Fire/Complaint/NA/NA")||appMatch("Fire/Primary Inspection/NA/NA")||appMatch("Fire/Special Inspection/NA/NA")) {

var parent = getParent();
if(parent){
	if(matches(wfStatus,"Research","Violation","In Progress")){

		createCapComment(wfComment,parent);
		updateAppStatus("In Progress","Updated via Script",parent);
		createCapComment(wfComment);


}

	if(matches(wfStatus,"Withdrawn","Compliance/Complete","No Violation","Complete","Inactive")){

		createCapComment(wfComment,parent);
		updateAppStatus("Completed","Updated via Script",parent);
		createCapComment(wfComment);


		}
	}
}

//END FIRE RECORD WORKFLOW CRM LOGIC

//START PUBLIC WORKS RECORD WORKFLOW CRM LOGIC

//Start Logic For Building Workflow Statuses that trigger when comments status updates are published to the shadow record which will push to CRM System
if (appMatch("PublicWorks/Traffic/Traffic Engineering Request/NA")) {

var parent = getParent();

if(parent){
	if(matches(wfStatus,"Accepted","Workorder Drafted","Generated","Assigned","Assigned to Supervisor","Draft Work Order")){

		createCapComment(wfComment,parent);
		updateAppStatus("In Progress","Updated via Script",parent);
		createCapComment(wfComment);


	}

	if(matches(wfStatus,"Request Complete","Complete","Refer to Code Enforcement","No Change Warranted","Refer to Forestry","Completed","Approved","Denied")){

		createCapComment(wfComment,parent);
		updateAppStatus("Completed","Updated via Script",parent);
		createCapComment(wfComment);

		}
	}
}

//END PUBLICWORKS RECORD WORKFLOW CRM LOGIC

}