logDebug("Starting SEND_ISSUEDLICENSE_EMAIL script");
var contacts = 'Primary';
var emailTemplate = 'LIC ISSUED EMAIL';
var reportName = '';
var reportParam = editIdString
logDebug("REPORT PARAM is = "+editIdString);
emailContactsWithReportAttachASync(contacts, emailTemplate, "", "", "", "N", "")
//emailContactsWithReportAttachASync(contacts, emailTemplate, "", reportName, reportParam, "N", "")
logDebug("End of 2056_License_Notification script");