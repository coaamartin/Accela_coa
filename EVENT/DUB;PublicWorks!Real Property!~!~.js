
showMessage=true;
showDebug=true;
var message = "AAAAA";
var cancel=true;
//if (isPublicUser) {
if (cancel) {
	aa.env.setValue("ScriptReturnCode", "0");
	if (showMessage) aa.env.setValue("ScriptReturnMessage", "<font color=red><b>Action Cancelled</b></font><br><br>" + message);
	if (showDebug) aa.env.setValue("ScriptReturnMessage", "<font color=red><b>Action Cancelled</b></font><br><br>");
	if (showMessage) aa.env.setValue("ErrorMessage", "<font color=red><b>Action Cancelled</b></font><br><br>" + message);
}
//} 