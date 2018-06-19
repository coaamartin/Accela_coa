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



updateSubmittalNumber("Application Submittal", ["Complete", "Accepted"], "Submittal Number");

include("45_LicenseAgreementEmailResubmittal");

if($iTrc(wfTask == "Signatures" && wfStatus == "Pending Owner Signature", 'wfTask == "Signatures" && wfStatus == "Pending Owner Signature"')){
    pWrksScript303_reqOwnerSigEmail();
}