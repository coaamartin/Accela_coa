/*
Title : Auto schedule inspections based on inspection result and original schedule date (InspectionResultSubmitAfter) 

Purpose : check if specific inspection type, with specific result - reschedule same inspection, original scheduled date + n

Author: Erich von Trapp
 
Functional Area : Records

*/

var vCapType;

if (appMatch("Licenses/Marijuana/*/Application")) {
	vCapType = "Application";
} else if (appMatch("Licenses/Marijuana/*/License")) {
	vCapType = "License";
} else {
	vCapType = null;
}

//check for failed MJ inspections
//SW Commented - Since the same function is getting
// triggered via IRSA;Licenses!Marijuana!~!~.js
//failedMJInspectionAutomation(vCapType);	

//check for passed MJ inspections
passedMJInspectionAutomation();

//check for extension requests on MJ inspections
requestExtensionMJInspection(vCapType);


//SW ID 430
include("430_allInspectionsResulted");
