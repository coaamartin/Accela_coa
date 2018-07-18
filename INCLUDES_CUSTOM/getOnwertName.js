function getOnwertName() {
	var ownArr = getOwner(capId);
	var ownName = "";
	
	if(!ownArr) return ownName;	
	if(ownArr.length == 0) return ownName;
	
	for(each in ownArr){
		anOwn = ownArr[each];
		
	    if(anOwn.getPrimaryOwner() == "Y"){
			if(anOwn.getOwnerFullName() != null && anOwn.getOwnerFullName() != "" && anOwn.getOwnerFullName() != undefined)
				return  anOwn.getOwnerFullName();
			
			if(anOwn.getOwnerFirstName() != null && anOwn.getOwnerFirstName() != "" && anOwn.getOwnerFirstName() != undefined &&
			   anOwn.getOwnerLastName() != null && anOwn.getOwnerLastName() != "" && anOwn.getOwnerLastName() != undefined)
			   return anOwn.getOwnerFirstName() + " " + anOwn.getOwnerLastName();
		}
		else{
			if(anOwn.getOwnerFullName() != null && anOwn.getOwnerFullName() != "" && anOwn.getOwnerFullName() != undefined)
				ownName = anOwn.getOwnerFullName();
			
			if(anOwn.getOwnerFirstName() != null && anOwn.getOwnerFirstName() != "" && anOwn.getOwnerFirstName() != undefined &&
			   anOwn.getOwnerLastName() != null && anOwn.getOwnerLastName() != "" && anOwn.getOwnerLastName() != undefined)
			   ownName = anOwn.getOwnerFirstName() + " " + anOwn.getOwnerLastName();
		}
	}
	
	return ownName;
}