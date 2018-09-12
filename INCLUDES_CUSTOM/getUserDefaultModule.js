function getUserDefaultModule(pUserName) {
	var vUserProfileValue = aa.userright.getUserProfileValue(pUserName,"Default Module");
	var x = 0;
	if (vUserProfileValue.getSuccess() && vUserProfileValue.getOutput() != null) {
		vUserProfileValue = vUserProfileValue.getOutput();
		if (vUserProfileValue.getServerConstantValue() != null) {
			return vUserProfileValue.getServerConstantValue();
		} else {
			logDebug("User " + pUserName + " does not have a default module configured.");
			return false;
		}
	} else {
		logDebug("Failed to get default user module for user ID: " + pUserName);
		return false;
	}
}
