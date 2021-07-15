//Written by rprovinc   
//
//include("5143_BLD_PWP_Fire_inspection.js");

//*****************************************************************************
//Script WTUA;Building!Permit!Plans!NA.js
//Record Types:	
//Event: 		WTUA
//Desc:			Going to send email communication to ciziten when the Permit has been issued.
//
//Created By: Rprovinc

//******************************************************************************
appTypeResult = cap.getCapType(); //create CapTypeModel object
appTypeString = appTypeResult.toString();
appTypeArray = appTypeString.split("/");
logDebug("appType: " + appTypeString);

//need to find what Workflow ASI fields are checked and then schedule the inspection.
//Will use the below code for the inspection schedule
//scheduleInspection("FD Complaint Inspection",0);
var wfTSI = aa.env.getValue("TaskSpecificInfoModels");
logDebug("wfTSI: " + wfTSI);
var tsiCheckarry = [];
for (TSIm in wfTSI) {
    var tsiCheck = [];
    var tsiCheck = [wfTSI[TSIm].getCheckboxDesc() + " : " + wfTSI[TSIm].getChecklistComment() + "<br>"];
    tsiCheckarry.push(tsiCheck);
    // logDebug("TSICHECKarry: " + tsiCheckarry);
    // logDebug(tsiCheckarry.indexOf('CHECKED'));	
}

logDebug("TSI Check Arry: " + tsiCheckarry);
var inspGroup = "BLD_NEW_CON";
// var asiCheckValues = new Array();
var asiAlarmSystem = tsiCheckarry.toString().indexOf(",Alarm System : CHECKED");
    if (asiAlarmSystem !== -1) {
        logDebug("Going to Schedule Alarm System Inspection.");
        createPendingInspection(inspGroup, "Alarm System");
    } else {
        logDebug("Alarm System was not checked.")
    }




var asiFireLane = tsiCheckarry.toString().indexOf(",Fire Lanes : CHECKED");
logDebug("Fire Lane: " + asiFireLane);
//asiCheckValues.push(asiFireLane);
    if (asiFireLane !== -1) {
        logDebug("Going to Schedule Fire Lane Inspection.");
        createPendingInspection(inspGroup,"Fire Lanes");
    } else {
        logDebug("Fire Lane was not checked.")
    }


var asiFuelTankLine = tsiCheckarry.toString().indexOf(",Fuel Tank Lines : CHECKED");
logDebug("Fuel Tank Line: " + asiFuelTankLine);
    if (asiFuelTankLine !== -1) {
        logDebug("Going to Schedule Fuel Tank Lines Inspection.");
        createPendingInspection(inspGroup, "Fuel Tank Lines");
    } else {
        logDebug("Fuel Tank Line was not checked.")
    }


var asiGatingSystem = tsiCheckarry.toString().indexOf(",Gating system/Hazardous Materials : CHECKED");
logDebug("Gating System: " + asiGatingSystem);
    if (asiGatingSystem == 149) {
        logDebug("Going to Schedule Gating System / Hazardous Material Inspection.");
        createPendingInspection(inspGroup, "Gating System / Hazardous Material");
    } else {
        logDebug("Gating System was not checked.")
    }


var asiHoodSystem = tsiCheckarry.toString().indexOf(",Hood System : CHECKED");
logDebug("Hood System: " + asiHoodSystem);
    if (asiHoodSystem !== -1) {
        logDebug("Going to Schedule Hood System Inspection.");
        createPendingInspection(inspGroup, "Hood System");
    } else {
        logDebug("Hood System was not checked.")
    }


var asiKnoxBox = tsiCheckarry.toString().indexOf(",Knox Box : CHECKED");
logDebug("Knox Box: " + asiKnoxBox);
    if (asiKnoxBox !== -1) {
        logDebug("Going to Schedule Knox Box Inspection.");
        createPendingInspection(inspGroup, "Knox Box");
    } else {
        logDebug("Knox Box was not checked.")
    }


var asiSprinklerSystem = tsiCheckarry.toString().indexOf(",Sprinkler System Final : CHECKED");
logDebug("Sprinkler System: " + asiSprinklerSystem);
if (asiSprinklerSystem !== -1) {
    logDebug("Going to Schedule Sprinkler System Final Inspection.");
    createPendingInspection(inspGroup, "Sprinkler System Final");
} else {
    logDebug("Sprinkler System was not checked.")
}


var asiSprinklerSystemRough = tsiCheckarry.toString().indexOf(",Sprinkler System Rough : CHECKED");
logDebug("Sprinkler System Rough: " + asiSprinklerSystemRough);
logDebug(asiSprinklerSystemRough);
if (asiSprinklerSystemRough !== 1) {
    logDebug("Going to Schedule Sprinkler System Rough Inspection.");
    createPendingInspection(inspGroup, "Sprinkler System Rough");
} else {
    logDebug("Sprinkler System Rough was not checked.")
}