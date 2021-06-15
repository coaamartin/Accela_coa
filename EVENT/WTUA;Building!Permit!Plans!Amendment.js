var $iTrc = ifTracer;
// written by SWAKIL
//updated by Rprovinc 6/14/2021
include("5046_DueDatesBuildingAmend");

if(wfTask == "Fee Processing" && wfStatus == "Complete"){
    setCodeReference("Complete");
}
if(wfStatus == "Resubmittal Requested"){
    logDebug("Building Permit Plans Amendment, resubmittal requested.");
	include("5134_BLD_Resubmittal");
	logDebug("Email was sent for resubmittal.");
}