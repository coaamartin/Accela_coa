if (balanceDue > 0) {
logDebug("Starting _License_Notification script");
var invoiceNbrObj = getLastInvoice({});
var invNbr = invoiceNbrObj.getInvNbr();
var altID = capId.getCustomID()
appType = cap.getCapType().toString();
var vAsyncScript = "SEND_EMAIL_TAXLIC_INVOICE_ASYNC";
var envParameters = aa.util.newHashMap();
envParameters.put("altID", altID);
envParameters.put("capId", capId);
envParameters.put("cap", cap);
envParameters.put("INVOICEID", String(invNbr));
logDebug("Starting to kick off ASYNC event for Invoice. Params being passed: " + envParameters);
aa.runAsyncScript(vAsyncScript, envParameters);
logDebug("End of 2056_License_Notification script");
}