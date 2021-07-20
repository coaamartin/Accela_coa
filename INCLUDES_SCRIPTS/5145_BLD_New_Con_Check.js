logDebug("Kicking off 5145_BLD_New_Con_Check.js  ------->")
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
var asiSprayedFrRec = getAppSpecific("Sprayed FR Materials Received");
asiCheckValues.push(asiSprayedFrRec);
var asiSteelReq = getAppSpecific("Steel Required");
asiCheckValues.push(asiSteelReq);
var asiStructReq = getAppSpecific("Structural Masonry Required");
asiCheckValues.push(asiStructReq);
var asiStructWoodReq = getAppSpecific("Structural Wood Required");
asiCheckValues.push(asiStructWoodReq);
var asiStructWoodRec = getAppSpecific("Structural Wood Received");
asiCheckValues.push(var asiStructWoodRec);
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

if (asiValues == "Yes" || asiValues == null) {
    if (asiCheckValues.toString().indexOf("CHECKED") !== -1) {
        logDebug("Special Inspections Value was set to Yes. Going to keep the Special Inspections workflow task open.");
    } else {
        logDebug("Value does not exists")
        showMessage = true;
        comment("<h2 style='background-color:rgb(255, 0, 0);'>At least one Special Inspection must be checked before the workflow can be completed.</h2>");
        cancel = true
    }

//Below I need to check the special inspections to the required field and to the matching received field. If the required field has a check then so should the recieved field.
//Concrete below
if (asiConcreteReq == "CHECKED") {
    if (asiConcreteReq == asiConCreteRec) {
        logDebug("Concrete Report was Required and was Received. Moving forward.")
    } else {
        showMessage = true;
        comment("<h2 style='background-color:rgb(255, 0, 0);'>Concrete Report is required and has not been Received. Ensure that the Concrete report is received.</h2>");
        cancel = true
    }
}
//EIFS below
if (asiEIFSReq == "CHECKED") {
    if (asiEIFSReq == asiEIFSRec) {
        logDebug("EIFS Report was Required and was Received. Moving forward.")
    } else {
        showMessage = true;
        comment("<h2 style='background-color:rgb(255, 0, 0);'>EIFS Report is required and has not been Received. Ensure that the EIFS report is received.</h2>");
        cancel = true
    }
}
//Firestopping Required 
if (asiFireStoppingReq == "CHECKED") {
    if (asiFireStoppingReq == asiFireStoppingRec) {
        logDebug("Firestopping Required Report was Required and was Received. Moving forward.")
    } else {
        showMessage = true;
        comment("<h2 style='background-color:rgb(255, 0, 0);'>Firestopping Report is required and has not been Received. Ensure that the Firestopping report is received.</h2>");
        cancel = true
    }
}
//Med Gas Required
if (asiMedGasReq == "CHECKED") {
    if (asiMedGasReq == asiMedGasRec) {
        logDebug("Med Gas Report was Required and was Received. Moving forward.")
    } else {
        showMessage = true;
        comment("<h2 style='background-color:rgb(255, 0, 0);'>Med Gas Report is required and has not been Received. Ensure that the Med Gas report is received.</h2>");
        cancel = true
    }
}
//Pier and Pile Foundations Required
if (asiPeirReq == "CHECKED") {
    if (asiPeirReq == asiPierRec) {
        logDebug("Pier and Pile Foundations Report was Required and was Received. Moving forward.")
    } else {
        showMessage = true;
        comment("<h2 style='background-color:rgb(255, 0, 0);'>Pier and Pile Foundations Report is required and has not been Received. Ensure that the Pier and Pile Foundations report is received.</h2>");
        cancel = true
    }
}
//Smoke Control Required  
if (asiSmokeContReq == "CHECKED") {
    if (asiSmokeContReq == asiSmokeContRec) {
        logDebug("Smoke Control Report was Required and was Received. Moving forward.")
    } else {
        showMessage = true;
        comment("<h2 style='background-color:rgb(255, 0, 0);'>Smoke Control Report is required and has not been Received. Ensure that the Smoke Control report is received.</h2>");
        cancel = true
    }
}
//Sprayed FR Materials Required
if (asiSprayedFrReq == "CHECKED") {
    if (asiSprayedFrReq == asiSprayedFrRec) {
        logDebug("Sprayed FR Materials Report was Required and was Received. Moving forward.")
    } else {
        showMessage = true;
        comment("<h2 style='background-color:rgb(255, 0, 0);'>Sprayed FR Materials Report is required and has not been Received. Ensure that the Sprayed FR Materials report is received.</h2>");
        cancel = true
    }
}
//Steel Required
if (asiSteelReq == "CHECKED") {
    if (asiSteelReq == asiStructRec) {
        logDebug("Steel Report was Required and was Received. Moving forward.")
    } else {
        showMessage = true;
        comment("<h2 style='background-color:rgb(255, 0, 0);'>Steel Report is required and has not been Received. Ensure that the Steel report is received.</h2>");
        cancel = true
    }
}
//Structural Masonry Required
if (asiStructReq == "CHECKED") {
    if (asiStructReq == asiStructRec) {
        logDebug("Structural Masonry Report was Required and was Received. Moving forward.")
    } else {
        showMessage = true;
        comment("<h2 style='background-color:rgb(255, 0, 0);'>Structural Masonry Report is required and has not been Received. Ensure that the Structural Masonry report is received.</h2>");
        cancel = true
    }
}
//Structural Wood Required  
if (asiStructWoodReq == "CHECKED") {
    if (asiStructWoodReq == asiStructWoodRec) {
        logDebug("Structural Wood Report was Required and was Received. Moving forward.")
    } else {
        showMessage = true;
        comment("<h2 style='background-color:rgb(255, 0, 0);'>Structural Wood is required and has not been Received. Ensure that the Structural Wood report is received.</h2>");
        cancel = true
    }
}
//Radio Freq Required
if (asiRadioReq == "CHECKED") {
    if (asiRadioReq == asiRadioRec) {
        logDebug("Radio Freq Report was Required and was Received. Moving forward.")
    } else {
        showMessage = true;
        comment("<h2 style='background-color:rgb(255, 0, 0);'>Radio Freq Report is required and has not been Received. Ensure that the Radio Freq report is received.</h2>");
        cancel = true
    }
}


if (asiValues == "No") {
    logDebug("Special Inspections Value was set to No. Going to close Workflow step Special Inspections.");
    //Need to close Special Inspeciton workflow step below
    //may use the updateTask function
    // updateTask("Special Inspections Check", "Not Required", "", "Resulted via Script 5141");
    // deactivateTask("Special Inspections Check");

}
}

