
// script 91

updateTask("License Issuance", "Active", "Active", "Active");

var applicantContact = getContactObj(capId,"Contractor Applicant");
if (applicantContact) {
	editAppName(applicantContact.people.getBusinessName());
	}


