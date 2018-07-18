//script89_PreventInspStatus.js
//WTUB:Water/Utility/Permit/NA
//Record Types:	Water/Utility/Permit/NA
//Event: WTUB - WorkflowTaskUpdateBefore
//Desc:  When WorkFlow Utility Inspection – Complete status - Do not allow if Clearwater Inspection, super flush, pressure test do not have a result of Pass.
//Created By: Silver Lining Solutions

function script89_PreventInspStatus() {
	logDebug("script89_PreventInspStatus started.");

	if ("Utility Inspection".equals(wfTask) && "Complete".equals(wfStatus)) {
		var clearInspectionPassed = false;
		var hydroInspectionPassed = false;
		var superInspectionPassed = false;
		var inspResultObj = aa.inspection.getInspections(capId);
		if (inspResultObj.getSuccess()) {
			var inspList = inspResultObj.getOutput();
			for (index in inspList) {
				if (inspList[index].getInspectionType().toUpperCase().indexOf("CLEARWATER") >= 0
					 && matches(inspList[index].getInspectionStatus().toUpperCase(), "PASS", "COMPLETE", "CANCELLED")) {
					clearInspectionPassed = true;
				}
				if (inspList[index].getInspectionType().toUpperCase().indexOf("SUPER FLUSH") >= 0
					 && matches(inspList[index].getInspectionStatus().toUpperCase(), "PASS", "COMPLETE", "CANCELLED")) {
					superInspectionPassed = true;
				}
				if (inspList[index].getInspectionType().toUpperCase().indexOf("HYDROSTATIC PRESSURE TEST") >= 0
					 && matches(inspList[index].getInspectionStatus().toUpperCase(), "PASS", "COMPLETE", "CANCELLED")) {
					hydroInspectionPassed = true;
				}
			}
		}

		if (!clearInspectionPassed || !hydroInspectionPassed || !superInspectionPassed) {
			cancel = true;
			showMessage = true;
			comment("Task cannot be completed until the Clearwater, super flush, pressure test Inspection has been approved");
		}
	}
	logDebug("script89_PreventInspStatus ended.");

}