//below we need to run through checks of the Engineer letters. If One is required then the 
//same required document needs to be received. 
var asiEngineeringLetter = getAppSpecific("ENGINEER LETTERS");
var asiLetterValues = new Array();
var asiDrainLetterReq = getAppSpecific("Drain Letter Required");
asiLetterValues.push(asiDrainLetterReq);
var asiDrainLetterRec = getAppSpecific("Drain Letter Received");
asiLetterValues.push(asiDrainLetterRec);
var asiFootingReq = getAppSpecific("Footing - Pier - Cassion Letter Required");
asiLetterValues.push(asiFootingReq);
var asiFootingRec = getAppSpecific("Footing - Pier - Cassion Letter Received");
asiLetterValues.push(asiFootingRec);
var asiFoundationLetterReq = getAppSpecific("Foundation Letter Required");
asiLetterValues.push(asiFoundationLetterReq);
var asiFoundationLetterRec = getAppSpecific("Foundation Letter Received");
asiLetterValues.push(asiFoundationLetterRec);
var asiILCLetterReq = getAppSpecific("ILC Letter Required");
asiLetterValues.push(asiILCLetterReq);
var asiILCLetterRec = getAppSpecific("ILC Letter Received");
asiLetterValues.push(asiILCLetterRec);
var asiWaterLetterReq = getAppSpecific("Waterproofing Letter Required");
asiLetterValues.push(asiWaterLetterReq);
var asiWaterLetterRec = getAppSpecific("Waterproofing Letter Received");
asiLetterValues.push(asiWaterLetterRec);
logDebug("ASI Engineering Letters: " + asiLetterValues);
//Drain Letter
logDebug("Drain Letter Req: " + asiDrainLetterReq);
if (asiDrainLetterReq == "CHECKED") {
    if (asiDrainLetterReq == asiDrainLetterRec) {
        logDebug("Drain Letter was Required and was Received. Moving forward.")
    } else {
        showMessage = true;
        comment("<h2 style='background-color:rgb(255, 0, 0);'>Drain Letter is required and has not been Received. Ensure that the Drain Letter is received.</h2>");
        cancel = true
    }
}
//Footing - Pier - Cassion Letter
if (asiFootingReq == "CHECKED") {
    if (asiFootingReq == asiFootingRec) {
        logDebug("Footing - Pier - Cassion Letter was Required and was Received. Moving forward.")
    } else {
        showMessage = true;
        comment("<h2 style='background-color:rgb(255, 0, 0);'>Footing - Pier - Cassion Letter is required and has not been Received. Ensure that the Footing - Pier - Cassion Letter is received.</h2>");
        cancel = true
    }
}
//Foundation Letter
if (asiFoundationLetterReq == "CHECKED") {
    if (asiFoundationLetterReq == asiFoundationLetterRec) {
        logDebug("Foundation Letter was Required and was Received. Moving forward.")
    } else {
        showMessage = true;
        comment("<h2 style='background-color:rgb(255, 0, 0);'>Foundation Letter is required and has not been Received. Ensure that the Foundation Letter is received.</h2>");
        cancel = true
    }
}
//ILC Letter
if (asiILCLetterReq == "CHECKED") {
    if (asiILCLetterReq == asiILCLetterRec) {
        logDebug("ILC Letter was Required and was Received. Moving forward.")
    } else {
        showMessage = true;
        comment("<h2 style='background-color:rgb(255, 0, 0);'>ILC Letter is required and has not been Received. Ensure that the ILC Letter is received.</h2>");
        cancel = true
    }
}
//Waterproofing Letter
if (asiWaterLetterReq == "CHECKED") {
    if (asiWaterLetterReq == asiWaterLetterRec) {
        logDebug("Waterproofing Letter was Required and was Received. Moving forward.")
    } else {
        showMessage = true;
        comment("<h2 style='background-color:rgb(255, 0, 0);'>Waterproofing Letter is required and has not been Received. Ensure that the Waterproofing Letter is received.</h2>");
        cancel = true
    }
}

logDebug("End of 5145_BLD_New_Con_Check.js  ------->");