if (balanceDue > 0) {
logDebug("Starting _License_Notification script");
var pEmailTemplate = 'LIC FEES INVOICED'
var pEParams = aa.util.newHashMap();
pEParams.put("capId", capId);
pEParams.put("cap", cap);
pEParams.put("INVOICEID", InvoiceNbr);
pEParams.put("AGENCYID", "AURORACO");
//var vAsyncScript = "SEND_LICENSE_INVOICE_ASYNC";
//aa.runAsyncScript(vAsyncScript, pEParams);
emailContactsWithReportLinkASync('Primary', pEmailTemplate, pEParams)
logDebug("CapID info: " + pEParams);
logDebug("Invoice NBR: " + InvoiceNbr);
logDebug("End of 2056_License_Notification script");
logDebug("**END** SEND_License_INVOICE_ASYNC kicks off from here");
}