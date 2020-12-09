if (balanceDue > 0) {
logDebug("Starting _License_Notification script");
var contacts = 'Primary';
var emailTemplate = 'LIC FEES INVOICED';
var reportName = 'Invoice Report';
var altID = capId.getCustomID()
var reportParam = altID;
logDebug("REPORT PARAM IS ="+reportParam);
emailContactsWithReportLinkASync(contacts, emailTemplate, "", "reportName", "reportParam", "N", "");
logDebug("Finished email without report");
//emailContactsWithReportAttachASync(contacts, emailTemplate, "", reportName, reportParam, "N", "")
//logDebug("Finished Running email with Report");
logDebug("End of 2056_License_Notification script");
}