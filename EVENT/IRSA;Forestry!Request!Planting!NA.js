// Script 155
UpdateWFAddInspAndCreateNewRecord();

/*
Title : Stump Grind Inspection Scheduling (InspectionResultSubmitAfter) 

Purpose : schedule other inspections based on inspection type / result and ASI field value

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
	stumpGrindInspectionScheduling("Non-warranty Inspection", [ "Passed" ], "Grind Stump", "Priority 1 Stump Grind?", "Priority 1 Stump Grind", "Priority 2 Stump Grind","FORESTRY>NA>NA>NA>NA>FT_FC");
	
Notes:
	- Inspection correct result is Passed (Complete not found)
*/

stumpGrindInspectionScheduling("Non-warranty Inspection", [ "Passed" ], "Grind Stump", "Priority 1 Stump Grind", "Priority 1 Stump Grind", "Priority 2 Stump Grind","FORESTRY/NA/NA/NA/NA/FT_FC");


logDebug('Script 154 starting');
(function () {
	var  inspector = null;

	if (ifTracer(inspType == "Planting" &&  matches(inspResult, "Yes - Staked", "Yes - Not Staked"), 'inspType == "Planting" &&  matches(inspResult, "Yes - Staked", "Yes Not Staked")')) {
		x = getGISBufferInfo("AURORACO","Forestry Index Mapbook Poly","0.01","PlantBookUpdatePhase") 
		if(ifTracer(x.length != null && x.length > 0, 'found inspector')) {
			inspector = (x[0]["PlantBookUpdatePhase"])
		}
		scheduleInspection("Non-warranty Inspection", 365, inspector);
	}
})();