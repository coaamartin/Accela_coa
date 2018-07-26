/*COA Script - Suhail
Criteria   If SWMP Permit inspection Type "Final Inspection" = "complete" then 
status wf step "closure" = "Return Fiscal Security" and email the applicant the inspection report 
If SWMP Permit inspection Type "Final Inspection" = "Fail" 
then make a follow up final inspection schedulable on ACA  
*/
include("27_SWMPFinalInspection");


//script 395
logDebug("Script 395 Starting");
if(ifTracer(inspType == "Routine Inspections" && inspResult == "Ready for Final", 'inspType == "Routine Inspections" && inspResult == "Ready for Final"')) {
    include("395_prescript_pondRowsMustExist");
    if(ifTracer(cancelCfgExecution != true, 'Pond Type list has rows')) {
        updateTask("Active Permit", "Ready for Final Certification", "", "");
        updateTask("Final Certification", "Upload Pending", "", "");
    } 
}
