/*
Script 420
ASA: When the case is created in Aurora Access and submitted to accela via the interface, 
or created proactively in the field by a code officer. The script needs to: 
	1.) Assign a code officer (user) to the record, via GIS. 
	2.) Schedule the Inspection type "Initial Inspection" for same day, 
		and assign the same code officer to the inspection that was assigned to the record. 
	3.) Update and status workflow task "Case Intake" with the task status "Assigned" 
		and assign the same code officer to the task "Initial Investigation" that was assigned to the record.
		
*/
//ajm added for testing
include("ajm_test");
/*
var thisInsp = scheduleInspectionCustom("Zoning Initial Inspection", 0);
logDebug("inspection is " + thisInsp);
if (thisInsp) {
	autoAssignInspection(thisInsp);
	var asgnInsp = getInspectorByInspID(thisInsp);
	if (asgnInsp) {
		assignCap(asgnInsp);
		closeTask("Case Intake", "Assigned", "Closed by Script 420");
		assignTask("Initial Investigation", asgnInsp);
	}
}
*/

