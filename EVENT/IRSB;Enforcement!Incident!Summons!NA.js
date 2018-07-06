// script 424

if ("Summons Issuance".equals(inspType)) {
	if (matches(inspResult,"Visit/Attempted Contact","Letter to be Sent","Personal Service","Compliance","Cancelled")) {
		if (inspId && "Scheduled".equals(String(aa.inspection.getInspection(capId,inspId).getOutput().getInspectionStatus()))) {
			cancel = true;
			comment("Inspection can't be resulted with this status.   Initial status must be 'Taken and Stored - Summons' or 'Taken and Stored - Citation");
			showMessage = true;
		}
	}
}

// end script 424