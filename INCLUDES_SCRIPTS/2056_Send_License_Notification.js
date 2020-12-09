if (balanceDue > 0) {
logDebug("Starting _License_Notification script");
//var contacts = 'Primary';
//var emailTemplate = 'LIC FEES INVOICED';
//var reportName = 'Invoice Report';
var altID = capId.getCustomID()
appType = cap.getCapType().toString();
var vAsyncScript = "SEND_EMAIL_TAXLIC_INVOICE_ASYNC";
var envParameters = aa.util.newHashMap();
envParameters.put("altID", altID);
envParameters.put("capId", capId);
envParameters.put("cap", cap);
logDebug("Starting to kick off ASYNC event for Invoice. Params being passed: " + envParameters);
aa.runAsyncScript(vAsyncScript, envParameters);
//logDebug("REPORT PARAM IS ="+reportParam);
//emailContactsWithReportLinkASync(contacts, emailTemplate, "", "reportName", "reportParam", "N", "");
//logDebug("Finished email without report");
//emailContactsWithReportAttachASync(contacts, emailTemplate, "", reportName, reportParam, "N", "")
//logDebug("Finished Running email with Report");
logDebug("End of 2056_License_Notification script");
}