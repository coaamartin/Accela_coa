//script195_ActivateFeeIrrPermit
//Record Types:	Water/Water/Lawn Irrigation/Permit
//Event: WTUA - WorkflowTaskUpdateAfter
//Desc: When the wfStatus = “Application Fee Submitted” then send email to the applicant that the fees are invoiced and ready to be paid.
//Created By: Silver Lining Solutions

function script195_ActivateFeeIrrPermit() {
	
	logDebug("script195_ActivateFeeIrrPermit started.");
	try{
		if (wfTask==("Application Submitted") && wfStatus ==("Application Fee Submitted")) {
			emailContact("Aurora template TBD", "Please pay your fees   This is a system generated email. Do not reply.", "Applicant");
		}
	} catch(err){
		showMessage = true;
		comment("Error on custom function script195_ActivateFeeIrrPermit. Please contact administrator. Err: " + err);
		logDebug("Error on custom function script195_ActivateFeeIrrPermit. Please contact administrator. Err: " + err);
		logDebug("A JavaScript Error occurred: script195_ActivateFeeIrrPermit: " + err.message);
		logDebug(err.stack)
	}
	logDebug("script195_ActivateFeeIrrPermit ended.");
//	if function is used        };//END WTUA:Water/Water/Lawn Irrigation/Permit;

}
