function loadUserProperties(usrArr, usrId){
	var usrObjResult = aa.person.getUser(currentUserID);
	
	if(!usrObjResult.getSuccess()) return false;
	
	var usrObj = usrObjResult.getOutput();
	
	usrArr["FullName"] = usrObj.getFullName();
	usrArr["PhoneNumer"] = usrObj.getPhoneNumber();
	usrArr["Email"] = usrObj.getEmail();
}