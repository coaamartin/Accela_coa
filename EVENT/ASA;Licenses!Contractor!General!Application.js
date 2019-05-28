
// script 91 - test for updatetask

updateTask("License Issuance", "Active", "", "");

var applicantContact = getContactObj(capId,"Contractor Applicant");
if (applicantContact) {
	editAppName(applicantContact.people.getBusinessName());
	}


