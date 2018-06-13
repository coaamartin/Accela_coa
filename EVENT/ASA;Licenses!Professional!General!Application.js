
// script 91
var applicantContact = getContactObj(capId,"License Holder");
if (applicantContact) {
	editAppName(applicantContact.people.getFirstName() + " " + applicantContact.people.getLastName());
	}


