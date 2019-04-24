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

include("5076_Building_Inspection_Update");

createChildWaterUtilityPermitRecords();
script207_SetTotalSqFtOnFireRecord();

/*
Title : Calculate and assess Construction Building Fees (WorkflowTaskUpdateAfter) 

Purpose : For record type Building/Permit/New Building/NA fees are not assessed at intake so will need to be assessed on workflow
task update.

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
    calculateAndAssessConstructionBuildingFees("BLD_NEW_CON", [ "BLD_NEW_12", "BLD_NEW_14" ], "Quality Check", [ "Approved" ], "Fee Processing", [ "Ready to Pay" ]);

*/
//removed this call, it is not peforming the calculations. Using bldScript25_addFees() instead
//calculateAndAssessConstructionBuildingFees("BLD_NEW_CON", [ "BLD_NEW_12", "BLD_NEW_14" ], "Quality Check", [ "Approved" ], "Fee Processing", [ "Ready to Pay" ]);
if($iTrc(wfTask == "Quality Check" && wfStatus == "Approved", 'wf:Quality Check/Approved')){
    bldScript25_addCaptialNParkFees();
}

if($iTrc(wfTask == "Fee Processing" && wfStatus == "Ready to Pay", 'wf:Fee Processing/Ready to Pay')){
    bldScript25_invoiceCaptialNParkFees();
}

if($iTrc(wfTask == "Accepted In House" && wfStatus == "Routed for Review", 'wf:Accepted In House/Routed for Review')){
    bldScript418SetTskDueDate();
}

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
Title : Auto Create Tap Application record (WorkflowTaskUpdateAfter)
Purpose : If criteria: If wfTask = Water Review and wfStatus = "Approved" and the TSI field "Is a TAP record required" is equal to
"Yes" and the TSI field "Number of TAP records needed" > 0 Action: Then auto create a Tap
record(Water/Water/Tap/Application) for each number listed in the TSI field "Number of TAP records needed" as a child of
the Building/Permit/New Building/NA. When creating these child records copy the custom field "# of Residential Units" and
"Building Sq Ft" from the parent to the new child record along with all address, parcel, owner and contact information. In
addition spawn a Utility Service record(Water/Utility/Service/NA) as a child of the parent for each Tap record that is created.

Author: Haitham Eleisah

Functional Area : Records

Note: Building Sq Ft ASI field does not exists on the parent record.
Sample Call:
autoCreateTapApplicationRecord("Water Review","Approved","Is a TAP record required?","Number of TAP records needed", "Water/Water/Tap/Application","# of Residential Units","Building Sq Ft","# of Stories","Water/Utility/Service/NA");
 */
//Based on report fill report parameters here
var workflowTasktoCheck = "Water Review";
var workflowStatustoCheck = "Approved";
var tsiIsTAPrecordrequired = "Is a TAP record required?";
var tsiNumberOfTaprecords = "Number of TAP records needed";
var childRecordToCreated = "Water/Water/Tap/Application";
var ofResidentialUnitsASI = "Number of Residential Units";
var parentofResidentialUnitsASI = "# of Residential Units";
var BuildingSqFt = "Building Sq Ft";
var parentBuildingSqFt = "Total Finished Area Sq Ft";
var utilityServiceRecord = "Water/Utility/Service/NA";

autoCreateTapApplicationRecord(workflowTasktoCheck, workflowStatustoCheck, tsiIsTAPrecordrequired, tsiNumberOfTaprecords, childRecordToCreated, ofResidentialUnitsASI,
        BuildingSqFt, parentofResidentialUnitsASI, parentBuildingSqFt);
        

bldScript48_addForestryFee();

//script 51
if(wfTask =="Inspection Phase" && wfStatus== "Expired"){
	deactivateTask("Backflow Preventor");
	deactivateTask("Water Meter");
}



