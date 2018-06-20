function getPrimaryOwnerEmail(){
	capOwnerResult = aa.owner.getOwnerByCapId(capId);

	if (capOwnerResult.getSuccess()) {
		owner = capOwnerResult.getOutput();

		for (o in owner) {
			thisOwner = owner[o];
			if (thisOwner.getPrimaryOwner() == "Y") {
				var oEmail = thisOwner.getEmail();
			    if(oEmail != null && oEmail != "" && oEmail != undefined)
				    return oEmail;
			}
		}
	}
	
	return false;
}//END getPrimaryOwnerEmail