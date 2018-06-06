function getPrimaryOwnerFullName(){
	capOwnerResult = aa.owner.getOwnerByCapId(capId);

	if (capOwnerResult.getSuccess()) {
		owner = capOwnerResult.getOutput();

		for (o in owner) {
			thisOwner = owner[o];
			if (thisOwner.getPrimaryOwner() == "Y") {
			    return thisOwner.getOwnerFullName();
			}
		}
	}
	
	return "";
}//END getPrimaryOwnerFullName