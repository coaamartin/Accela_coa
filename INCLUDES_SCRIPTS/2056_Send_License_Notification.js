if (balanceDue > 0) {
logDebug("Starting _License_Notification script");
var contacts = 'Primary';
var emailTemplate = 'LIC FEES INVOICED';
var reportName = 'Invoice Report';
var reportParam = capId;
logDebug("REPORT PARAM IS ="+capId);
emailContactsWithReportLinkASync(contacts, emailTemplate, "", "", "", "N", "");
logDebug("Finished email without report");
emailContactsWithReportAttachASync(contacts, emailTemplate, "", reportName, reportParam, "N", "")
logDebug("Finished Running email with Report");
logDebug("End of 2056_License_Notification script");
}