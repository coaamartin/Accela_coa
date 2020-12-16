logDebug("Starting PRA tax and Licensing");
logDebug("Current balance: " + balanceDue);
//Check balance and update task
if (appMatch("Licenses/Supplemental/*/*") || appMatch("Licenses/Liquor/*/*")) {
	if (balanceDue == 0) {
		branchTask("Fees", "Paid", "", "");
	}
}
logDebug("Ending PRA tax and Licensing");