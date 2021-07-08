/*------------------------------------------------------------------------------------------------------/
Title 		: Final CO Issued checks Special Inspections (WorkflowTaskUpdateBefore).

Purpose		: If workflow task = Certificate of Occupancy and workflow status = Final CO Issued then check that all Special
			inspectionCustom Fields have data in them. If any of the fields do not have data then block the progress of the workflow
			and display message that "the special inspection fields must have data".
			
Author :   Israa Ismail

Functional Area : Records 

Sample Call : checkSpecialInspections()
/------------------------------------------------------------------------------------------------------*/

checkSpecialInspections();
//Adding code to verify that a TSI field has been selected
if (wfTask == "Accept Plans" && wfStatus == "Approved") {
	var foundCheckBox = false;
	var workflowResult = aa.workflow.getTasks(capId);
	var wfObj = workflowResult.getOutput();
	logDebug("WFOBJ: " + wfObj);
	logDebug("WorkflowResult: " + workflowResult);

	for (i in wfObj) {
		var fTask = wfObj[i];
		var stepnumber = fTask.getStepNumber();
		var processID = fTask.getProcessID();


		var TSIResult = aa.taskSpecificInfo.getTaskSpecificInfoByTask(capId, processID, stepnumber) // 
		if (TSIResult.getSuccess()) {

			var TSI = TSIResult.getOutput();
			if (TSI != null)

				for (dmyIttr in TSI) {

					if (TSI[dmyIttr].getChecklistComment() != null) {
						if (TSI[dmyIttr].getChecklistComment() == "CHECKED") {
							foundCheckBox = true;
						}
					}
				}

		}

	}

	if (!foundCheckBox) {
		showMessage = true;
		comment("<h2 style='background-color:rgb(255, 0, 0);'>Accepted Plans requires at least one TSI field type to be checked for the workflow to continue.</h2>");
		cancel = true;
	}
}