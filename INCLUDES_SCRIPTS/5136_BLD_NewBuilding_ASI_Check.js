//Written by rprovinc   
//
//include("5136_BLD_NewBuilding_ASI_Check.js");

//*****************************************************************************
//Script WTUA; Building/Permit/New Building/NA
//Record Types:	Building/Permit/New Building/NA
//Event: 		WTUB
//Desc:			Going to verify that all of the proper custom fields have been completed before the task Quality Check is approved.
//
//Created By: Rprovinc

//******************************************************************************
appTypeResult = cap.getCapType(); //create CapTypeModel object
appTypeString = appTypeResult.toString();
appTypeArray = appTypeString.split("/");
logDebug("appType: " + appTypeString);
var showMessage = false;		// Set to true to see results in popup window
var showDebug = false;			// Set to true to see debug messages in popup window
var message = "";				// Message String
var debug = "";					// Debug String
var br = "<BR>";				// Break Tag

logDebug("Starting to check ASI fields");
//Below I will nee to pull all ASI fields and check them to see if they have data entered.
/* List of the custom fields that need to be checked: 
Total Finished Area Sq ft
Project Category (we are changing the name to type of project)
Maximum Occupancy
# of Residential Units
Single Family Detached Home
Special Inspections
Materials Cost
Valuation
Homeowner Acting as Contractor
Code Reference
*/

var totalSqFt = AInfo["Total Finished Area Sq ft"];
var projectCategory = AInfo["Project Category"];
var maximumOccupancy = AInfo["Maximum Occupancy"];
var resUnits = AInfo["# of Residential Units"];
var singFamDetachHome = AInfo["Single Family Detached Home"];
var specialInspections = AInfo["Special Inspections"];
var materialsCost = AInfo["Materials Cost"];
var valuation = AInfo["Valuation"];
var homeownerActingContractor = AInfo["Homeowner Acting as Contractor"];
var codeReference = AInfo["Code Reference"];
var errorMessage = [];

if(totalSqFt == null) {
    errorMessage.push("Total Finished Area Sq ft");
    logDebug("Total Square feet field is empty");
}

if(projectCategory == null) {
    errorMessage.push("Project Category");
    logDebug("Project Category field is empty");
}

if(maximumOccupancy == null) {
    errorMessage.push("Maximum Occupancy");
    logDebug("Maximum Occupancy field is empty");
}
if(resUnits == null) {
    errorMessage.push("# of Residential Units");
    logDebug("# of Residential Units field is empty");
}
if(singFamDetachHome == null) {
    errorMessage.push("Single Family Detached Home");
    logDebug("Single Family Detached Home field is empty");
}
if(specialInspections == null) {
    errorMessage.push("Special Inspections");
    logDebug("Special Inspections field is empty");
}
if(materialsCost == null) {
    errorMessage.push("Materials Cost");
    logDebug("Materials Cost field is empty");
}
if(valuation == null) {
    errorMessage.push("Valuation");
    logDebug("Valuation field is empty");
}
if(homeownerActingContractor == null) {
    errorMessage.push("Homeowner Acting as Contractor");
    logDebug("Homeowner Acting as Contractor field is empty");
}
if(codeReference == null) {
    errorMessage.push("Code Reference");
    logDebug("Code Reference field is empty");
}

if(errorMessage != null) {
    logMessage("The following fields need to be completed: " + errorMessage);
}
