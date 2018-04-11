function forestryInspectionResultAutomation() {
	if (inspType == "Forestry Inspection" && inspResult == "Complete") {
		var checklist = false;

		var checkListResutArray = loadFIGuideSheetItems(inspId);
		for (i in checkListResutArray) {
			if (checkListResutArray[i] == "Yes") {
				checklist = true;
				break;
			}

		}

		if (checklist == true) {
			closeTask("Inspection Phase", "Complete", "", "");

			var tasks = aa.workflow.getTasks(capId).getOutput();
			for (x in tasks) {
				if (isTaskActive(tasks[x].getTaskDescription())) {
					deactivateTask(tasks[x].getTaskDescription());
				}

			}

		}

	}
	if (inspType == "Forestry Inspection" && inspResult == "Fall Trim") {

		var checklist = false;

		var checkListResutArray = loadFIGuideSheetItems(inspId);
		for (i in checkListResutArray) {
			if (checkListResutArray[i] == "Yes") {
				checklist = true;
				break;
			}
		}

		if (checklist == true) {
			closeTask("Inspection Phase", "Complete", "", "");

			var tasks = aa.workflow.getTasks(capId).getOutput();
			for (x in tasks) {
				if (isTaskActive(tasks[x].getTaskDescription())) {
					deactivateTask(tasks[x].getTaskDescription());
				}
			}
		}
	}
	if (inspType == "Forestry Inspection" && inspResult != "Complete") {

		var now = new Date();
		var treeId = "";
		var diameter = "";
		var inspectionId = "";
		var requestComment = "";
		var updateMap = aa.util.newHashtable();

		//		treeId = getUnitNbrArray(inspId);
		var thisInspection = aa.inspection.getInspection(capId, inspId);
		if (!thisInspection.getSuccess()) {
			logDebug("**WARN failed to get inspection " + inspId + " Err: " + thisInspection.getErrorMessage());
			return false;
		}

		thisInspection = thisInspection.getOutput();

		treeId = thisInspection.getInspection().getActivity().getUnitNBR();
		diameter = thisInspection.getInspection().getActivity().getVehicleID();
		requestComment = thisInspection.getInspection().getRequestComment();

		var schedRes = aa.inspection.scheduleInspection(capId, null, aa.date.parseDate(nextWorkDay(new Date())), null, "Field Crew Inspection", requestComment);

		if (schedRes.getSuccess()) {
			inspectionId = schedRes.getOutput();
		} else {
			logDebug("ERROR: scheduling inspection for TreeID (" + treeId + "): " + schedRes.getErrorMessage());
			return false;
		}

		var newInspection = aa.inspection.getInspection(capId, inspectionId).getOutput();
		if (diameter != null && diameter != "") {
			newInspection.getInspection().getActivity().setVehicleID(diameter);
		}
		if (treeId != null && treeId != "") {
			newInspection.getInspection().getActivity().setUnitNBR(treeId);
		}
		var edit = aa.inspection.editInspection(newInspection);

		//Copy check list with value = yes
		CopyCheckList(inspectionId);
	}
	if (inspType == "Forestry Inspection" && (inspResult == "PR1" || inspResult == "PR2" || inspResult == "PR2" || inspResult == "Other")) {
		updateTask("Inspection Phase", "Complete");
		var tasks = aa.workflow.getTasks(capId).getOutput();
		for (x in tasks) {
			if (isTaskActive(tasks[x].getTaskDescription())) {
				deactivateTask(tasks[x].getTaskDescription());
			}
		}
	}
	if (inspType == "Forestry Inspection" && inspResult == "Forestry Refer to Code") {

		var newCap = createCap("Enforcement/incident/zoning/NA");

		var linkResult = aa.cap.createAppHierarchy(capId, newCap);
		if (linkResult.getSuccess())
			logDebug("Successfully linked to Parent Application ");
		else
			logDebug("**ERROR: linking to parent application parent cap id  " + linkResult.getErrorMessage());

		updateAppStatus("Complete", "By script");

		var tasks = aa.workflow.getTasks(capId).getOutput();
		for (x in tasks) {
			if (isTaskActive(tasks[x].getTaskDescription())) {
				deactivateTask(tasks[x].getTaskDescription());
			}
		}
	}
}
