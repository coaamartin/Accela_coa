if (balanceDue > 0) {
logDebug("Starting _License_Notification script");
var InvoiceNbr = InvoiceNbrArray[0] + "";
var envParameters = aa.util.newHashMap();
envParameters.put("capId", capId);
envParameters.put("cap", cap);
envParameters.put("INVOICEID", InvoiceNbr);
envParameters.put("AGENCYID", "AURORACO");
var vAsyncScript = "SEND_LICENSE_INVOICE_ASYNC";
aa.runAsyncScript(vAsyncScript, envParameters);
logDebug("CapID info: " + envParameters);
logDebug("Invoice NBR: " + InvoiceNbr);
logDebug("End of 2056_License_Notification script");
logDebug("**END** SEND_License_INVOICE_ASYNC kicks off from here");
}