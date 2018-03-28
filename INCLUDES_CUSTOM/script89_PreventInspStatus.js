//script89_PreventInspStatus.js
//WTUB:Water/Utility/Permit/NA
//Record Types:	Water/Utility/Permit/NA
//Event: WTUB - WorkflowTaskUpdateBefore
//Desc:  When WorkFlow Utility Inspection – Complete status - Do not allow if Clearwater Inspection, super flush, pressure test do not have a result of Pass.
//Created By: Silver Lining Solutions

function script89_PreventInspStatus() {
	logDebug("script89_PreventInspStatus started.");
	try{
		if (wfTask==("WorkFlow Utility Inspection") && wfStatus ==("Complete")) {
			var isInspectionPassed = false;
			var inspResultObj = aa.inspection.getInspections(capId);
			if (inspResultObj.getSuccess()) {
				var inspList = inspResultObj.getOutput();
				for (index in inspList) {
					if (inspList[index].getInspectionType().toLowerCase().indexOf("clearwater") >= 0
							&& String("Pass").equals(inspList[index].getInspectionStatus())) {
						isInspectionPassed = true;
						break;
					}
				}
			}

			if (!isInspectionPassed) {
				cancel = true;
				showMessage = true;
				comment("Task cannot be completed until the Clearwater, super flush, pressure test Inspection has been approved");
			}
	}
	} catch(err){
		showMessage = true;
		comment("Error on custom function script89_PreventInspStatus. Please contact administrator. Err: " + err);
		logDebug("Error on custom function script89_PreventInspStatus. Please contact administrator. Err: " + err);
		logDebug("A JavaScript Error occurred: WTUB:Water/Utility/Permit/NA 89: " + err.message);
		logDebug(err.stack)
	}
	logDebug("script89_PreventInspStatus ended.");
//	if function is used        };//END WTUB:Water/Utility/Permit/NA;

}
