logDebug("Starting PPA Public Improvement");
logDebug("Current balance: " + balanceDue);
//Check balance and update task
if (appMatch("PublicWorks/Public Improvement/Permit/*")) {
	if (balanceDue == 0) {
		closeTask("Fee Processing", "Complete", "", "");
	}
}
logDebug("Ending PPA Public Improvement");
