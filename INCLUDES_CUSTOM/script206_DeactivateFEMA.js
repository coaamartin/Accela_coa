//script206_DeactivateFEMA
//Record Types:	Building/Permit/New Building/NA
//Event: WTUA - WorkflowTaskUpdateAfter
//Desc: If wfTask = “Engineering Review” and wfStatus is NOT = “Approved with FEMA Cert Required”, then deactivate the workflow task “FEMA Elevation Certification”
//Created By: Silver Lining Solutions

function script206_DeactivateFEMA() {
	
	aa.print("script206_DeactivateFEMA started.");
	try{
		if (wfTask==("Engineering Review") && wfStatus !=("Approved with FEMA Cert Required")) {
			deactivateTask("FEMA Elevation Certification");
		}
	} catch(err){
		showMessage = true;
		comment("Error on custom function script206_DeactivateFEMA. Please contact administrator. Err: " + err);
		aa.print("Error on custom function script206_DeactivateFEMA. Please contact administrator. Err: " + err);
		logDebug("A JavaScript Error occurred: ASA:Building/*/*/* 204: " + err.message);
		logDebug(err.stack)
	}
	aa.print("script206_DeactivateFEMA ended.");
//	if function is used        };//END WTUA:Building/Permit/New Building/NA;

}