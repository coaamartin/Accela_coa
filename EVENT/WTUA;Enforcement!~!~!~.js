/**ACCELA CIVIC PLATFORM TO CRM SCRIPTING LOGIC 
 * Workflow automation for all Enforcement Records 
 * @namespace WTUA:Enforcement///
 * @requires INCLUDES_CRM
 */

//Retreive Enterprise CRM Function File 
eval(getScriptText("INCLUDES_CRM", null, false));

logDebug("*** BEGIN process_WF_JSON_Rules for CRM (ENFORCEMENT) ***");
// execute workflow propagation rules
process_WF_JSON_Rules(capId, wfTask, wfStatus);
logDebug("*** FINISH process_WF_JSON_Rules for CRM (ENFORCEMENT) ***");

//Start Logic For Building Workflow Statuses that trigger when comments status updates are published to the shadow record which will push to CRM System
if (appMatch("Enforcement/Incident/Abatement/NA")||appMatch("Enforcement/Incident/Summons/NA")||appMatch("Enforcement/Housing/Inspection/NA")||appMatch("Enforcement/Incident/Informational/NA")||appMatch("Enforcement/Neighborhood/NA/NA")||appMatch("Enforcement/Incident/Record with County/NA")||appMatch("Enforcement/Incident/Snow/NA")||appMatch("Enforcement/Incident/Zoning/NA")) {

var parent = getParent();
if(parent){
	if(matches(wfStatus,"Assigned","Graffiti Abatement Redo","Bill and Photo Denied","Invoice Approved","Invoice Denied","Bill and Photo Approved","Called Service Request","Invoiced - City Paid","Invoiced","Taken and Stored","Rescheduled","Reschedule upon Re-Inspect","Record Reception","Lien Paid","Submit Recording","Released to County","Record Reception","Submitted","FTA - Visit","FTA - Inspection Scheduled","FTA","Continuance","Trial Issue New Summons","NFZV - 1 Year","Non-Compliant","Court Ordered Re-Inspect","Trial","Non-Complance New Summons","Pre-Trial","Sent - Regular","Sent - Certified","Complete","5 - Summons File to CA","4 - Summons to Docketing","1 - Create Summons File","6 - Citation File to CA", "2 - Summons to Court Liaison","3 - File to Court Liaison","Unverifiable","Taken and Stored - Citation","Taken and Stored - Summons","Visit/Attempted Contact","Personal Service","Letter to be Sent","No Show","Inspection Failed","Extension - No Fee","Extension - Fee","Skip to Summons","Inspection Passed","CO Verified","Scheduled","Pending Housing Inspection","Packet Mailed","Housing Letter Sent","Release to County","Record Submitted","Record Reception","Lien Paid","Record Reception","Record Submitted","Pictures Only","Garage Sales","Banners","Misc.","Second Notice","First Notice","Expiring","Renewed","Expiring","Failed")){

		createCapComment(wfComment,parent);
		updateAppStatus("In Progress","Updated via Script",parent);


			}

	if(matches(wfStatus,"Completed Service Request","Canceled","Dismissed","Compliance","Complete","Cancelled","Withdrawn","Compliance/Complete","No Violation","Closed","Final Notice","Duplicate","Referred","New Owner","Compliant")){

		createCapComment(wfComment,parent);
		updateAppStatus("Completed","Updated via Script",parent);


			}
		}
}