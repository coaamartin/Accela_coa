
capStatus = aa.cap.getCap(capId).getOutput().getCapStatus();


if (isPublicUser && capStatus.equals("In Review")) {
	var message = "AAAAA";
	cancel = true;
	showMessage=true;
	showDebug=true;

	aa.env.setValue("ScriptReturnCode", "1");
	if (showMessage) aa.env.setValue("ScriptReturnMessage", "<font color=red><b>Action Cancelled</b></font><br><br>" + message);
	if (showDebug) aa.env.setValue("ScriptReturnMessage", "<font color=red><b>Action Cancelled</b></font><br><br>");
	if (showMessage) aa.env.setValue("ErrorMessage", "<font color=red><b>Action Cancelled</b></font><br><br>" + message);
}
