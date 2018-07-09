// script 424
if ("Abatement Approval".equals(inspType)) {
	if (matches(inspResult,"Invoice Denied","Invoice Approved")) {
		if (inspId && "Scheduled".equals(String(aa.inspection.getInspection(capId,inspId).getOutput().getInspectionStatus()))) {
			cancel = true;
			showMessage = true;
			comment("Inspection can't be resulted with this status.   Initial status must be 'Bill and Photo Denied' or 'Bill and Photo Approved'");
		}
	}
}

if ("Board-Up Abatement Order".equals(inspType)) {
	if (matches(inspResult,"Taken and Stored")) {
		if (inspId && "Scheduled".equals(String(aa.inspection.getInspection(capId,inspId).getOutput().getInspectionStatus()))) {
			cancel = true;
			showMessage = true;
			comment("Inspection can't be resulted with this status.   Initial status must be 'Called In Service Request'");
		}
	}
}
if ("City Abatement Order".equals(inspType)) {
	if (matches(inspResult,"Taken and Stored")) {
		if (inspId && "Scheduled".equals(String(aa.inspection.getInspection(capId,inspId).getOutput().getInspectionStatus()))) {
			cancel = true;
			showMessage = true;
			comment("Inspection can't be resulted with this status.   Initial status must be 'Completed Service Request' or 'Called In Service Request'");
		}
	}
}
if ("Graffiti Abatement Order".equals(inspType)) {
	if (matches(inspResult,"Taken and Stored")) {
		if (inspId && "Scheduled".equals(String(aa.inspection.getInspection(capId,inspId).getOutput().getInspectionStatus()))) {
			cancel = true;
			showMessage = true;
			comment("Inspection can't be resulted with this status.   Initial status must be 'Completed Service Request'");
		}
	}
}
if ("Regular Abatement Order".equals(inspType)) {
	if (matches(inspResult,"Taken and Stored")) {
		if (inspId && "Scheduled".equals(String(aa.inspection.getInspection(capId,inspId).getOutput().getInspectionStatus()))) {
			cancel = true;
			showMessage = true;
			comment("Inspection can't be resulted with this status.   Initial status must be 'Completed Service Request' or 'Called In Service Request'");
		}
	}
}
if ("Snow Abatement Order".equals(inspType)) {
	if (matches(inspResult,"Taken and Stored")) {
		if (inspId && "Scheduled".equals(String(aa.inspection.getInspection(capId,inspId).getOutput().getInspectionStatus()))) {
			cancel = true;
			showMessage = true;
			comment("Inspection can't be resulted with this status.   Initial status must be 'Completed Service Request'");
		}
	}
}
// end script 424