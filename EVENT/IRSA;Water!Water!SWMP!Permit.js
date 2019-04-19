/*COA Script - Suhail
Criteria   If SWMP Permit inspection Type "Final Inspection" = "complete" then 
status wf step "closure" = "Return Fiscal Security" and email the applicant the inspection report 
If SWMP Permit inspection Type "Final Inspection" = "Fail" 
then make a follow up final inspection schedulable on ACA  
*/
include("5027_SWMPFinalInspection");  

include("5058_Rescheduled SWMP");  


//script 395
logDebug("Script 395 Starting");
if(ifTracer(inspType == "Routine Inspections" && inspResult == "Ready for Final", 'inspType == "Routine Inspections" && inspResult == "Ready for Final"')) {
    var rows = loadASITable('POND TYPES');
    if(ifTracer(rows, 'Pond Type list has rows')) {
        resultWorkflowTask("Active Permit", "Ready for Final Certification", "", "");
        resultWorkflowTask("Final Certification", "Upload Pending", "", "");
    } else {
        resultWorkflowTask("Active Permit", "Ready for Closure No Pond", "", "");
        resultWorkflowTask("Closure", "Pending Final Inspection", "", "");
        createPendingInspection('WAT_SW','Final Inspection');
    }
 }
