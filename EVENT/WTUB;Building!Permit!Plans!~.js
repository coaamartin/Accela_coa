/*------------------------------------------------------------------------------------------------------/
Title 		: Final CO Issued checks Special Inspections (WorkflowTaskUpdateBefore).

Purpose		: If workflow task = Certificate of Occupancy and workflow status = Final CO Issued then check that all Special
			inspectionCustom Fields have data in them. If any of the fields do not have data then block the progress of the workflow
			and display message that "the special inspection fields must have data".
			
Author :   Israa Ismail

Functional Area : Records 

Sample Call : checkSpecialInspections()
/------------------------------------------------------------------------------------------------------*/
var $iTrc = ifTracer;
checkSpecialInspections();

//Adding code to verify that a TSI field has been selected
if ($iTrc(wfTask == "Accept Plans" && wfStatus == "Accepted")) {
	//need to figure out how to pull TSI values.
	//Once I can pull the values need to loop through to ensure that 
	//at least one checkbox is selected before the workflow can proceed.
	var wfTSI = aa.env.getValue("TaskSpecificInfoModels"); // Workflow Task Specific Info Array
	logDebug("TSIM = " + wfTSI);
	var wfDate = aa.env.getValue("WorkflowStatusDate"); // Workflow Task Date
	var wfTask = aa.env.getValue("WorkflowTask"); // Workflow Task Triggered event
	var wfStatus = aa.env.getValue("WorkflowStatus"); // Status of workflow that triggered event
	var wfStep;
	var wfDue;
	var wfProcess;
	var wfTaskObj; // Initialize

	var wfObj = aa.workflow.getTasks(capId).getOutput();
	for (i in wfObj) {
		fTask = wfObj[i];
		if (fTask.getTaskDescription().equals(wfTask) && (fTask.getProcessID() == wfProcessID)) {
			wfStep = fTask.getStepNumber();
			wfProcess = fTask.getProcessCode();
			wfDue = fTask.getDueDate();
			wfTaskObj = fTask;
		}
	}

	if (wfTSI != "") {
		for (TSIm in wfTSI) {
			if (useTaskSpecificGroupName)
				AInfo["Updated1." + wfTSI[TSIm].getCheckboxDesc()] = wfTSI[TSIm].getChecklistComment();
			else
				AInfo["Updated2." + wfTSI[TSIm].getCheckboxDesc()] = wfTSI[TSIm].getChecklistComment();
		}
	}
	// if (!foundCheckBox) {
	// 	showMessage = true;
	// 	comment("<h2 style='background-color:rgb(255, 0, 0);'>Email applicant requires at least one document type to be checked for the upload to continue.</h2>");
	// 	cancel = true;
	// }

}