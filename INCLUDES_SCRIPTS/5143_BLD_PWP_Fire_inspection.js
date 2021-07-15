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
var asiAlarmSystem = tsiCheckarry.toString().indexOf("Alarm System");
    if(asiAlarmSystem !== -1) {
        asiAlarmSystemCheck = tsiCheckarry.toString().indexOf("CHECKED");
        logDebug(asiAlarmSystemCheck);
            if(asiAlarmSystemCheck == 82) {
                logDebug("Going to Schedule Alarm System Inspection.");
                createPendingInspection(inspGroup,"Alarm System");
            }
            else{
                logDebug("Alarm System was not checked.")
            }
    }



var asiFireLane = tsiCheckarry.toString().indexOf("Fire Lanes");
logDebug("Fire Lane: " + asiFireLane);
//asiCheckValues.push(asiFireLane);
if(asiFireLane !== -1) {
    asiFireLaneCheck = tsiCheckarry.toString().indexOf("CHECKED");
    logDebug(asiFireLaneCheck);
        // if(asiFireLaneCheck == 82) {
        //     logDebug("Going to Schedule Alarm System Inspection.");
        //     createPendingInspection(inspGroup,"Alarm System");
        // }
        // else{
        //     logDebug("Alarm System was not checked.")
        // }
}

var asiFuelTankLine = tsiCheckarry.toString().indexOf("Fuel Tank Lines");
logDebug("Fuel Tank Line: " + asiFuelTankLine);
if(asiFuelTankLine !== -1) {
    asiFuelTankLineCheck = tsiCheckarry.toString().indexOf("CHECKED");
    logDebug(asiFuelTankLineCheck);
        // if(asiFuelTankLineCheck == 82) {
        //     logDebug("Going to Schedule Alarm System Inspection.");
        //     createPendingInspection(inspGroup,"Alarm System");
        // }
        // else{
        //     logDebug("Alarm System was not checked.")
        // }
}

var asiGatingSystem = tsiCheckarry.toString().indexOf("Gating system/Hazardous Materials");
logDebug("Gating System: " + asiGatingSystem);
if(asiGatingSystem !== -1) {
    asiGatingSystemCheck = tsiCheckarry.toString().indexOf("CHECKED");
    logDebug(asiGatingSystemCheck);
        // if(asiAlarmSystemCheck == 82) {
        //     logDebug("Going to Schedule Alarm System Inspection.");
        //     createPendingInspection(inspGroup,"Alarm System");
        // }
        // else{
        //     logDebug("Alarm System was not checked.")
        // }
}

var asiHoodSystem = tsiCheckarry.toString().indexOf("Hood System");
logDebug("Hood System: " + asiHoodSystem);
if(asiHoodSystem !== -1) {
    asiHoodSystemCheck = tsiCheckarry.toString().indexOf("CHECKED");
    logDebug(asiHoodSystemCheck);
        // if(asiHoodSystemCheck == 82) {
        //     logDebug("Going to Schedule Alarm System Inspection.");
        //     createPendingInspection(inspGroup,"Alarm System");
        // }
        // else{
        //     logDebug("Alarm System was not checked.")
        // }
}

var asiKnoxBox = tsiCheckarry.toString().indexOf("Knox Box");
logDebug("Knox Box: " + asiKnoxBox);
if(asiKnoxBox !== -1) {
    asiKnoxBoxCheck = tsiCheckarry.toString().indexOf("CHECKED");
    logDebug(asiKnoxBoxCheck);
        // if(asiKnoxBoxCheck == 82) {
        //     logDebug("Going to Schedule Alarm System Inspection.");
        //     createPendingInspection(inspGroup,"Alarm System");
        // }
        // else{
        //     logDebug("Alarm System was not checked.")
        // }
}

var asiSprinklerSystem = tsiCheckarry.toString().indexOf("Sprinkler System Final");
logDebug("Sprinkler System: " + asiSprinklerSystem);
if(asiSprinklerSystem !== -1) {
    asiSprinklerSystemCheck = tsiCheckarry.toString().indexOf("CHECKED");
    logDebug(asiSprinklerSystemCheck);
        // if(asiSprinklerSystemCheck == 82) {
        //     logDebug("Going to Schedule Alarm System Inspection.");
        //     createPendingInspection(inspGroup,"Alarm System");
        // }
        // else{
        //     logDebug("Alarm System was not checked.")
        // }
}

var asiSprinklerSystemRough = tsiCheckarry.toString().indexOf("Sprinkler System Rough");
logDebug("Sprinkler System Rough: " + asiSprinklerSystemRough);
if(asiSprinklerSystemRough !== -1) {
    asiSprinklerSystemRoughCheck = tsiCheckarry.toString().indexOf("CHECKED");
    logDebug(asiSprinklerSystemRoughCheck);
        // if(asiSprinklerSystemRoughCheck == 82) {
        //     logDebug("Going to Schedule Alarm System Inspection.");
        //     createPendingInspection(inspGroup,"Alarm System");
        // }
        // else{
        //     logDebug("Alarm System was not checked.")
        // }
}

logDebug("ASI Check Values: " + asiCheckValues);