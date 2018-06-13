
// script 91
var applicantContact = getContactObj(capId,"Arborist Applicant");
if (applicantContact) {
	editAppName(applicantContact.people.getFirstName() + " " + applicantContact.people.getLastName());
	}


