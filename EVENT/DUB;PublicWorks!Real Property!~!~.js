showMessage=true;
showDebug=true;
var message = "AAAAA";
cancel = true;

//if (isPublicUser) {
if (cancel) {
	aa.env.setValue("ScriptReturnCode", "1"); 
	aa.env.setValue("ScriptReturnMessage", "WorkflowTaskUpdateAfter for Renewal process.");
/*
	if (showMessage) aa.env.setValue("ScriptReturnMessage", "<font color=red><b>Action Cancelled</b></font><br><br>" + message);
	if (showDebug) aa.env.setValue("ScriptReturnMessage", "<font color=red><b>Action Cancelled</b></font><br><br>");
	if (showMessage) aa.env.setValue("ErrorMessage", "<font color=red><b>Action Cancelled</b></font><br><br>" + message);*/
}
//} 