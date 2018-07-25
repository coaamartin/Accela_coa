/*
Title : Activate Stump Grind workflow task (WorkflowTaskUpdateAfter)
Purpose : If the workflow task = "Crew Work" and the workflow status = "Removal" then activate the workflow task "Stump Grind" and
set the custom field "Stump Grind Priority" to the value of 2 if the workflow task "Tree Request Intake" has a status of "No
Plant".
*/
if(wfTask == "Crew Work" && wfStatus =="Removal"){
	
		activateTask("Stump Grind");
		var parentTask = aa.workflow.getTask(capId, "Tree Request Intake").getOutput();
		if (parentTask != null && parentTask != "") {
			if (parentTask.getDisposition() == "No Plant") {
	
				editAppSpecific("Stump Grind Priority", 2);
			}
		}
}
