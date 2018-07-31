function getContactName(vConObj) {
	if (vConObj.people.getContactTypeFlag() == "organization") {
		if (vConObj.people.getBusinessName() != null && vConObj.people.getBusinessName() != "")
			return vConObj.people.getBusinessName();
		
		return vConObj.people.getBusinessName2();
	}
	else {
		if (vConObj.people.getFullName() != null && vConObj.people.getFullName() != "") {
			return vConObj.people.getFullName();
		}
		if (vConObj.people.getFirstName() != null && vConObj.people.getLastName() != null) {
			return vConObj.people.getFirstName() + " " + vConObj.people.getLastName();
		}
		if (vConObj.people.getBusinessName() != null && vConObj.people.getBusinessName() != "")
			return vConObj.people.getBusinessName();
	
		return vConObj.people.getBusinessName2();
	}
}