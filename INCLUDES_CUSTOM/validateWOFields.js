function validateWOFields() {
try{
	if (wfTask=="Draft Workorder" && wfStatus=="Workorder Drafted"){
		useAppSpecificGroupName=false;
		var location=getAppSpecific("Location");
		var description=getAppSpecific("Description");
		var priority=getAppSpecific("Work Order Priority");
		if (isBlankOrNull(location)|| isBlankOrNull(description) || isBlankOrNull(priority)){
			throw "Missing Information. Info Fields Description, Location, and Work Order Priority in the WORK ORDER INFORMATION section must be filled out prior to saving this task status.";
		}
	}
}catch(e){
	cancel = true;
	showMessage = true;
	comment(e);
}
}