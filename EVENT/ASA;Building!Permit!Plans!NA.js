//------------------------------------------------------------------------------------------------------/
// Program		: ASA:BUILDING/PERMIT/*/*
/* Event		: ApplicationSubmitAfter, WorkflowTaskUpdateAfter
|
| Usage			: 
| Notes			: 
| Created by	: ISRAA
| Created at	: 29/01/2018 15:41:
|
/------------------------------------------------------------------------------------------------------*/
//useAppSpecificGroupName=false;
//var cOO=getAppSpecific("Certificate of Occupancy",capId);
//if (cOO!="CHECKED"){
//	deleteTask(capId,"Certificate of Occupancy");
//}

//TestComment

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

