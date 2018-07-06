function contactByBusNameExistsOnCap(busName, itemCapId){
	// optional typeToCheck
    var typeToCheck = false;
    if (arguments.length == 3) {
		typeToCheck = arguments[2];
	}
	var capContactArray = null;
	
	var capContactResult = aa.people.getCapContactByCapID(itemCapId);
    if (capContactResult.getSuccess()) {
        capContactArray = capContactResult.getOutput();
    }
	
	if(!capContactArray) return false;
	
	for(each in capContactArray) {
		capCon = capContactArray[each];
		var capPeople = capCon.getPeople();
		var conType = capPeople.getContactType();
		var conBusName = capPeople.getBusinessName();
		
		if((typeToCheck && busName == conBusName && typeToCheck == conType) || (!typeToCheck && busName == conBusName)) return true;
	}
	
	return false;
}//END contactByBusNameExistsOnCap();