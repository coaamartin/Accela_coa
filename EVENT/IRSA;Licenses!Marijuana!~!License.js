/*
Title : Auto schedule inspections based on inspection result and original schedule date (InspectionResultSubmitAfter) 

Purpose : check if specific inspection type, with specific result - reschedule same inspection, original scheduled date + n

Author: Erich von Trapp
 
Functional Area : Records

*/

var vCapType;

if (appMatch("Licenses/Marijuana/*/Application")) {
	vCapType = "Application";
} else {
	vCapType = "License";
}

logDebug("Cap Type? " + vCapType);

//check for failed MJ inspections
failedMJInspectionAutomation(vCapType);	

//check for passed MJ inspections
passedMJInspectionAutomation();

//check for extension requests on MJ inspections
requestExtensionMJInspection();