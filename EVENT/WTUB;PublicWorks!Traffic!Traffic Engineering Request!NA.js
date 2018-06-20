/* Title :  Work order fields must have a value (WorkflowTaskUpdateBefore)

Purpose :   If workflow task = 'Draft Workorder' and workflow status = 'Drafted workorder' and if any of the following custom fields do
NOT have a value (Location, Description, and Priority) then prevent the workflow from moving forward and raise the error
message 'Content incomplete please populate workflow information to use this status'

Author :   Israa Ismail

Functional Area : Records 

Sample Call : validateWOFields()
Notes : The name of the record is changed to 'Traffic Engineering Request (PublicWorks/Traffic/Traffic Engineering Request/NA). 
*/

validateWOFields();

//script 173
logDebug('Script 173 Starting')
if (ifTracer(wfTask=="Request Complete" && wfStatus=="Complete ",'wfTask & wfStatus match')) {
	include("173_RequireFinalResponseSent");
}