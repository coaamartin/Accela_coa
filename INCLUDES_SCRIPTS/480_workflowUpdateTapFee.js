//Script 480 - SWAKIL
if (balanceDue == 0) {
	closeTask("Fee Processing", "Fees Paid", "by script, PRA balance=0", "by script, PRA balance=0");
	activateTask("Water Meter Set");
	updateAppStatus("Ready for Meter Set", "by script, PRA balance=0");
}