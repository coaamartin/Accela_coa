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
		var tsiCheck = [wfProcess + "." + wfTask + "." + wfTSI[TSIm].getChecklistComment()]= wfTSI[TSIm].getChecklistComment();
		tsiCheckarry.push(tsiCheck);
		// logDebug("TSICHECKarry: " + tsiCheckarry);
		// logDebug(tsiCheckarry.indexOf('CHECKED'));	
	}

logDebug("TSI Check Arry: " + tsiCheckarry);
var asiCheckValues = new Array();
var asiAlarmSystem = getAppSpecific("Alarm System");
logDebug("Alarm System: " + asiAlarmSystem);
asiCheckValues.push(asiAlarmSystem);
if(asiAlarmSystem == "CHECKED"){
    logDebug("Going to Schedule Alarm System Inspection.");
    scheduleInspection("Alarm System",0);
} else{
    logDebug("Alarm System was not checked.")
}

var asiFireLane = getAppSpecific("Fire Lanes");
logDebug("Fire Lane: " + asiFireLane);
asiCheckValues.push(asiFireLane);
if(asiFireLane == "CHECKED"){
    logDebug("Going to Schedule Alarm System Inspection.");
    scheduleInspection("Alarm System",0);
} else{
    logDebug("Alarm System was not checked.")
}

var asiFuelTankLine = getAppSpecific("Fuel Tank Lines");
logDebug("Fuel Tank Line: " + asiFuelTankLine);
asiCheckValues.push(asiFuelTankLine);
if(asiFuelTankLine == "CHECKED"){
    logDebug("Going to Schedule Alarm System Inspection.");
    scheduleInspection("Alarm System",0);
} else{
    logDebug("Alarm System was not checked.")
}

var asiGatingSystem = getAppSpecific("Gating system/Hazardous Materials");
logDebug("Gating System: " + asiGatingSystem);
asiCheckValues.push(asiGatingSystem);
if(asiGatingSystem == "CHECKED"){
    logDebug("Going to Schedule Alarm System Inspection.");
    scheduleInspection("Alarm System",0);
} else{
    logDebug("Alarm System was not checked.")
}

var asiHoodSystem = getAppSpecific("Hood System");
logDebug("Hood System: " + asiHoodSystem);
asiCheckValues.push(asiHoodSystem);
if(asiHoodSystem == "CHECKED"){
    logDebug("Going to Schedule Alarm System Inspection.");
    scheduleInspection("Alarm System",0);
} else{
    logDebug("Alarm System was not checked.")
}

var asiKnoxBox = getAppSpecific("Knox Box");
logDebug("Knox Box: " + asiKnoxBox);
asiCheckValues.push(asiKnoxBox);
if(asiKnoxBox == "CHECKED"){
    logDebug("Going to Schedule Alarm System Inspection.");
    scheduleInspection("Alarm System",0);
} else{
    logDebug("Alarm System was not checked.")
}

var asiSprinklerSystem = getAppSpecific("Sprinkler System Final");
asiCheckValues.push(asiSprinklerSystem);
logDebug("Sprinkler System: " + asiSprinklerSystem);
if(asiSprinklerSystem == "CHECKED"){
    logDebug("Going to Schedule Alarm System Inspection.");
    scheduleInspection("Alarm System",0);
} else{
    logDebug("Alarm System was not checked.")
}

var asiSprinklerSystemRough = getAppSpecific("Sprinkler System Rough");
asiCheckValues.push(asiSprinklerSystemRough);
logDebug("Sprinkler System Rough: " + asiSprinklerSystemRough);
if(asiSprinklerSystemRough == "CHECKED"){
    logDebug("Going to Schedule Alarm System Inspection.");
    scheduleInspection("Alarm System",0);
} else{
    logDebug("Alarm System was not checked.")
}

logDebug("ASI Check Values: " + asiCheckValues);