/*
Script 200
Record Types:	Forestry/Request/Citizen

Event: 	WTUA
Desc:		If the workflow task = "Crew Work" and the workflow status = "Removal" then activate the workflow task "Stump Grind" and
set the custom field "Stump Grind Priority" to the value of 2 if the workflow task "Tree Request Intake" has a status of "No
Plant".
Created By: Silver Lining Solutions
 */
if (wfTask == "Crew Work" && wfStatus == "Removal") {

	// Script 200

	activateTask("Stump Grind");
	var parentTask = aa.workflow.getTask(capId, "Tree Request Intake").getOutput();
	if (parentTask != null && parentTask != "") {
		if (parentTask.getDisposition() == "No Plant") {

			editAppSpecific("Stump Grind Priority", 2);
		}
	}
}
