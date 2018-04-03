/*COA Script - Suhail
Criteria   If SWMP Permit inspection Type "Final Inspection" = "complete" then 
status wf step "closure" = "Return Fiscal Security" and email the applicant the inspection report 
If SWMP Permit inspection Type "Final Inspection" = "Fail" 
then make a follow up final inspection schedulable on ACA  
*/
include("27_SWMPFinalInspection");