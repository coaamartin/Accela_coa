//script205_DeactivateSpecInsp
//Record Types:	Building/*/*/*
//Event: WTUA - WorkflowTaskUpdateAfter
//Desc: If wfTask = “Permit Issuance” and wfStatus = “Issued” and the custom field “Special Inspection” is equal to “No”, 
//			then deactivate the workflow task “Special Inspection Checklist”
//Created By: Silver Lining Solutions

function script205_DeactivateSpecInsp() {
	
	logDebug("script205_DeactivateSpecInsp started.");
	try{
		if ( wfTask== "Permit Issuance" && wfStatus == "Issued" && AInfo["Special Inspection"] == "No" ) {
			deactivateTask("Special Inspections Check");
		}
	} catch(err){
		showMessage = true;
		comment("Error on custom function script205_DeactivateSpecInsp. Please contact administrator. Err: " + err);
		logDebug("Error on custom function script205_DeactivateSpecInsp. Please contact administrator. Err: " + err);
		logDebug("A JavaScript Error occurred: WTUA:Building/*/*/* 205: " + err.message);
		logDebug(err.stack)
	}
	logDebug("script205_DeactivateSpecInsp ended.");
//	if function is used        };//END WTUA:Building/*/*/*;

///TEST JMP to see if update through GITHUB

}

