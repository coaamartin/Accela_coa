function getAssignedStaffFullName(){
	var cdScriptObjResult = aa.cap.getCapDetail(capId);
	if (!cdScriptObjResult.getSuccess()) {
		logDebug("**ERROR: No cap detail script object : " + cdScriptObjResult.getErrorMessage());
        return ""
	}
	var cdScriptObj = cdScriptObjResult.getOutput();
	if (!cdScriptObj) {
		logDebug("**ERROR: No cap detail script object");
		return ""
	}
	var cd = cdScriptObj.getCapDetailModel();
    var	userId=cd.getAsgnStaff();
    if (userId==null) return "";
	var iNameResult = aa.person.getUser(userId);
	var iName = iNameResult.getOutput();
	var fullName=iName.getFullName();
	return fullName;
}