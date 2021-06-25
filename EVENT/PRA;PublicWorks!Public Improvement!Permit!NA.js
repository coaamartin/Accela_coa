logDebug("Starting PRA Public Improvement");
logDebug("Current balance: " + balanceDue);
//Check balance and update task
if (appMatch("PublicWorks/Public Improvement/Permit/*")) {
	if (balanceDue == 0) {
		closeTask("Fee Processing", "Complete", "", "");
	}
}
logDebug("Ending PRA Public Improvement");
