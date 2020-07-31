if (balanceDue > 0) {
logDebug("Starting _License_Notification script");
var contacts = 'Primary,Applicant';
var emailTemplate = 'LIC FEES INVOICED';
emailContactsWithReportLinkASync(contacts, emailTemplate, "", "", "", "N", "")
logDebug("End of 2056_License_Notification script");
}