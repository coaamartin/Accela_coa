//IRSA:LICENSES/MARIJUANA/*/LICENSE
/*
Title : Auto schedule inspections based on inspection result and original schedule date (InspectionResultSubmitAfter) 
Purpose : check if specific inspection type, with specific result - reschedule same inspection, original scheduled date + n
Author: Erich von Trapp
Functional Area : Records
*/

// include("5000_CONF_LICENSES_INSPECTION_AUTOMATION");  - NO good .. doesn't like JSON format

var vCapType;

if (appMatch("Licenses/Marijuana/*/Application")) {
	vCapType = "Application";
} else if (appMatch("Licenses/Marijuana/*/License")) {
	vCapType = "License";
} else {
	vCapType = null;
}

//check for failed MJ inspections
//failedMJInspectionAutomation(vCapType);	//function moved to IRSA:LICENSES/MARIJUANA/*/*

//check for passed MJ inspections
//passedMJInspectionAutomation(); //function moved to IRSA:LICENSES/MARIJUANA/*/*

//check for extension requests on MJ inspections
//requestExtensionMJInspection(vCapType); //duplicate action function moved to IRSA:LICENSES/MARIJUANA/*/*