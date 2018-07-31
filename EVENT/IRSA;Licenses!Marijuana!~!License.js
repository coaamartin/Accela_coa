/*
Title : Auto schedule failed inspections based on original schedule date (InspectionResultSubmitAfter) 

Purpose : check if specific inspection type, with specific Result, reschedule same inspection, original scheduled date + n

Author: Erich von Trapp
 
Functional Area : Records

*/

//check for failed MJ inspections
failedMJInspectionAutomation();	

//check for passed MJ inspections
passedMJInspectionAutomation();
