function getContactEmailAddress(contType, itemCap){
	var thisContact = getContactByType(contType, itemCap);
	aa.print("Test:"+ thisContact)
	var thisContEmailAddr = thisContact.getEmail();
	
	if(thisContEmailAddr) return thisContEmailAddr;
	return false;
}