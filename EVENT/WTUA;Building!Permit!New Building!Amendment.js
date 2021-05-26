// written by SWAKIL
include("5046_DueDatesBuildingAmend");

if($iTrc(wfStatus == "Resubmittal Requested", 'wfStatus:Resubmittal Requested')){
    include("5134_BLD_Resubmittal");
}

if($iTrc(wfStatus == "Withdrawn", 'wfStatus:Withdrawn')){
    include("5135_BLD_Withdrawn");
}
