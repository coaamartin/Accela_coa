/*
Title : Activate Stump Grind workflow task (WorkflowTaskUpdateAfter)
Purpose : If the workflow task = "Crew Work" and the workflow status = "Removal" then activate the workflow task "Stump Grind" and
set the custom field "Stump Grind Priority" to the value of 2 if the workflow task "Tree Request Intake" has a status of "No
Plant".

Author: Haitham Eleisah

Functional Area : Records

Sample Call:
updateWFtaskAndASIField("Tree Request Intake", "Crew Work", "Removal", "Stump Grind", "Area Number",2)

 updateWFtaskAndASIField("Tree Request Intake", "No Plant", "Crew Work", "Removal", "Area Number","2");
*/
if(wfTask == "Crew Work" && wfStatus =="Removal"){
	
	activateTask("Stump Grind");
}
