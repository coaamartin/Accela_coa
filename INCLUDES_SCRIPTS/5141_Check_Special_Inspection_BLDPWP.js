logDebug("Kicking off 5141_Check_Special_Inspection_BLDPWP  ------->")
var altID = capId.getCustomID();
appType = cap.getCapType().toString();
//Below we need to find the ASI field for Special Inspections
var asiValues = getAppSpecific("Special Inspections");
logDebug("ASI Values: " + asiValues);
if (asiValues == "Yes"){
    logDebug("Special Inspections Value was set to Yes. Going to keep the Special Inspections workflow task open.");
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