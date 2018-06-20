function getContactEmailAddress(contType, itemCap){
	var thisContact = getContactByType(contType, itemCap);
	var thisContEmailAddr = thisContact.getEmail();
	
	if(thisContEmailAddr) return thisContEmailAddr;
	return false;
}