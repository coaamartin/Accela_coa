
// script 91

updateTask("License Issuance", "Active", "Updated by Issue Log #60", "Updated by Issue Log #60");

var applicantContact = getContactObj(capId,"Contractor Applicant");
if (applicantContact) {
	editAppName(applicantContact.people.getBusinessName());
	}


