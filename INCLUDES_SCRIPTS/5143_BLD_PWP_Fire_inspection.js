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
var asiCheckValues = new Array();

var asiAlarmSystem = getAppSpecific("Alarm System");
asiCheckValues.push(asiAlarmSystem);
if(asiAlarmSystem == "Checked"){
    logDebug("Going to Schedule Alarm System Inspection.");
    scheduleInspection("Alarm System",0);
} else{
    logDebug("Alarm System was not checked.")
}

var asiFireLane = getAppSpecific("Fire Lanes");
asiCheckValues.push(asiFireLane);
if(asiFireLane == "Checked"){
    logDebug("Going to Schedule Alarm System Inspection.");
    scheduleInspection("Alarm System",0);
} else{
    logDebug("Alarm System was not checked.")
}

var asiFuelTankLine = getAppSpecific("Fuel Tank Lines");
asiCheckValues.push(asiFuelTankLine);
if(asiFuelTankLine == "Checked"){
    logDebug("Going to Schedule Alarm System Inspection.");
    scheduleInspection("Alarm System",0);
} else{
    logDebug("Alarm System was not checked.")
}

var asiGatingSystem = getAppSpecific("Gating system/Hazardous Materials");
asiCheckValues.push(asiGatingSystem);
if(asiGatingSystem == "Checked"){
    logDebug("Going to Schedule Alarm System Inspection.");
    scheduleInspection("Alarm System",0);
} else{
    logDebug("Alarm System was not checked.")
}

var asiHoodSystem = getAppSpecific("Hood System");
asiCheckValues.push(asiHoodSystem);
if(asiHoodSystem == "Checked"){
    logDebug("Going to Schedule Alarm System Inspection.");
    scheduleInspection("Alarm System",0);
} else{
    logDebug("Alarm System was not checked.")
}

var asiKnoxBox = getAppSpecific("Knox Box");
asiCheckValues.push(asiKnoxBox);
if(asiKnoxBox == "Checked"){
    logDebug("Going to Schedule Alarm System Inspection.");
    scheduleInspection("Alarm System",0);
} else{
    logDebug("Alarm System was not checked.")
}

var asiSprinklerSystem = getAppSpecific("Sprinkler System Final");
asiCheckValues.push(asiSprinklerSystem);
if(asiSprinklerSystem == "Checked"){
    logDebug("Going to Schedule Alarm System Inspection.");
    scheduleInspection("Alarm System",0);
} else{
    logDebug("Alarm System was not checked.")
}

var asiSprinklerSystemRough = getAppSpecific("Sprinkler System Rough");
asiCheckValues.push(asiSprinklerSystemRoug);
if(asiSprinklerSystemRough == "Checked"){
    logDebug("Going to Schedule Alarm System Inspection.");
    scheduleInspection("Alarm System",0);
} else{
    logDebug("Alarm System was not checked.")
}

logDebug("ASI Check Values: " + asiCheckValues);