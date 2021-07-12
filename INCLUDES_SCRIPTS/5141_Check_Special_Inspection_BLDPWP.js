logDebug("Kicking off 5141_Check_Special_Inspection_BLDPWP  ------->")
var altID = capId.getCustomID();
appType = cap.getCapType().toString();
//Below we need to find the ASI field for Special Inspections
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
		comment("<h2 style='background-color:rgb(255, 0, 0);'>At least one Special Inspection must be checked before the workflow can be completed.</h2>");
		cancel = true
}
}
// if (asiValues == ""){

// }

if (asiValues == "No"){
    logDebug("Special Inspections Value was set to No. Going to close Workflow step Special Inspections.");
    //Need to close Special Inspeciton workflow step below
    //may use the updateTask function
    updateTask("Special Inspections Check", "Not Required", "", "Resulted via Script 5141");
    deactivateTask("Special Inspections Check");

}
logDebug("---------------------> 5141_Check_Special_Inspection_BLDPWP.js ended.");