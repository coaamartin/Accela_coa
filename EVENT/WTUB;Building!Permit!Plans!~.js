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
//checkSpecialInspections();

var wfTask = aa.env.getValue("WorkflowTask"); // Workflow Task Triggered event
var wfStatus = aa.env.getValue("WorkflowStatus");
logDebug("WFTask: " + wfTask);
logDebug("WFStatus: " + wfStatus);

//Adding code to verify that a TSI field has been selected
if (wfTask == "Accept Plans" && wfStatus == "Accepted") {
	//need to figure out how to pull TSI values.
	//Once I can pull the values need to loop through to ensure that 
	//at least one checkbox is selected before the workflow can proceed.
	var tsiCheckarry = [];
	for (TSIm in wfTSI) {
		var tsiCheck = wfTSI[TSIm].getChecklistComment();
		tsiCheckarry.push(tsiCheck);
		// logDebug("TSICHECKarry: " + tsiCheckarry);
		// logDebug(tsiCheckarry.indexOf('CHECKED'));	
	}
	
	logDebug("TSI CHECK ARRAY: " + tsiCheckarry);	
	//logDebug(tsiCheckarry.indexOf('CHECKED'));
	logDebug("TSI CHECK: " + tsiCheck.indexOf("CHECKED"));

	if (tsiCheckarry.toString().indexOf('CHECKED') !== -1) {
		logDebug("Value exists!");
	} else {
		logDebug("Value does not exists")
		showMessage = true;
		comment("<h2 style='background-color:rgb(255, 0, 0);'>At least one TSI field needs to be selected before the workflow can be completed.</h2>");
		cancel = true
	}

}

if ((wfTask == "Permit Issuance" && wfStatus == "Issued") || (wfTask == "Structural Plan Review" && wfStatus == "Approved")) {
var asiValues = getAppSpecific("Special Inspections");

var asiCheckValues = new Array();
var asiConcreteReq = getAppSpecific("Concrete Report Required");
asiCheckValues.push(asiConcreteReq);
var asiEIFSReq = getAppSpecific("EIFS Required");
asiCheckValues.push(asiEIFSReq);
var asiMedGasReq = getAppSpecific("Med Gas Required");
asiCheckValues.push(asiMedGasReq);
var asiPeirReq = getAppSpecific("Pier and Pile Foundations Required");
asiCheckValues.push(asiPeirReq);
var asiSmokeContReq = getAppSpecific("Smoke Control Required");
asiCheckValues.push(asiSmokeContReq);
var asiSprayedFrReq = getAppSpecific("Sprayed FR Materials Required");
asiCheckValues.push(asiSprayedFrReq);
var asiSteelReq = getAppSpecific("Steel Required");
asiCheckValues.push(asiSteelReq);
var asiStructReq = getAppSpecific("Structural Masonry Required");
asiCheckValues.push(asiStructReq);
var asiStructWoodReq = getAppSpecific("Structural Wood Required");
asiCheckValues.push(asiStructWoodReq);
var asiEIFSRec = getAppSpecific("EIFS Received");
asiCheckValues.push(asiEIFSRec);
var asiConCreteRec = getAppSpecific("Concrete Report Received");
asiCheckValues.push(asiConCreteRec);
var asiFireStoppingReq = getAppSpecific("Firestopping Required");
asiCheckValues.push(asiFireStoppingReq);
var asiMedGasRec = getAppSpecific("Med Gas Received");
asiCheckValues.push(asiMedGasRec);
var asiPierRec = getAppSpecific("Pier and Pile Foundations Received");
asiCheckValues.push(asiPierRec);
var asiSmokeContRec = getAppSpecific("Smoke Control Received");
asiCheckValues.push(asiSmokeContRec);
var asiSteelRec = getAppSpecific("Steel Received");
asiCheckValues.push(asiSteelRec);
var asiStructRec = getAppSpecific("Structural Masonry Received");
asiCheckValues.push(asiStructRec);
var asiFireStoppingRec = getAppSpecific("Firestopping Received");
asiCheckValues.push(asiFireStoppingRec);
var asiRadioReq = getAppSpecific("Radio Freq Required");
asiCheckValues.push(asiRadioReq);
var asiRadioRec = getAppSpecific("Radio Freq Received");
asiCheckValues.push(asiRadioRec);

logDebug("ASI Values: " + asiValues);
logDebug("ASI ARRAY: " + asiCheckValues);
if (asiValues == "Yes" || asiValues == null){
    if(asiCheckValues.toString().indexOf("CHECKED") !== -1){
    logDebug("Special Inspections Value was set to Yes. Going to keep the Special Inspections workflow task open.");
}
else {
    logDebug("Value does not exists")
		showMessage = true;
		comment("<h2 style='background-color:rgb(255, 0, 0);'>At least one Special Inspection or the Special Inspection field must be checked before the workflow can be completed.</h2>");
		cancel = true
}
}
}
