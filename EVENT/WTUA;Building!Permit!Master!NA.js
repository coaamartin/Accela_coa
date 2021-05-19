/*
Title : Add Master Plan Data to Share Dropdown for Building Records (ApplicationStatusUpdateAfter) 

Script: 324

Purpose : Based on ASI value, check and inactivate a row in a shared DDL, and insert a row in Shared DDL

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
    addMasterPlanDataToShrdDDList("Master Plan Type", "Approved", "Code Change");
*/
//Script 324
addMasterPlanDataToShrdDDList("Master Plan Type", "Approved", "Code Change");

if(ifTracer(wfTask == "Accepted In House" && wfStatus == "Route for Review", 'wf:Accepted In House/Route for Review')){
    bldScript418SetTskDueDate();
}

if(ifTracer(wfTask == "Accepted In House" && wfStatus == "Route to Planning", 'wf:Accepted In House/Route to Planning')){
    assignInspectionDepartment("BUILDING/NA/NA/NA/NA/PT", "Accepted In House");
}