function getPrimaryOwnerFirstAndLastName(){
	capOwnerResult = aa.owner.getOwnerByCapId(capId);

	if (capOwnerResult.getSuccess()) {
		owner = capOwnerResult.getOutput();

		for (o in owner) {
			thisOwner = owner[o];
			if (thisOwner.getPrimaryOwner() == "Y") {
			    if(thisOwner.getOwnerFirstName()) return thisOwner.getOwnerFirstName() + thisOwner.getOwnerLastName();
			}
		}
	}
	
	return "";
}//END getPrimaryOwnerFirstAndLastName