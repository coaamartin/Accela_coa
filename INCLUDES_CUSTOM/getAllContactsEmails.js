
function getAllContactsEmails(){
	var vConObjArry = getContactObjsByCap(capId);
	var emailsString = "";
	for(eachCont in vConObjArry){
		var vConObj = vConObjArry[eachCont];
		var vConRefSeqNbr = vConObj.refSeqNumber;
		//Get contact email
		if (vConObj) {
			conEmail = vConObj.people.getEmail();
			if (conEmail && conEmail != null && conEmail != "") {
				conEmail = conEmail.toUpperCase();
				emailsString += conEmail + ",";
			}
		}
	}
	
	if(emailsString.length > 0) return emailsString.slice(0, -1)
	
    return false;
}