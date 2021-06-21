if (matches(inspResult,"Failed", "Fail", "Cancelled", "Canceled") && matches(inspComment,"",null,undefined)) {
	cancel = true;
	showMessage = true;
	comment("Inspection result comments are required");
			
}