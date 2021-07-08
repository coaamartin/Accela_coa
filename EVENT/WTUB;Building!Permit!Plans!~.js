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
	var tsiCheckarry = [];
	for (TSIm in wfTSI) {
		var tsiCheck = wfTSI[TSIm].getChecklistComment();
		tsiCheckarry.push(tsiCheck);
		logDebug("TSICHECKarry: " + tsiCheckarry);
		logDebug("TSICHECK: " + tsiCheck);

	}
	
	
	if (tsiCheckarry.indexOf("CHECKED") == -1) {
		logDebug("Value exists!");
	} else {
		logDebug("Value does not exists")
		showMessage = true;
		comment("<h2 style='background-color:rgb(255, 0, 0);'>At least one TSI field needs to be selected before the workflow can be completed.</h2>");
		cancel = true
	}
}