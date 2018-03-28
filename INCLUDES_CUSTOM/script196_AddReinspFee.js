//script196_AddReinspFee
//Record Types:	Water/Water/Lawn Irrigation/Permit
//Event: WTUA - WorkflowTaskUpdateAfter
//Desc: When the wfStatus = “Reinspection Required”, Add another inspection fee and email the owner and applicant about needing to schedule another inspection.
//		If the custom field “Type of Property” has a value of “Single Family Residential” then add the re-inspection fee with an amount of $30 dollars.
//		If the custom field “Type of Property” has a value of “Other” then add the re-inspection fee with an amount of $40 dollars.
//Created By: Silver Lining Solutions

function script196_AddReinspFee() {
	
	logDebug("script196_AddReinspFee started.");
	try{
		if wfStatus ==("Reinspection Required")) {
			emailContact("template for script test", "Please schedule another inspection"<br/><br/>This is a system generated email. Do not reply.", "Applicant");
			emailContact("template for script test", "Please schedule another inspection"<br/><br/>This is a system generated email. Do not reply.", "Owner");
			if AInfo["Type of Property"] == "Single Family Residential")
				updateFee("WAT_IP_03","A_REINSP","FINAL",30,"Y");
			if (AInfo["Type of Property"] == "Other") {
				updateFee("WAT_IP_03","A_REINSP","FINAL",40,"Y");
			}
		}
	} catch(err){
		showMessage = true;
		comment("Error on custom function script196_AddReinspFee. Please contact administrator. Err: " + err);
		logDebug("Error on custom function script196_AddReinspFee. Please contact administrator. Err: " + err);
		logDebug("A JavaScript Error occurred: WTUA:Water/Water/Lawn Irrigation/Permit 196: " + err.message);
		logDebug(err.stack)
	}
	logDebug("script196_AddReinspFee ended.");
//	if function is used        	};//END WTUA:Water/Water/Lawn Irrigation/Permit;

}