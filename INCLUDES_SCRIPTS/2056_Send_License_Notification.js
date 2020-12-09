if (balanceDue > 0) {
logDebug("Starting _License_Notification script");
var contacts = 'Primary';
var emailTemplate = 'LIC FEES INVOICED';
var reportName = 'Invoice Report';
var reportParam = capId;
//emailContactsWithReportLinkASync(contacts, emailTemplate, "", "", "", "N", "")
emailContactsWithReportAttachASync(contacts, emailTemplate, "", reportName, reportParam, "N", "")
logDebug("End of 2056_License_Notification script");
}