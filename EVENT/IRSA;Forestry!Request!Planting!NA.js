// Script 155
UpdateWFAddInspAndCreateNewRecord();

/*
Title : Stump Grind Inspection Scheduling (InspectionResultSubmitAfter) 

Purpose : schedule other inspections based on inspection type / result and ASI field value

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
	stumpGrindInspectionScheduling("Non-warranty Inspection", [ "Passed" ], "Grind Stump", "Priority 1 Stump Grind", "Priority 1 Stump Grind", "Priority 2 Stump Grind","FORESTRY>NA>NA>NA>NA>FT_FC");
	
Notes:
	- Inspection correct result is Passed (Complete not found)
*/

stumpGrindInspectionScheduling("Non-warranty Inspection", [ "Passed" ], "Grind Stump", "Priority 1 Stump Grind", "Priority 1 Stump Grind", "Priority 2 Stump Grind","FORESTRY/NA/NA/NA/NA/FT_FC");
