
/**
 * prepare parameters and calls the method that will do the actual work
 */
function autoCloseWorkflow() {
	var recTypesAry = new Array();
	var matched = false;
	//#1
	recTypesAry = [ "Building/Permit/Plans/Amendment", "Building/Permit/New Building/Amendment", "Building/Permit/Master/Amendment", "Building/Permit/Master/NA" ];
	matched = checkBalanceAndStatusUpdateRecord(recTypesAry, "Payment Pending", "Fee Processing", "Complete", "Approved");

	//#2
	if (!matched) {
		recTypesAry = new Array();
		recTypesAry = [ "Building/Permit/New Building/NA", "Building/Permit/Plans/NA" ];
		matched = checkBalanceAndStatusUpdateRecord(recTypesAry, "Payment Pending", "Fee Processing", "Issued", "Issued");
		matched = checkBalanceAndStatusUpdateRecord(recTypesAry, "Ready to Issue", "Permit Issuance", "Issued", "Issued");
		
		//extra steps for #2
		//2.1
		if (matched) {
			if (appMatch("Building/Permit/New Building/NA")) {
				activateTask("Water Meter");
				activateTask("Inspection Phase");
				activateTask("Waste Water");
				activateTask("Special Inspection Check");
				activateTask("FEMA Elevation Certificate");
			}//2.1

			//2.2
			if (appMatch("Building/Permit/Plans/NA")) {
				activateTask("Waste Water");
				activateTask("Inspection Phase");
				activateTask("Special Inspection Check");
			}//2.2
		}//matched
	}

	//#3
	if (!matched) {
		recTypesAry = new Array();
		recTypesAry = [ "Building/Permit/No Plans/NA" ];
		matched = checkBalanceAndStatusUpdateRecord(recTypesAry, "Submitted", "Fee Processing", "Issued", "Issued");
	}
}
