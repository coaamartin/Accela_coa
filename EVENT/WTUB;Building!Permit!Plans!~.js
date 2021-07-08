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

var wfTask = aa.env.getValue("WorkflowTask"); // Workflow Task Triggered event
var wfStatus = aa.env.getValue("WorkflowStatus");
logDebug("WFTask: " + wfTask);
logDebug("WFStatus: " + wfStatus);

//Adding code to verify that a TSI field has been selected
if ($iTrc(wfTask == "Accept Plans" && wfStatus == "Accepted")) {
	//need to figure out how to pull TSI values.
	//Once I can pull the values need to loop through to ensure that 
	//at least one checkbox is selected before the workflow can proceed.
	var wfTSI = aa.env.getValue("TaskSpecificInfoModels"); // Workflow Task Specific Info Array
	logDebug("TSIM = " + wfTSI);
	for (TSIm in wfTSI) {
		var tsiCheck = [wfTSI[TSIm].getChecklistComment()];
		logDebug("TSICHECK: " + tsiCheck);
		logDebug("TSICHECK.length " + tsiCheck.length);

		if (wfTSI != "") {
			AInfo["Updated1." + wfTSI[TSIm].getCheckboxDesc()] = wfTSI[TSIm].getChecklistComment();
		}
		if (tsiCheck.length === 1) {
			showMessage = true;
			comment("<h2 style='background-color:rgb(255, 0, 0);'>At least one TSI field needs to be selected before the workflow can be completed.</h2>");
			cancel = true;
		}
	}
}
logGlobals(AInfo);