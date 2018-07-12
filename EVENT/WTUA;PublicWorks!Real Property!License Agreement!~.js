//WTUA:PublicWorks/Real Property/License Agreement/NaN

//checkInvoiced(); moved to WTUB

/*
Title : Civil Plans and Drainage update Submittal Number (WorkflowTaskUpdateAfter)

Purpose : Custom Field Submittal Number is to be incremented by 1 when workflow is updated

Author: Ali Othman
 
Functional Area : Workflow, Custom Fields

Sample Call:
	updateSubmittalNumber("Application Submittal", ["Complete", "Accepted"], "Submittal Number");
	
Notes:
    For record type Water/Utility/Master/Study, we don't have any custom field called Submittal Number
*/



// per customer direction during script testing, it was determined that this functionality should 
// be completed on task 'Completeness Check' and status 'Complete'
// script 18
// EK updated this script to include Application Submittal and Accepted
updateSubmittalNumber("Completeness Check", ["Complete","Accepted"], "Submittal Number");
updateSubmittalNumber("Application Submittal", ["Complete","Accepted"], "Submittal Number");

include("45_LicenseAgreementEmailResubmittal");

if(wfTask == "Signatures" && wfStatus == "Pending Owner Signature"){
	pWrksScript305_updateTaskDueDate();
}