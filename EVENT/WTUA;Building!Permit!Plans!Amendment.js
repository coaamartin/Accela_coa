var $iTrc = ifTracer;
// written by SWAKIL
//updated by Rprovinc 6/14/2021
include("5046_DueDatesBuildingAmend");

if(wfTask == "Fee Processing" && wfStatus == "Complete"){
    setCodeReference("Complete");
}