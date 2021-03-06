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
//Not needed in WTUA
//permitWithPlansFeeCalculation(null, null, "Permit Fee Type", "Permit Fee Type Total");
var $iTrc = ifTracer;
if($iTrc(wfStatus == "Cancelled", 'wfStatus:Cancelled')){
    include("5135_BLD_Withdrawn");
}

if($iTrc(wfStatus == "Withdrawn", 'wfStatus:Withdrawn')){
    include("5135_BLD_Withdrawn");
}
