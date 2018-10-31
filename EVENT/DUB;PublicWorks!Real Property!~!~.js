
/* var currUserId = aa.env.getValue("CurrentUserID");
var isPublicUser = false;
if (typeof publicUser === 'undefined') {
	isPublicUser = currUserId.indexOf("PUBLICUSER") == 0;
} else {
	isPublicUser = publicUser;
}
 
 */
 
capStatus = aa.cap.getCap(capId).getOutput().getCapStatus();

//JMP - Removed to see if PublicUser is the issue .. if (isPublicUser && capStatus.equals("In Review")) {

if (capStatus.equals("In Review")) {
	var message = "Can not upload a document while record status is In Review";
	cancel = true;
	showMessage=true;

	if (cancel) {
		aa.env.setValue("ScriptReturnCode", "1");
		if (showMessage)
			aa.env.setValue("ScriptReturnMessage", "<font color=red><b>Action Cancelled </b></font><br><br>" + message);
		
	}
}
