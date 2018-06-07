/*
Title : Permit With Plans Fee Calculation (ApplicationSubmitAfter, WorkflowTaskUpdateAfter) 

Purpose : No fees are paid up front but Fees are added on application creation as NEW but not Invoiced.

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
	For ASA: permitWithPlansFeeCalculation(null, null, "Permit Fee Type", "Permit Fee Type Total");
	For Workflow Event (example task and status): permitWithPlansFeeCalculation("Review", [ "Accepted", "Completed" ], "Permit Fee Type", "Permit Fee Type Total");
	
Notes:
	- When try to read COUNTY from parcel it's being read from Parcel Attributes (COUNTY)

*/

permitWithPlansFeeCalculation(null, null, "Permit Fee Type", "Permit Fee Type Total");

//Script 417
var permitType = getAppSpecific["Permit Type"];
logDebug ("Permit Type" + permitType);
if (permitType == "Gas Pipe Installation or Modification" || permitType == "Furnace Replacement" || permitType == "Furnace and Water Heater Replacement")
{
createPendingInspection("Building Inspections", "Mechanical Final")
} else {
	logDebug("**WARN - Inspection not added");
}

