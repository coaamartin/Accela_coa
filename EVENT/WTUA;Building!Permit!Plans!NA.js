var $iTrc = ifTracer;
/* Title :  Create child water utility permit records (WorkflowTaskUpdateAfter)

Purpose :   If workflow task = "Fire Life Safety Review" and workflow status = "Approved" and the TSI field "Is there a private fire line" =
"Yes" and the custom field "Number of Fire Lines" > 0 then auto create a child Water Utility Permit record
(Water/Utility/Permit/NA) for each number listed in the TSI field "Number of Fire Lines" as a child of the
Building/Permit/New Building/NA or Building/Permit/Plan/NA. When creating these child records copy address, parcel,
owner and contact information. In addition set the custom field "Utility Permit Type" = "Private Fire Lines" On the Utility
Permit record.

Author :   Israa Ismail

Functional Area : Records
 
Record Types : Building/Permit/New Building/NA or Building/Permit/Plan/NA and
Water/Utility/Permit/NA

Sample Call : createChildWaterUtilityPermitRecords()

*/

createChildWaterUtilityPermitRecords();

/*
Title : Activate workflow tasks (WorkflowTaskUpdateAfter) 

Purpose : Activate workflow tasks based on the Status of other Tasks

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
	activateWorkflowTasks();

Notes:
	- Workflow task names are not accurate (not as in config)
	- Use arrays reviewTasksAry and activeReviewTasksAry to edit and correct task names
*/

activateWorkflowTasks();
if($iTrc(!isTaskStatus("Quality Check", "Approved"), '!isTaskStatus("Quality Check", "Approved")'))
	deactivateTask("Fee Processing");

/*
Title : Update Permit Expiration with every Resubmittal (WorkflowTaskUpdateAfter) 

Purpose : For any WF Task and Status of Resubmittal Requested update the Custom Field Application Expiration Date with Status
Date (of Resubmital Requested) + 180 days.

WF Tasks are: Accept Plans, Accepted In House, Structural Plan Review, Electrical Plan Review, Mechanical Plan Review,
Plumbing Plan Review, Bldg Life Safety Review, Fire Life Safety Review, Structural Engineering Review, Real Property
Review, Planning Review, Water Review, Zoning Review, Engineering Review, Traffic Review, Waste Water Review,
Forestry Review

Author: Mohammed Deeb 
 
Functional Area : Records

Sample Call:
updatePermitExpirationCF([ "Accept Plans", "Accepted In House", "Structural Plan Review", "Electrical Plan Review", "Mechanical Plan Review", "Plumbing Plan Review",
		"Bldg Life Safety Review", "Fire Life Safety Review", "Structural Engineering Review", "Real Property Review", "Planning Review", "Water Review", "Zoning Review",
		"Engineering Review", "Traffic Review", "Waste Water Review", "Forestry Review" ], "Resubmittal Requested", "Application Expiration Date");
*/

updatePermitExpirationCF([ "Accept Plans", "Accepted In House", "Structural Plan Review", "Electrical Plan Review", "Mechanical Plan Review", "Plumbing Plan Review",
		"Bldg Life Safety Review", "Fire Life Safety Review", "Structural Engineering Review", "Real Property Review", "Planning Review", "Water Review", "Zoning Review",
		"Engineering Review", "Traffic Review", "Waste Water Review", "Forestry Review" ], "Resubmittal Requested", "Application Expiration Date");

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
//not needed in WTUA
//permitWithPlansFeeCalculation(null, null, "Permit Fee Type", "Permit Fee Type Total");

// 4/16/2019

include("5098_Business_Cancel_Open_Tasks_When_Withdrawn");
if(wfStatus == "Resubmittal Requested"){
    logDebug("Building Permit Plans, resubmittal requested.");
	include("5134_BLD_Resubmittal");
	logDebug("Email was sent for resubmittal.");
}

if(wfStatus == "Cancelled"){
    logDebug("Building Permit Plans, Cancelled.");
	include("5135_BLD_Withdrawn");
	logDebug("Email was sent for Cancelled.");
}

if (wfStatus == "Ready to Pay") {
	logDebug("Building Permit Plans, Ready to Pay");
	include("5139_BLD_Plan_Fee");
}

if(wfTask == "Permit Issuance" && wfStatus == "Issued"){
    logDebug("Building Permit Plans, Permit Issuance. Check for Special Inspection.");
	include("5141_Check_Special_Inspection_BLDPWP");
	include("5142_BLDPWP_Permit_Issuance");
}

if(wfTask == "Fire Life Safety Review" && wfStatus == "Approved"){
	logDebug("Fire Life Safety Review has been approved. Going to schedule inspections if selected.");
	include("5143_BLD_PWP_Fire_inspection");
}

if(wfTask == "Waste Water Review" && wfStatus == "Approved Inspection Required"){
	logDebug("Waste Water Review has been set to Approved Inpection Required.");
	scheduleInspection("Waste Water",0);
}
